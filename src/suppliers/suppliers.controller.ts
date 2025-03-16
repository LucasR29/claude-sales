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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { QuerySupplierDto } from './dto/query-supplier.dto';
import { Supplier } from './entities/supplier.entity';
import { PageDto } from '../common/dto/page.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('suppliers')
@Controller('suppliers')
@ApiBearerAuth()
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiResponse({ status: 201, description: 'The supplier has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    return this.suppliersService.create(createSupplierDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all suppliers with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all suppliers.' })
  findAll(@Query() querySupplierDto: QuerySupplierDto): Promise<PageDto<Supplier>> {
    return this.suppliersService.findAll(querySupplierDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a supplier by id' })
  @ApiResponse({ status: 200, description: 'Return the supplier.' })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  findOne(@Param('id') id: string): Promise<Supplier> {
    return this.suppliersService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a supplier' })
  @ApiResponse({ status: 200, description: 'The supplier has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto
  ): Promise<Supplier> {
    return this.suppliersService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a supplier' })
  @ApiResponse({ status: 200, description: 'The supplier has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.suppliersService.remove(id);
  }
} 