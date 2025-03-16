import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { QuerySupplierDto } from './dto/query-supplier.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const supplier = this.suppliersRepository.create(createSupplierDto);
    return this.suppliersRepository.save(supplier);
  }

  async findAll(querySupplierDto: QuerySupplierDto): Promise<PageDto<Supplier>> {
    const queryBuilder = this.suppliersRepository.createQueryBuilder('supplier');

    // Apply filters
    if (querySupplierDto.name) {
      queryBuilder.andWhere('supplier.name LIKE :name', { name: `%${querySupplierDto.name}%` });
    }

    if (querySupplierDto.contactName) {
      queryBuilder.andWhere('supplier.contactName LIKE :contactName', { contactName: `%${querySupplierDto.contactName}%` });
    }

    if (querySupplierDto.email) {
      queryBuilder.andWhere('supplier.email LIKE :email', { email: `%${querySupplierDto.email}%` });
    }

    if (querySupplierDto.phone) {
      queryBuilder.andWhere('supplier.phone LIKE :phone', { phone: `%${querySupplierDto.phone}%` });
    }

    // Apply pagination
    queryBuilder
      .orderBy('supplier.createdAt', querySupplierDto.order)
      .skip(querySupplierDto.skip)
      .take(querySupplierDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: querySupplierDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.suppliersRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID "${id}" not found`);
    }

    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOne(id);
    Object.assign(supplier, updateSupplierDto);
    return this.suppliersRepository.save(supplier);
  }

  async remove(id: string): Promise<void> {
    const supplier = await this.findOne(id);
    await this.suppliersRepository.remove(supplier);
  }
} 