import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SaleStatus } from '../entities/sale.entity';

export class UpdateSaleDto {
  @ApiPropertyOptional({ enum: SaleStatus, description: 'Updated sale status' })
  @IsEnum(SaleStatus)
  @IsOptional()
  status?: SaleStatus;

  @ApiPropertyOptional({ example: 'Customer requested delivery', description: 'Updated notes' })
  @IsString()
  @IsOptional()
  notes?: string;
} 