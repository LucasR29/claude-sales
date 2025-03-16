import { Controller, Post, UseGuards, Request, Body, UnauthorizedException, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from '../common/services/email.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Returns the JWT token' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Roles(UserRole.ADMIN)
  @Post('reset-password/request/:username')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin can request password reset for a user' })
  @ApiResponse({ status: 200, description: 'Password reset initiated' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
  async requestPasswordReset(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    const resetToken = await this.authService.createPasswordResetToken(user.id);
    
    // Send email to admin with reset token
    const adminEmail = process.env.ADMIN_EMAIL!;
    await this.emailService.sendPasswordReset(adminEmail, resetToken, user.username);
    
    return { message: 'Password reset token has been sent to admin email' };
  }

  @Roles(UserRole.ADMIN)
  @Post('reset-password/complete')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin can complete password reset using token' })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
    
    return { message: 'Password has been reset successfully' };
  }
} 