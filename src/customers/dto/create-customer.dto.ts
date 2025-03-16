import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'John Doe', description: 'Customer full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'Customer email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+1-555-123-4567', description: 'Customer phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Main St, City, State, Zip', description: 'Customer address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Regular customer. Prefers email contact.', description: 'Notes about the customer' })
  @IsString()
  @IsOptional()
  notes?: string;
} 