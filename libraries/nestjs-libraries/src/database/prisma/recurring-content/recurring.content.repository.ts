import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';

@Injectable()
export class RecurringContentRepository {
  constructor(private _client: PrismaService) {}

  async getAll(organizationId: string) {
    return this._client.recurringContent.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getActive() {
    return this._client.recurringContent.findMany({
      where: {
        active: true,
      },
    });
  }

  async getById(id: string, organizationId: string) {
    return this._client.recurringContent.findFirst({
      where: {
        id,
        organizationId,
      },
    });
  }

  async create(organizationId: string, data: any) {
    return this._client.recurringContent.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async update(id: string, organizationId: string, data: any) {
    return this._client.recurringContent.update({
      where: {
        id,
        organizationId,
      },
      data,
    });
  }

  async delete(id: string, organizationId: string) {
    return this._client.recurringContent.delete({
      where: {
        id,
        organizationId,
      },
    });
  }

  async updateLastRunAt(id: string) {
    return this._client.recurringContent.update({
      where: {
        id,
      },
      data: {
        lastRunAt: new Date(),
      },
    });
  }

  async getDueContent() {
    const now = new Date();
    const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][now.getDay()];
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Get all active recurring content
    const allActive = await this._client.recurringContent.findMany({
      where: {
        active: true,
      },
    });

    // Filter to find content that should run now
    return allActive.filter((content) => {
      // Check if today is a scheduled day
      const scheduledDays = content.schedule.split(',');
      if (!scheduledDays.includes(dayOfWeek)) {
        return false;
      }

      // Check if it's the right time (within 30-minute window)
      const [scheduleHour, scheduleMinute] = content.scheduleTime.split(':').map(Number);
      const scheduleTimeMinutes = scheduleHour * 60 + scheduleMinute;
      const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
      
      // Allow 30-minute window
      if (Math.abs(currentTimeMinutes - scheduleTimeMinutes) > 30) {
        return false;
      }

      // Check if already ran today
      if (content.lastRunAt) {
        const lastRun = new Date(content.lastRunAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (lastRun >= today) {
          return false; // Already ran today
        }
      }

      return true;
    });
  }
}

