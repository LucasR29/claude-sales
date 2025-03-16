import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Sale, SaleStatus } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { QuerySaleDto } from './dto/query-sale.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private saleItemsRepository: Repository<SaleItem>,
    private productsService: ProductsService,
    private customersService: CustomersService,
    private connection: Connection,
  ) {}

  async create(createSaleDto: CreateSaleDto, userId: string): Promise<Sale> {
    // Start a transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if customer exists
      const customer = await this.customersService.findOne(createSaleDto.customerId);

      // Create the sale
      const sale = this.salesRepository.create({
        customer,
        userId,
        notes: createSaleDto.notes,
        status: SaleStatus.PENDING,
      });

      const savedSale = await queryRunner.manager.save(sale);

      // Process each item
      let totalAmount = 0;
      for (const itemDto of createSaleDto.items) {
        const product = await this.productsService.findOne(itemDto.productId);
        
        // Check stock
        if (product.stock < itemDto.quantity) {
          throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
        }

        // Determine price
        const unitPrice = itemDto.unitPrice || product.price;
        
        // Create sale item
        const saleItem = this.saleItemsRepository.create({
          sale: savedSale,
          product,
          quantity: itemDto.quantity,
          unitPrice,
        });

        await queryRunner.manager.save(saleItem);
        
        // Update product stock
        product.stock -= itemDto.quantity;
        await queryRunner.manager.save(product);
        
        // Add to total
        totalAmount += unitPrice * itemDto.quantity;
      }

      // Update sale total
      savedSale.totalAmount = totalAmount;
      await queryRunner.manager.save(savedSale);

      // Commit transaction
      await queryRunner.commitTransaction();
      
      return this.findOne(savedSale.id);
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  async findAll(querySaleDto: QuerySaleDto): Promise<PageDto<Sale>> {
    const queryBuilder = this.salesRepository.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.customer', 'customer')
      .leftJoinAndSelect('sale.user', 'user')
      .leftJoinAndSelect('sale.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    // Apply specific filters
    if (querySaleDto.status) {
      queryBuilder.andWhere('sale.status = :status', { status: querySaleDto.status });
    }
    
    if (querySaleDto.customerId) {
      queryBuilder.andWhere('sale.customerId = :customerId', { customerId: querySaleDto.customerId });
    }
    
    if (querySaleDto.userId) {
      queryBuilder.andWhere('sale.userId = :userId', { userId: querySaleDto.userId });
    }
    
    if (querySaleDto.productId) {
      queryBuilder.andWhere('items.productId = :productId', { productId: querySaleDto.productId });
    }
    
    // Date range filtering
    if (querySaleDto.startDate) {
      const startDate = new Date(querySaleDto.startDate);
      queryBuilder.andWhere('sale.createdAt >= :startDate', { startDate });
    }
    
    if (querySaleDto.endDate) {
      const endDate = new Date(querySaleDto.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      queryBuilder.andWhere('sale.createdAt <= :endDate', { endDate });
    }
    
    // Apply global search if provided
    if (querySaleDto.search) {
      queryBuilder.andWhere(
        '(sale.notes LIKE :search OR customer.name LIKE :search OR user.name LIKE :search OR product.name LIKE :search)',
        { search: `%${querySaleDto.search}%` }
      );
    }
    
    // Apply ordering
    if (querySaleDto.sort) {
      switch(querySaleDto.sort) {
        case 'createdAt':
          queryBuilder.orderBy('sale.createdAt', querySaleDto.order);
          break;
        case 'status':
          queryBuilder.orderBy('sale.status', querySaleDto.order);
          break;
        case 'name':
          queryBuilder.orderBy('customer.name', querySaleDto.order);
          break;
        default:
          queryBuilder.orderBy('sale.createdAt', querySaleDto.order);
      }
    } else {
      // Default ordering
      queryBuilder.orderBy('sale.createdAt', querySaleDto.order);
    }
    
    // Apply pagination
    queryBuilder
      .skip(querySaleDto.skip)
      .take(querySaleDto.take);
    
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: querySaleDto });
    
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.salesRepository.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.product'],
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID "${id}" not found`);
    }

    return sale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.findOne(id);
    
    // If the sale was CANCELLED and now is being completed, throw error
    if (sale.status === SaleStatus.CANCELLED && updateSaleDto.status === SaleStatus.COMPLETED) {
      throw new BadRequestException('Cannot complete a cancelled sale');
    }
    
    // If the sale is being cancelled, return items to stock
    if (sale.status !== SaleStatus.CANCELLED && updateSaleDto.status === SaleStatus.CANCELLED) {
      const queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      try {
        // Return items to stock
        for (const item of sale.items) {
          const product = await this.productsService.findOne(item.product.id);
          product.stock += item.quantity;
          await queryRunner.manager.save(product);
        }
        
        // Update sale
        Object.assign(sale, updateSaleDto);
        await queryRunner.manager.save(sale);
        
        // Commit transaction
        await queryRunner.commitTransaction();
      } catch (error) {
        // Rollback transaction on error
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        // Release query runner
        await queryRunner.release();
      }
    } else {
      // Just update the sale status or notes
      Object.assign(sale, updateSaleDto);
      await this.salesRepository.save(sale);
    }
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const sale = await this.findOne(id);
    
    // Only allow deletion if the sale is still PENDING
    if (sale.status !== SaleStatus.PENDING) {
      throw new BadRequestException('Only pending sales can be deleted');
    }
    
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Return items to stock
      for (const item of sale.items) {
        const product = await this.productsService.findOne(item.product.id);
        product.stock += item.quantity;
        await queryRunner.manager.save(product);
      }
      
      // Delete sale items first
      await queryRunner.manager.remove(sale.items);
      
      // Delete sale
      await queryRunner.manager.remove(sale);
      
      // Commit transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
} 