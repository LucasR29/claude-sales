import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset token sent to admin email' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ description: 'New password for user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
} 