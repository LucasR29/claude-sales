import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Sale } from '../sales/entities/sale.entity';
import { SaleItem } from '../sales/entities/sale-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Customer } from '../customers/entities/customer.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleItem, Product, User, Customer]),
    UsersModule,
    ProductsModule,
    CustomersModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {} 