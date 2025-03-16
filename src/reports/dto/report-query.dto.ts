import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class ReportQueryDto {
  @ApiPropertyOptional({ example: '2023-01-01', description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2023-12-31', description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Specific user ID to filter by' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Specific product ID to filter by' })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiPropertyOptional({ description: 'Specific customer ID to filter by' })
  @IsString()
  @IsOptional()
  customerId?: string;
} 