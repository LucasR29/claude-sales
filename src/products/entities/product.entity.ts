import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { SaleItem } from 'src/sales/entities/sale-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @Column({ nullable: true })
  sku: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cost: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.products)
  supplier: Supplier;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => SaleItem, (saleItem) => saleItem.product)
  saleItems: SaleItem[];
} 