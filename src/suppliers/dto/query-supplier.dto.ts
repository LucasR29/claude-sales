import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

export class QuerySupplierDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Filter by supplier name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by contact name' })
  @IsString()
  @IsOptional()
  contactName?: string;

  @ApiPropertyOptional({ description: 'Filter by email' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Filter by phone' })
  @IsString()
  @IsOptional()
  phone?: string;
} 