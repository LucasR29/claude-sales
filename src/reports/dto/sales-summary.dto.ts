import { ApiProperty } from '@nestjs/swagger';

export class SalesSummaryDto {
  @ApiProperty({ description: 'Total number of sales' })
  totalSales: number;

  @ApiProperty({ description: 'Total products sold quantity' })
  totalProductsSold: number;

  @ApiProperty({ description: 'Total revenue from sales' })
  totalRevenue: number;

  @ApiProperty({ description: 'Total cost of products sold' })
  totalCost: number;

  @ApiProperty({ description: 'Gross profit (revenue - cost)' })
  grossProfit: number;

  @ApiProperty({ description: 'Profit margin percentage' })
  profitMargin: number;
} 