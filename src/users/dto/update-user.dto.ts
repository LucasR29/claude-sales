import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'newpassword123', description: 'New user password' })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'User email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'User role' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ example: true, description: 'User active status' })
  @IsOptional()
  isActive?: boolean;
} 