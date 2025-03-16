import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Laptop Dell XPS 15', description: 'Updated product name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'High performance laptop with i9 processor', description: 'Updated product description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 1499.99, description: 'Updated product price' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({ example: 15, description: 'Updated product stock quantity' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  stock?: number;

  @ApiPropertyOptional({ example: 'DELL-XPS-15', description: 'Updated product SKU' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Updated supplier ID' })
  @IsString()
  @IsOptional()
  supplierId?: string;

  @ApiPropertyOptional({ example: 799.99, description: 'Updated product cost price' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  cost?: number;
} 