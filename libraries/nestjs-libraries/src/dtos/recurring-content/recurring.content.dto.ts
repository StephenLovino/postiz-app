import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class IntegrationDto {
  @IsString()
  @IsDefined()
  id: string;
}

export class RecurringContentDto {
  @IsString()
  @IsDefined()
  name: string;

  @IsBoolean()
  @IsDefined()
  active: boolean;

  @IsArray()
  @IsString({ each: true })
  topics: string[];

  @IsArray()
  @Type(() => IntegrationDto)
  @ValidateNested({ each: true })
  integrations: IntegrationDto[];

  @IsString()
  @IsIn(['educational', 'entertaining', 'inspirational', 'news', 'viral'])
  style: string;

  @IsString()
  @IsIn(['vertical', 'horizontal'])
  videoOrientation: string;

  @IsString()
  @IsDefined()
  schedule: string; // e.g., "MON,WED,FRI"

  @IsString()
  @IsDefined()
  scheduleTime: string; // e.g., "10:00"
}

