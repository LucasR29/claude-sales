import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter;

  constructor(private configService: ConfigService) {
    // In a real app, you would use your SMTP configuration here
    // For development, we'll use nodemailer's ethereal service
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    // For production
    // this.transporter = nodemailer.createTransport({
    //   host: this.configService.get('email.host'),
    //   port: this.configService.get('email.port'),
    //   secure: this.configService.get('email.secure'),
    //   auth: {
    //     user: this.configService.get('email.user'),
    //     pass: this.configService.get('email.password'),
    //   },
    // });

    // For development (using Ethereal)
    const testAccount = await nodemailer.createTestAccount();
    
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  async sendPasswordReset(to: string, token: string, username: string) {
    try {
      const info = await this.transporter.sendMail({
        from: '"Sales Management System" <noreply@salesmanagement.com>',
        to,
        subject: 'Password Reset Request',
        text: `A password reset has been requested for user: ${username}. 
        Use the following token to reset the password: ${token}`,
        html: `<p>A password reset has been requested for user: <strong>${username}</strong>.</p>
        <p>Use the following token to reset the password: <strong>${token}</strong></p>`,
      });

      this.logger.log(`Password reset email sent: ${info.messageId}`);
      this.logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      
      return true;
    } catch (error) {
      this.logger.error(`Failed to send password reset email: ${error.message}`);
      return false;
    }
  }
} 