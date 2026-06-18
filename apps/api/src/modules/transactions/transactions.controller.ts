import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { BroadcastDto } from './dto/broadcast.dto';

@Controller('v1/transactions')
export class TransactionsController {
  // Inicialización de dependencias - Módulo ARV
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('broadcast')
  async broadcastTransaction(@Body() body: BroadcastDto) {
    return await this.transactionsService.broadcast(body.chain, body.rawTx);
  }

  @Get(':address')
  async getTransactionHistory(@Param('address') address: string) {
    return await this.transactionsService.getHistory(address);
  }
}