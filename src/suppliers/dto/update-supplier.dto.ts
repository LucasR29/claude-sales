import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateSupplierDto {
  @ApiPropertyOptional({ example: 'Dell Technologies', description: 'Updated supplier name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Michael Johnson', description: 'Updated contact person name' })
  @IsString()
  @IsOptional()
  contactName?: string;

  @ApiPropertyOptional({ example: 'michael.johnson@dell.com', description: 'Updated email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+1-555-987-6543', description: 'Updated phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '456 Enterprise Blvd, Austin, TX, 78701', description: 'Updated company address' })
  @IsString()
  @IsOptional()
  address?: string;
} 