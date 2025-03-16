import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('password_resets')
export class PasswordReset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
} 