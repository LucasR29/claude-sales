import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe', description: 'Unique username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'User email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.USER, description: 'User role' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
} 