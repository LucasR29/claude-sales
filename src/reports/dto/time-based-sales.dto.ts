import { ApiProperty } from '@nestjs/swagger';

export class TimeBasedSalesDto {
  @ApiProperty({ description: 'Date period (day, week, month)' })
  period: string;

  @ApiProperty({ description: 'Total number of sales in this period' })
  salesCount: number;

  @ApiProperty({ description: 'Total revenue in this period' })
  revenue: number;

  @ApiProperty({ description: 'Growth percentage compared to previous period' })
  growth: number;
} 