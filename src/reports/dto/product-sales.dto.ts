import { ApiProperty } from '@nestjs/swagger';

export class ProductSalesDto {
  @ApiProperty({ description: 'Product ID' })
  productId: string;

  @ApiProperty({ description: 'Product name' })
  productName: string;

  @ApiProperty({ description: 'Quantity sold' })
  quantitySold: number;

  @ApiProperty({ description: 'Total revenue from this product' })
  revenue: number;

  @ApiProperty({ description: 'Total cost of this product' })
  cost: number;

  @ApiProperty({ description: 'Profit from this product' })
  profit: number;
} 