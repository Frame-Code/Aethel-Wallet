import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':address')
  async getBalance(
    @Param('address') address: string,
    @Query('chain') chain?: string,
  ) {
    return this.balancesService.getBalance(address, chain);
  }
}
