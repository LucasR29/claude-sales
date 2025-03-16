import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { Customer } from './entities/customer.entity';
import { PageDto } from '../common/dto/page.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { SortField } from 'src/common/enum/sort-field.enum';
import { Order } from 'src/common/dto/page-options.dto';

@ApiTags('customers')
@Controller('customers')
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'The customer has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: 'List all customers with pagination and filtering' })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'search', required: false, description: 'Search in any field' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: SortField })
  @ApiQuery({ name: 'order', required: false, enum: Order })
  @ApiResponse({ status: 200, description: 'Return list of customers', type: PageDto })
  findAll(@Query() queryCustomerDto: QueryCustomerDto): Promise<PageDto<Customer>> {
    return this.customersService.findAll(queryCustomerDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: 'Get a customer by id' })
  @ApiResponse({ status: 200, description: 'Return the customer.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customersService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({ status: 200, description: 'The customer has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto
  ): Promise<Customer> {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiResponse({ status: 200, description: 'The customer has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.customersService.remove(id);
  }
} 