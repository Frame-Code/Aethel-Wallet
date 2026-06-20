import { Controller, Get, Query } from '@nestjs/common';
import { PricesService } from './prices.service';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get()
  async getPrices(@Query('ids') ids?: string | string[]) {
    const normalized = Array.isArray(ids)
      ? ids
      : typeof ids === 'string'
        ? ids.split(',')
        : [];

    return this.pricesService.getPrices(
      normalized.map((value) => value.trim()).filter(Boolean),
    );
  }
}
