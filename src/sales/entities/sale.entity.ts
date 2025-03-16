import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { SaleItem } from './sale-item.entity';

export enum SaleStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, customer => customer.sales)
  customer: Customer;

  @ManyToOne(() => User, user => user.sales)
  user: User;

  @Column()
  userId: string;

  @Column({ 
    type: 'enum', 
    enum: SaleStatus, 
    default: SaleStatus.PENDING 
  })
  status: SaleStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ nullable: true })
  notes: string;

  @OneToMany(() => SaleItem, item => item.sale, { cascade: true })
  items: SaleItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 