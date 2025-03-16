import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

export class QueryCustomerDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Filter by customer name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by customer email' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Filter by customer phone' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Search in any field (name, email, phone, address)' })
  @IsOptional()
  @IsString()
  readonly search?: string;
} 