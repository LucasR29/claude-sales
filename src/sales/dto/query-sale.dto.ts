import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { SaleStatus } from '../entities/sale.entity';

export class QuerySaleDto extends PageOptionsDto {
  @ApiPropertyOptional({ enum: SaleStatus, description: 'Filter by status' })
  @IsEnum(SaleStatus)
  @IsOptional()
  status?: SaleStatus;

  @ApiPropertyOptional({ description: 'Filter by customer ID' })
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional({ description: 'Filter by user/seller ID' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Filter by product ID in sale items' })
  @IsUUID()
  @IsOptional()
  productId?: string;

  @ApiPropertyOptional({ description: 'Filter from date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Filter to date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Search in notes, customer name, seller name, product names' })
  @IsOptional()
  @IsString()
  readonly search?: string;
} 