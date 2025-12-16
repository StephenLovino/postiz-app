import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { PostsService } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.service';
import { MediaService } from '@gitroom/nestjs-libraries/database/prisma/media/media.service';
import { IntegrationService } from '@gitroom/nestjs-libraries/database/prisma/integrations/integration.service';
import { makeId } from '@gitroom/nestjs-libraries/services/make.is';
import dayjs from 'dayjs';
import { z } from 'zod';

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-proj-',
  model: 'gpt-4o',
  temperature: 0.9,
});

const contentIdeaSchema = z.object({
  topic: z.string().describe('The main topic or theme for the content'),
  videoPrompt: z.string().describe('Detailed prompt for Veo 3 video generation (describe visuals, mood, style)'),
  postCaption: z.string().describe('Engaging social media caption (max 280 chars)'),
  hashtags: z.array(z.string()).describe('3-5 relevant hashtags'),
});

interface RecurringContentConfig {
  organizationId: string;
  active: boolean;
  topics: string[]; // Topics to generate content about
  integrationIds: string[]; // Which social channels to post to
  style: 'educational' | 'entertaining' | 'inspirational' | 'news' | 'viral';
  videoOrientation: 'vertical' | 'horizontal';
}

@Injectable()
export class RecurringContentService {
  constructor(
    private _postsService: PostsService,
    private _mediaService: MediaService,
    private _integrationService: IntegrationService,
  ) {}

  /**
   * Generate and schedule a post with AI-generated video
   */
  async generateAndScheduleContent(config: RecurringContentConfig) {
    if (!config.active) {
      console.log('Recurring content is not active');
      return;
    }

    if (!process.env.OPENAI_API_KEY || !process.env.KIEAI_API_KEY) {
      console.log('Missing required API keys (OPENAI_API_KEY or KIEAI_API_KEY)');
      return;
    }

    try {
      // Step 1: Generate content idea using AI
      const contentIdea = await this.generateContentIdea(config);
      console.log('Generated content idea:', contentIdea);

      // Step 2: Generate video using Veo 3
      const videoMedia = await this.generateVideo(
        config.organizationId,
        contentIdea.videoPrompt,
        config.videoOrientation
      );
      console.log('Generated video:', videoMedia);

      // Step 3: Create the social media post caption
      const caption = this.formatCaption(contentIdea);

      // Step 4: Schedule the post to all selected integrations
      await this.schedulePost(
        config.organizationId,
        config.integrationIds,
        caption,
        videoMedia
      );

      console.log('Successfully scheduled recurring content post');
    } catch (error) {
      console.error('Error generating recurring content:', error);
      throw error;
    }
  }

  /**
   * Generate content idea using OpenAI
   */
  private async generateContentIdea(
    config: RecurringContentConfig
  ): Promise<z.infer<typeof contentIdeaSchema>> {
    const topicsList = config.topics.join(', ');
    const styleGuide = this.getStyleGuide(config.style);

    const prompt = `You are a viral content creator. Generate a ${config.style} content idea.

**Topics to explore**: ${topicsList}

**Style Guide**: ${styleGuide}

**Requirements**:
- Create engaging, scroll-stopping content
- Video prompt should be detailed and cinematic
- Caption should hook viewers in the first line
- Use trending formats and storytelling techniques

Generate a complete content package with:
1. A specific topic/angle
2. Detailed video prompt for Veo 3 (describe scenes, mood, camera angles, style)
3. Engaging social media caption
4. Relevant hashtags`;

    const structuredLlm = model.withStructuredOutput(contentIdeaSchema);
    const result = await structuredLlm.invoke(prompt);

    return result as z.infer<typeof contentIdeaSchema>;
  }

  /**
   * Generate video using Veo 3
   */
  private async generateVideo(
    organizationId: string,
    prompt: string,
    orientation: 'vertical' | 'horizontal'
  ) {
    const org = { id: organizationId } as any;

    return await this._mediaService.generateVideo(org, {
      type: 'veo3',
      output: orientation,
      customParams: {
        prompt,
        images: [],
      },
    });
  }

  /**
   * Format caption with hashtags
   */
  private formatCaption(contentIdea: z.infer<typeof contentIdeaSchema>): string {
    const hashtags = contentIdea.hashtags.map((tag) => 
      tag.startsWith('#') ? tag : `#${tag}`
    ).join(' ');

    return `${contentIdea.postCaption}\n\n${hashtags}`;
  }

  /**
   * Schedule post to social media
   */
  private async schedulePost(
    organizationId: string,
    integrationIds: string[],
    caption: string,
    videoMedia: any
  ) {
    // Get integrations
    const allIntegrations = await this._integrationService.getIntegrationsList(
      organizationId
    );
    const selectedIntegrations = allIntegrations.filter((i) =>
      integrationIds.includes(i.id)
    );

    if (selectedIntegrations.length === 0) {
      throw new Error('No valid integrations found');
    }

    // Find next available time slot
    const nextTime = await this._postsService.findFreeDateTime(organizationId);

    // Create post for each integration
    await this._postsService.createPost(organizationId, {
      date: nextTime + 'Z',
      order: makeId(10),
      shortLink: false,
      type: 'schedule',
      tags: [],
      posts: selectedIntegrations.map((integration) => ({
        settings: {
          __type: integration.providerIdentifier as any,
          title: '',
          tags: [],
          subreddit: [],
        },
        group: makeId(10),
        integration: { id: integration.id },
        value: [
          {
            id: makeId(10),
            content: caption,
            image: [
              {
                id: videoMedia.id,
                name: videoMedia.id,
                path: videoMedia.path,
                organizationId,
              },
            ],
          },
        ],
      })),
    });
  }

  /**
   * Get style-specific guidelines
   */
  private getStyleGuide(style: string): string {
    const guides = {
      educational: 'Focus on teaching something valuable. Use clear explanations and actionable insights.',
      entertaining: 'Make it fun and engaging. Use humor, surprises, or interesting stories.',
      inspirational: 'Motivate and uplift. Share success stories, life lessons, or empowering messages.',
      news: 'Cover trending topics or recent events. Be informative and timely.',
      viral: 'Create scroll-stopping, highly shareable content. Use trending formats, hooks, and emotional triggers.',
    };

    return guides[style] || guides.viral;
  }
}

