import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Sale } from '../../sales/entities/sale.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  SELLER = 'seller',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Sale, (sale) => sale.user)
  sales: Sale[];
} 