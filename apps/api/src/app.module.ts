import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { WebhookMiddleware } from './common/middlewares/webhook.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    AuthModule,
    UsersModule, 
    WalletModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WebhookMiddleware)
      .forRoutes('webhooks/helius', 'webhooks/alchemy');
  }

}
