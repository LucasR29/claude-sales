import { Controller, Get, Query, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { ReportQueryDto } from './dto/report-query.dto';
import { SalesSummaryDto } from './dto/sales-summary.dto';
import { ProductSalesDto } from './dto/product-sales.dto';
import { SellerPerformanceDto } from './dto/seller-performance.dto';
import { TimeBasedSalesDto } from './dto/time-based-sales.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('reports')
@Controller('reports')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get sales summary report' })
  @ApiResponse({ status: 200, description: 'Return sales summary.', type: SalesSummaryDto })
  getSalesSummary(@Query() query: ReportQueryDto): Promise<SalesSummaryDto> {
    return this.reportsService.getSalesSummary(query);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get product sales report' })
  @ApiResponse({ status: 200, description: 'Return product sales data.', type: [ProductSalesDto] })
  getProductSales(@Query() query: ReportQueryDto): Promise<ProductSalesDto[]> {
    return this.reportsService.getProductSales(query);
  }

  @Get('sellers')
  @ApiOperation({ summary: 'Get seller performance report' })
  @ApiResponse({ status: 200, description: 'Return seller performance data.', type: [SellerPerformanceDto] })
  getSellerPerformance(@Query() query: ReportQueryDto): Promise<SellerPerformanceDto[]> {
    return this.reportsService.getSellerPerformance(query);
  }

  @Get('daily')
  @ApiOperation({ summary: 'Get daily sales report' })
  @ApiResponse({ status: 200, description: 'Return daily sales data.', type: [TimeBasedSalesDto] })
  getDailySales(@Query() query: ReportQueryDto): Promise<TimeBasedSalesDto[]> {
    return this.reportsService.getTimeBasedSales(query, 'daily');
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Get weekly sales report' })
  @ApiResponse({ status: 200, description: 'Return weekly sales data.', type: [TimeBasedSalesDto] })
  getWeeklySales(@Query() query: ReportQueryDto): Promise<TimeBasedSalesDto[]> {
    return this.reportsService.getTimeBasedSales(query, 'weekly');
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly sales report' })
  @ApiResponse({ status: 200, description: 'Return monthly sales data.', type: [TimeBasedSalesDto] })
  getMonthlySales(@Query() query: ReportQueryDto): Promise<TimeBasedSalesDto[]> {
    return this.reportsService.getTimeBasedSales(query, 'monthly');
  }

  @Get('top-customers')
  @ApiOperation({ summary: 'Get top customers report' })
  @ApiResponse({ status: 200, description: 'Return top customers data.' })
  getTopCustomers(@Query() query: ReportQueryDto): Promise<any[]> {
    return this.reportsService.getTopCustomers(query);
  }
} 