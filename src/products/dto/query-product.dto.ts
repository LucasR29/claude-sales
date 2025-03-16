import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

export class QueryProductDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Filter by product name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by SKU' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ description: 'Filter by supplier ID' })
  @IsUUID()
  @IsOptional()
  supplierId?: string;

  @ApiPropertyOptional({ description: 'Minimum price' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Filter for products with stock less than or equal to this value' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  lowStock?: number;

  @ApiPropertyOptional({ description: 'Search in name, description, SKU' })
  @IsOptional()
  @IsString()
  readonly search?: string;
} 