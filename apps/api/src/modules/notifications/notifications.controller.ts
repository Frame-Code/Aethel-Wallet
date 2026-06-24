import { Controller, Post, Req, HttpCode, Logger } from '@nestjs/common';
import { Request } from 'express';
import { NotificationsService } from './notifications.service';

@Controller('webhooks')
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('helius')
  @HttpCode(200)
  async handleHelius(@Req() req: Request) {
    // El body llega como Buffer (ver main.ts: express.raw para /v1/webhooks).
    let payload: any;
    try {
      payload = JSON.parse((req.body as Buffer).toString('utf-8'));
    } catch {
      this.logger.warn('Payload de Helius no es JSON valido');
      return;
    }

    if (!Array.isArray(payload)) return;

    for (const event of payload) {
      if (event.type === 'TRANSFER') {
        const recipient = event.nativeTransfers?.[0]?.toUserAccount;
        if (recipient) {
          await this.notificationsService.notifyUser(recipient, event);
        }
      }
    }
  }
}