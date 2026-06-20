import { Controller, Get, Param, Query } from '@nestjs/common';
import { BalancesService } from './balances.service';

@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get(':address')
  async getBalance(
    @Param('address') address: string,
    @Query('chain') chain?: string,
  ) {
    return this.balancesService.getBalance(address, chain);
  }
}
