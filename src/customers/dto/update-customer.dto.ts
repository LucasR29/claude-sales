import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'John Smith', description: 'Updated customer name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'john.smith@example.com', description: 'Updated customer email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+1-555-987-6543', description: 'Updated phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '456 Oak St, City, State, Zip', description: 'Updated address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Prefers phone contact. Best time: afternoons.', description: 'Updated notes' })
  @IsString()
  @IsOptional()
  notes?: string;
} 