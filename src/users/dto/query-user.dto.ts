import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

export class QueryUserDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Filter by username' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ description: 'Filter by name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'Filter by role' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Search in any field (username, name, email)' })
  @IsOptional()
  @IsString()
  readonly search?: string;
} 