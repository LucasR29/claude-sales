import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customersRepository.create(createCustomerDto);
    return this.customersRepository.save(customer);
  }

  async findAll(queryCustomerDto: QueryCustomerDto): Promise<PageDto<Customer>> {
    const queryBuilder = this.customersRepository.createQueryBuilder('customer');

    // Apply specific filters
    if (queryCustomerDto.name) {
      queryBuilder.andWhere('customer.name LIKE :name', { name: `%${queryCustomerDto.name}%` });
    }

    if (queryCustomerDto.email) {
      queryBuilder.andWhere('customer.email LIKE :email', { email: `%${queryCustomerDto.email}%` });
    }

    // Apply global search if provided
    if (queryCustomerDto.search) {
      queryBuilder.andWhere(
        '(customer.name LIKE :search OR customer.email LIKE :search OR customer.phone LIKE :search OR customer.address LIKE :search)',
        { search: `%${queryCustomerDto.search}%` }
      );
    }

    // Apply ordering
    if (queryCustomerDto.sort) {
      queryBuilder.orderBy(`customer.${queryCustomerDto.sort}`, queryCustomerDto.order);
    } else {
      // Default ordering
      queryBuilder.orderBy('customer.createdAt', queryCustomerDto.order);
    }

    // Apply pagination
    queryBuilder
      .skip(queryCustomerDto.skip)
      .take(queryCustomerDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: queryCustomerDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: ['sales'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, updateCustomerDto);
    return this.customersRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customersRepository.remove(customer);
  }
} 