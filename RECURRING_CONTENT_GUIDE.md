# 🤖 Automated Recurring Content Generator

Generate and post AI videos automatically like faceless.video!

## ✨ Features

- **Automated Video Generation**: Uses Veo 3 to create videos 3x per week (or custom schedule)
- **AI Content Ideas**: GPT-4 generates topics, captions, and video prompts
- **Custom Topics**: Choose what your content is about
- **Multiple Styles**: Educational, entertaining, inspirational, news, or viral
- **Multi-Platform**: Post to all your connected social media channels
- **Flexible Scheduling**: Set specific days and times

## 🔧 Setup Requirements

1. **OpenAI API Key** (for content generation)
   ```env
   OPENAI_API_KEY="sk-..."
   ```

2. **kie.ai API Key** (for Veo 3 video generation)
   ```env
   KIEAI_API_KEY="your-key-here"
   ```

3. **Run Database Migration**:
   ```bash
   pnpm dlx prisma migrate dev --name add_recurring_content
   ```

## 📋 How to Use

### API Endpoints

**Base URL**: `/recurring-content`

### 1. Create Recurring Content Configuration

```bash
POST /recurring-content
{
  "name": "Tech Tips 3x Weekly",
  "active": true,
  "topics": [
    "AI technology",
    "Software development tips",
    "Tech trends"
  ],
  "integrations": [
    { "id": "integration-id-1" },
    { "id": "integration-id-2" }
  ],
  "style": "educational",  // or: entertaining, inspirational, news, viral
  "videoOrientation": "vertical",  // or: horizontal
  "schedule": "MON,WED,FRI",  // Days of week
  "scheduleTime": "10:00"  // Time of day (24h format)
}
```

### 2. List All Configurations

```bash
GET /recurring-content
```

### 3. Update Configuration

```bash
PUT /recurring-content/:id
{
  "name": "Updated Name",
  "active": true,
  ...
}
```

### 4. Toggle Active/Inactive

```bash
POST /recurring-content/:id/toggle
{
  "active": false
}
```

### 5. Delete Configuration

```bash
DELETE /recurring-content/:id
```

## 🎯 How It Works

1. **Cron Job** runs every 30 minutes
2. **Checks Schedule** - is it time to post today?
3. **Generates Content Idea** using AI based on your topics
4. **Creates Video** with Veo 3
5. **Writes Caption** with hashtags
6. **Schedules Post** to your channels

## 📅 Schedule Format

**Days**: Use 3-letter codes separated by commas
- `MON,WED,FRI` - Monday, Wednesday, Friday
- `TUE,THU` - Tuesday, Thursday
- `MON,TUE,WED,THU,FRI` - Weekdays only

**Time**: 24-hour format `HH:mm`
- `10:00` - 10 AM
- `14:30` - 2:30 PM
- `21:00` - 9 PM

## 🎨 Content Styles

- **educational**: Teaching valuable information
- **entertaining**: Fun, engaging, humorous
- **inspirational**: Motivational and uplifting
- **news**: Trending topics and current events
- **viral**: Scroll-stopping, highly shareable

## 📊 Example Use Cases

### Tech Content Creator
```json
{
  "topics": ["AI", "coding tips", "tech news"],
  "style": "educational",
  "schedule": "MON,WED,FRI",
  "scheduleTime": "09:00"
}
```

### Lifestyle Brand
```json
{
  "topics": ["wellness", "self-care", "mindfulness"],
  "style": "inspirational",
  "schedule": "TUE,THU,SAT",
  "scheduleTime": "18:00"
}
```

### News Channel
```json
{
  "topics": ["tech news", "AI updates", "startup news"],
  "style": "news",
  "schedule": "MON,TUE,WED,THU,FRI",
  "scheduleTime": "08:00"
}
```

## 🔍 Monitoring

Check the logs to see when content is generated:
- Cron runs every 30 minutes
- Logs show: "Processing: {name}" when generating
- Logs show: "Successfully processed: {name}" when done

## 🚨 Troubleshooting

**Content not generating?**
- Check API keys are set
- Verify schedule is correct (use 3-letter day codes)
- Check `active` is set to `true`
- Look at logs for errors

**Videos failing?**
- Ensure KIEAI_API_KEY is valid
- Check kie.ai account has credits

**Wrong posting time?**
- Cron runs every 30 minutes, so posts within ±30min of schedule time
- Server timezone affects scheduling

## 💡 Tips

- Start with 1-2 topics for focused content
- Test with `active: false` first, then enable when ready
- Use vertical videos for Instagram/TikTok, horizontal for YouTube
- Monitor first few posts to refine topics
- Adjust schedule based on audience engagement

## 🎬 Like faceless.video

This system works similarly to faceless.video:
1. AI generates content ideas
2. Creates videos automatically
3. Posts on schedule
4. Runs 24/7 without intervention

Perfect for:
- Content creators
- Agencies managing multiple clients
- Brands maintaining consistent presence
- Anyone wanting automated social media content

