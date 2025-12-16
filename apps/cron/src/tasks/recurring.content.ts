import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RecurringContentRepository } from '@gitroom/nestjs-libraries/database/prisma/recurring-content/recurring.content.repository';
import { RecurringContentService } from '@gitroom/nestjs-libraries/database/prisma/recurring-content/recurring.content.service';

@Injectable()
export class RecurringContentCron {
  private readonly logger = new Logger(RecurringContentCron.name);

  constructor(
    private _recurringContentRepository: RecurringContentRepository,
    private _recurringContentService: RecurringContentService
  ) {}

  /**
   * Run every 30 minutes to check for scheduled content
   */
  @Cron('*/30 * * * *')
  async handleCron() {
    this.logger.log('Checking for due recurring content...');

    try {
      // Get content that needs to be generated now
      const dueContent = await this._recurringContentRepository.getDueContent();

      if (dueContent.length === 0) {
        this.logger.log('No due content found');
        return;
      }

      this.logger.log(`Found ${dueContent.length} due content item(s)`);

      // Process each due content item
      for (const content of dueContent) {
        try {
          this.logger.log(`Processing: ${content.name} (${content.id})`);

          // Generate and schedule the content
          await this._recurringContentService.generateAndScheduleContent({
            organizationId: content.organizationId,
            active: content.active,
            topics: JSON.parse(content.topics),
            integrationIds: JSON.parse(content.integrations),
            style: content.style as any,
            videoOrientation: content.videoOrientation as any,
            aiProvider: content.aiProvider as any,
          });

          // Update last run time
          await this._recurringContentRepository.updateLastRunAt(content.id);

          this.logger.log(`Successfully processed: ${content.name}`);
        } catch (error) {
          this.logger.error(
            `Error processing ${content.name}:`,
            error.message
          );
        }
      }
    } catch (error) {
      this.logger.error('Error in recurring content cron:', error);
    }
  }
}

