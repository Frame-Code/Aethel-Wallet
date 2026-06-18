import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './modules/auth/auth.module';
import { WebhookMiddleware } from './common/middlewares/webhook.middleware';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    AuthModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
    TransactionsModule,
  ],
})
export class AppModule implements NestModule{

  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(WebhookMiddleware)
    .forRoutes('webhooks/helius', 'webhooks/alchemy');
  }
  
}
