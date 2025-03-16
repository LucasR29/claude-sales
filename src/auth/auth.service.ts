import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { EmailService } from 'src/common/services/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
    private emailService: EmailService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    
    if (user && await argon2.verify(user.password, password)) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  async createPasswordResetToken(userId: string): Promise<string> {
    // Remove existing tokens for this user
    await this.passwordResetRepository.delete({ userId });
    
    // Create a new token
    const token = randomBytes(32).toString('hex');
    const expiresValue = this.configService.get<string>('resetPassword.expiresIn') || '1h'; // valor padrão de 1 hora
    const timeUnit = expiresValue.slice(-1);
    const timeValue = parseInt(expiresValue.slice(0, -1), 10);
    
    let expiresAt = new Date();
    if (timeUnit === 'm') {
      expiresAt.setMinutes(expiresAt.getMinutes() + timeValue);
    } else if (timeUnit === 'h') {
      expiresAt.setHours(expiresAt.getHours() + timeValue);
    } else if (timeUnit === 'd') {
      expiresAt.setDate(expiresAt.getDate() + timeValue);
    }
    
    await this.passwordResetRepository.save({
      userId,
      token,
      expiresAt,
    });
    
    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const passwordReset = await this.passwordResetRepository.findOne({
      where: { token },
    });
    
    if (!passwordReset || passwordReset.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    
    // Hash new password
    const hashedPassword = await argon2.hash(newPassword);
    
    // Update user's password
    await this.usersService.updatePassword(passwordReset.userId, hashedPassword);
    
    // Remove used token
    await this.passwordResetRepository.delete({ id: passwordReset.id });
    
    return true;
  }

  async sendPasswordResetEmail(adminEmail: string, resetToken: string, user: User): Promise<void> {
    if (adminEmail) {
      await this.emailService.sendPasswordReset(adminEmail, resetToken, user.username);
    }
  }
} 