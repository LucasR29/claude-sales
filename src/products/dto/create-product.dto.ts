import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop Dell XPS 13', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'High performance laptop with i7 processor', description: 'Product description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1299.99, description: 'Product price' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 10, description: 'Product stock quantity' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiPropertyOptional({ example: 'DELL-XPS-13', description: 'Product SKU' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Supplier ID' })
  @IsString()
  @IsOptional()
  supplierId?: string;

  @ApiPropertyOptional({ example: 799.99, description: 'Product cost price' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  cost?: number;
} 