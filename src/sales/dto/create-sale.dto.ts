import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsNotEmpty, 
  IsString, 
  IsArray, 
  ValidateNested, 
  IsNumber, 
  IsPositive, 
  Min, 
  IsOptional 
} from 'class-validator';

export class CreateSaleItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Product ID' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity of product' })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiPropertyOptional({ example: 1099.99, description: 'Unit price override (if different from product price)' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  unitPrice?: number;
}

export class CreateSaleDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Customer ID' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ type: [CreateSaleItemDto], description: 'Items in sale' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];

  @ApiPropertyOptional({ example: 'Cash payment', description: 'Notes about the sale' })
  @IsString()
  @IsOptional()
  notes?: string;
} 