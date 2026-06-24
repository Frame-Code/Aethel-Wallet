import { Controller, Get, Patch, Param, Body, UseGuards, ForbiddenException, Req } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { SaveAddressesDto } from './dto/save-addresses.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Patch(':uid/addresses')
  saveAddresses(@Param('uid') uid: string, @Body() dto: SaveAddressesDto, @Req() req: any) {
    if (req.user.sub !== uid) {
      throw new ForbiddenException('No puedes modificar las direcciones de otro usuario');
    }
    return this.walletService.saveAddresses(uid, dto);
  }

  @Get(':uid/addresses')
  getAddresses(@Param('uid') uid: string, @Req() req: any) {
    if (req.user.sub !== uid) {
      throw new ForbiddenException('No puedes ver las direcciones de otro usuario');
    }
    return this.walletService.getAddresses(uid);
  }
}