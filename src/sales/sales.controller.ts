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
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { QuerySaleDto } from './dto/query-sale.dto';
import { Sale, SaleStatus } from './entities/sale.entity';
import { PageDto } from '../common/dto/page.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { SortField } from 'src/common/enum/sort-field.enum';
import { Order } from 'src/common/dto/page-options.dto';

@ApiTags('sales')
@Controller('sales')
@ApiBearerAuth()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: 'Create a new sale' })
  @ApiResponse({ status: 201, description: 'The sale has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(
    @Body() createSaleDto: CreateSaleDto,
    @CurrentUser() user: User
  ): Promise<Sale> {
    return this.salesService.create(createSaleDto, user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: 'List all sales with pagination and filtering' })
  @ApiQuery({ name: 'status', required: false, enum: SaleStatus })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'search', required: false, description: 'Search in notes, customer name, seller name, products' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: SortField })
  @ApiQuery({ name: 'order', required: false, enum: Order })
  @ApiResponse({ status: 200, description: 'Return a list of sales', type: PageDto })
  findAll(@Query() querySaleDto: QuerySaleDto): Promise<PageDto<Sale>> {
    return this.salesService.findAll(querySaleDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: 'Get a sale by id' })
  @ApiResponse({ status: 200, description: 'Return the sale.' })
  @ApiResponse({ status: 404, description: 'Sale not found.' })
  findOne(@Param('id') id: string): Promise<Sale> {
    return this.salesService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: 'Update a sale status' })
  @ApiResponse({ status: 200, description: 'The sale has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Sale not found.' })
  update(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto
  ): Promise<Sale> {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a pending sale' })
  @ApiResponse({ status: 200, description: 'The sale has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Only pending sales can be deleted.' })
  @ApiResponse({ status: 404, description: 'Sale not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.salesService.remove(id);
  }
} 