import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WebhookMiddleware } from './common/middlewares/webhook.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    AuthModule,
    UsersModule, 
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
  ],
})
export class AppModule implements NestModule{

  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(WebhookMiddleware)
    .forRoutes('webhooks/helius', 'webhooks/alchemy');
  }
  
}
