import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SuppliersModule } from '../suppliers/suppliers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    SuppliersModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {} 