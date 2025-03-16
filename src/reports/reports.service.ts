import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Sale, SaleStatus } from '../sales/entities/sale.entity';
import { SaleItem } from '../sales/entities/sale-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { ReportQueryDto } from './dto/report-query.dto';
import { SalesSummaryDto } from './dto/sales-summary.dto';
import { ProductSalesDto } from './dto/product-sales.dto';
import { SellerPerformanceDto } from './dto/seller-performance.dto';
import { TimeBasedSalesDto } from './dto/time-based-sales.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private saleItemsRepository: Repository<SaleItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private buildDateFilter(query: ReportQueryDto): FindOptionsWhere<Sale> {
    const filter: FindOptionsWhere<Sale> = {
      status: SaleStatus.COMPLETED,
    };

    // Usar Between com datas em vez de passar objeto direto
    if (query.startDate && query.endDate) {
      const startDate = new Date(query.startDate);
      const endDate = new Date(query.endDate);
      endDate.setHours(23, 59, 59, 999); // Até o final do dia

      filter.createdAt = Between(startDate, endDate);
    } else if (query.startDate) {
      const startDate = new Date(query.startDate);
      filter.createdAt = MoreThanOrEqual(startDate);
    } else if (query.endDate) {
      const endDate = new Date(query.endDate);
      endDate.setHours(23, 59, 59, 999);
      filter.createdAt = LessThanOrEqual(endDate);
    }

    if (query.userId) {
      filter.user = { id: query.userId };
    }

    return filter;
  }

  async getSalesSummary(query: ReportQueryDto): Promise<SalesSummaryDto> {
    const filter = this.buildDateFilter(query);
    
    // Get all completed sales within the filter
    const sales = await this.salesRepository.find({
      where: filter,
      relations: ['items', 'items.product'],
    });
    
    let totalSales = 0;
    let totalProductsSold = 0;
    let totalRevenue = 0;
    let totalCost = 0;
    
    for (const sale of sales) {
      totalSales++;
      totalRevenue += Number(sale.totalAmount);
      
      for (const item of sale.items) {
        totalProductsSold += item.quantity;
        // Calculate approximate cost (assuming we have cost data in the product)
        // In a real system, you would store the cost at the time of sale
        const product = item.product;
        const estimatedCost = product.cost ? product.cost * item.quantity : 0;
        totalCost += estimatedCost;
      }
    }
    
    const grossProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    
    return {
      totalSales,
      totalProductsSold,
      totalRevenue,
      totalCost,
      grossProfit,
      profitMargin,
    };
  }

  async getProductSales(query: ReportQueryDto): Promise<ProductSalesDto[]> {
    const filter = this.buildDateFilter(query);
    
    // Add product filter if provided
    if (query.productId) {
      filter.items = { product: { id: query.productId } };
    }
    
    const sales = await this.salesRepository.find({
      where: filter,
      relations: ['items', 'items.product'],
    });
    
    // Map to track sales by product
    const productSalesMap = new Map<string, ProductSalesDto>();
    
    for (const sale of sales) {
      for (const item of sale.items) {
        const productId = item.product.id;
        const productName = item.product.name;
        const revenue = Number(item.unitPrice) * item.quantity;
        const cost = item.product.cost ? item.product.cost * item.quantity : 0;
        
        if (!productSalesMap.has(productId)) {
          productSalesMap.set(productId, {
            productId,
            productName,
            quantitySold: 0,
            revenue: 0,
            cost: 0,
            profit: 0,
          });
        }
        
        const productStats = productSalesMap.get(productId);
        if (productStats) {
          productStats.quantitySold += item.quantity;
          productStats.revenue += revenue;
          productStats.cost += cost;
          productStats.profit = productStats.revenue - productStats.cost;
        }
      }
    }
    
    return Array.from(productSalesMap.values())
      .sort((a, b) => b.quantitySold - a.quantitySold);
  }

  async getSellerPerformance(query: ReportQueryDto): Promise<SellerPerformanceDto[]> {
    const filter = this.buildDateFilter(query);
    
    // Get all completed sales within the filter
    const sales = await this.salesRepository.find({
      where: filter,
      relations: ['items', 'user'],
    });
    
    // Map to track sales by seller
    const sellerPerformanceMap = new Map<string, SellerPerformanceDto>();
    
    for (const sale of sales) {
      const userId = sale.userId;
      const sellerName = sale.user ? sale.user.name : 'Unknown';
      const totalProductsSold = sale.items.reduce((sum, item) => sum + item.quantity, 0);
      
      if (!sellerPerformanceMap.has(userId)) {
        sellerPerformanceMap.set(userId, {
          userId,
          sellerName,
          totalSales: 0,
          totalProductsSold: 0,
          totalRevenue: 0,
          averageSaleValue: 0,
        });
      }
      
      const sellerStats = sellerPerformanceMap.get(userId);
      if (sellerStats) {
        sellerStats.totalSales += 1;
        sellerStats.totalProductsSold += totalProductsSold;
        sellerStats.totalRevenue += Number(sale.totalAmount);
      }
    }
    
    // Calculate average sale value
    for (const sellerStats of sellerPerformanceMap.values()) {
      sellerStats.averageSaleValue = sellerStats.totalSales > 0 
        ? sellerStats.totalRevenue / sellerStats.totalSales 
        : 0;
    }
    
    return Array.from(sellerPerformanceMap.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  async getTimeBasedSales(query: ReportQueryDto, period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<TimeBasedSalesDto[]> {
    const filter = this.buildDateFilter(query);
    
    // Get all completed sales within the filter
    const sales = await this.salesRepository.find({
      where: filter,
      order: { createdAt: 'ASC' },
    });
    
    // Map to track sales by time period
    const timeBasedSalesMap = new Map<string, TimeBasedSalesDto>();
    
    for (const sale of sales) {
      const date = new Date(sale.createdAt);
      let periodKey: string;
      
      switch (period) {
        case 'daily':
          periodKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case 'weekly':
          // Get the week start date (Sunday)
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          periodKey = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
        default:
          periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
      }
      
      if (!timeBasedSalesMap.has(periodKey)) {
        timeBasedSalesMap.set(periodKey, {
          period: periodKey,
          salesCount: 0,
          revenue: 0,
          growth: 0, // Calculate later
        });
      }
      
      const periodStats = timeBasedSalesMap.get(periodKey);
      if (periodStats) {
        periodStats.salesCount += 1;
        periodStats.revenue += Number(sale.totalAmount);
      }
    }
    
    // Convert to array and sort by period
    const timeBasedSalesArray = Array.from(timeBasedSalesMap.values())
      .sort((a, b) => a.period.localeCompare(b.period));
    
    // Calculate growth compared to previous period
    for (let i = 1; i < timeBasedSalesArray.length; i++) {
      const currentPeriod = timeBasedSalesArray[i];
      const previousPeriod = timeBasedSalesArray[i - 1];
      
      if (previousPeriod.revenue > 0) {
        currentPeriod.growth = ((currentPeriod.revenue - previousPeriod.revenue) / previousPeriod.revenue) * 100;
      }
    }
    
    return timeBasedSalesArray;
  }

  async getTopCustomers(query: ReportQueryDto, limit: number = 10): Promise<any[]> {
    const filter = this.buildDateFilter(query);
    
    // Get all completed sales within the filter
    const sales = await this.salesRepository.find({
      where: filter,
      relations: ['customer'],
    });
    
    // Map to track sales by customer
    const customerSalesMap = new Map<string, any>();
    
    for (const sale of sales) {
      if (!sale.customer) continue;
      
      const customerId = sale.customer.id;
      const customerName = sale.customer.name;
      
      if (!customerSalesMap.has(customerId)) {
        customerSalesMap.set(customerId, {
          customerId,
          customerName,
          totalPurchases: 0,
          totalSpent: 0,
        });
      }
      
      const customerStats = customerSalesMap.get(customerId);
      customerStats.totalPurchases += 1;
      customerStats.totalSpent += Number(sale.totalAmount);
    }
    
    // Convert to array, sort by total spent, and limit results
    return Array.from(customerSalesMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }
} 