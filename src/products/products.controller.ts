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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Product } from './entities/product.entity';
import { PageDto } from '../common/dto/page.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';
import { Order } from 'src/common/dto/page-options.dto';
import { SortField } from 'src/common/enum/sort-field.enum';

@ApiTags('products')
@Controller('products')
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'The product has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all products with pagination and filtering' })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'supplierId', required: false })
  @ApiQuery({ name: 'search', required: false, description: 'Search in name, description, SKU' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: SortField })
  @ApiQuery({ name: 'order', required: false, enum: Order })
  @ApiResponse({ status: 200, description: 'Return list of products', type: PageDto })
  findAll(@Query() queryProductDto: QueryProductDto): Promise<PageDto<Product>> {
    return this.productsService.findAll(queryProductDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({ status: 200, description: 'Return the product.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'The product has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'The product has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
} 