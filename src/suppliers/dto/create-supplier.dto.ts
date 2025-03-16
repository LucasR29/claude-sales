import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ example: 'Dell Inc.', description: 'Supplier company name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'John Smith', description: 'Contact person name' })
  @IsString()
  @IsOptional()
  contactName?: string;

  @ApiPropertyOptional({ example: 'john.smith@dell.com', description: 'Email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+1-555-123-4567', description: 'Phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Tech Street, Austin, TX, 78701', description: 'Company address' })
  @IsString()
  @IsOptional()
  address?: string;
} 