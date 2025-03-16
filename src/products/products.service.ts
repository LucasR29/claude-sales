import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { SuppliersService } from '../suppliers/suppliers.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private suppliersService: SuppliersService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    
    // Link to supplier if provided
    if (createProductDto.supplierId) {
      const supplier = await this.suppliersService.findOne(createProductDto.supplierId);
      product.supplier = supplier;
    }
    
    return this.productsRepository.save(product);
  }

  async findAll(queryProductDto: QueryProductDto): Promise<PageDto<Product>> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.supplier', 'supplier');
    
    // Apply specific filters
    if (queryProductDto.name) {
      queryBuilder.andWhere('product.name LIKE :name', { name: `%${queryProductDto.name}%` });
    }
    
    if (queryProductDto.minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice: queryProductDto.minPrice });
    }
    
    if (queryProductDto.maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: queryProductDto.maxPrice });
    }
    
    if (queryProductDto.supplierId) {
      queryBuilder.andWhere('product.supplierId = :supplierId', { supplierId: queryProductDto.supplierId });
    }
    
    // Apply global search if provided
    if (queryProductDto.search) {
      queryBuilder.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search OR product.sku LIKE :search)',
        { search: `%${queryProductDto.search}%` }
      );
    }
    
    // Apply ordering
    if (queryProductDto.sort) {
      switch(queryProductDto.sort) {
        case 'price':
          queryBuilder.orderBy('product.price', queryProductDto.order);
          break;
        case 'name':
          queryBuilder.orderBy('product.name', queryProductDto.order);
          break;
        case 'createdAt':
          queryBuilder.orderBy('product.createdAt', queryProductDto.order);
          break;
        case 'stock':
          queryBuilder.orderBy('product.stock', queryProductDto.order);
          break;
        default:
          queryBuilder.orderBy('product.createdAt', queryProductDto.order);
      }
    } else {
      // Default ordering
      queryBuilder.orderBy('product.createdAt', queryProductDto.order);
    }
    
    // Apply pagination
    queryBuilder
      .skip(queryProductDto.skip)
      .take(queryProductDto.take);
    
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: queryProductDto });
    
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['supplier'],
    });
    
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    // Update basic fields
    Object.assign(product, updateProductDto);
    
    // Update supplier if provided
    if (updateProductDto.supplierId) {
      const supplier = await this.suppliersService.findOne(updateProductDto.supplierId);
      product.supplier = supplier;
    }
    
    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stock -= quantity;
    
    if (product.stock < 0) {
      throw new Error(`Insufficient stock for product "${product.name}"`);
    }
    
    return this.productsRepository.save(product);
  }
} 