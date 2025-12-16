import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { Organization } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { RecurringContentRepository } from '@gitroom/nestjs-libraries/database/prisma/recurring-content/recurring.content.repository';
import { RecurringContentDto } from '@gitroom/nestjs-libraries/dtos/recurring-content/recurring.content.dto';

@ApiTags('Recurring Content')
@Controller('/recurring-content')
export class RecurringContentController {
  constructor(
    private _recurringContentRepository: RecurringContentRepository
  ) {}

  @Get('/')
  async getAll(@GetOrgFromRequest() org: Organization) {
    return this._recurringContentRepository.getAll(org.id);
  }

  @Get('/:id')
  async getById(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string
  ) {
    return this._recurringContentRepository.getById(id, org.id);
  }

  @Post('/')
  async create(
    @GetOrgFromRequest() org: Organization,
    @Body() body: RecurringContentDto
  ) {
    return this._recurringContentRepository.create(org.id, {
      name: body.name,
      active: body.active,
      topics: JSON.stringify(body.topics),
      integrations: JSON.stringify(body.integrations),
      style: body.style,
      videoOrientation: body.videoOrientation,
      aiProvider: body.aiProvider || 'openai',
      schedule: body.schedule,
      scheduleTime: body.scheduleTime,
    });
  }

  @Put('/:id')
  async update(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string,
    @Body() body: RecurringContentDto
  ) {
    return this._recurringContentRepository.update(id, org.id, {
      name: body.name,
      active: body.active,
      topics: JSON.stringify(body.topics),
      integrations: JSON.stringify(body.integrations),
      style: body.style,
      videoOrientation: body.videoOrientation,
      aiProvider: body.aiProvider || 'openai',
      schedule: body.schedule,
      scheduleTime: body.scheduleTime,
    });
  }

  @Delete('/:id')
  async delete(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string
  ) {
    return this._recurringContentRepository.delete(id, org.id);
  }

  @Post('/:id/toggle')
  async toggleActive(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string,
    @Body('active') active: boolean
  ) {
    return this._recurringContentRepository.update(id, org.id, { active });
  }
}

