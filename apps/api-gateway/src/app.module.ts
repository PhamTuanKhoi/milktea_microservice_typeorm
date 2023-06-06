import { RmqModule } from '@app/common';
import { AUTH_SERVICE, ORTHER_SERVICE, PRODUCT_SERVICE } from '@app/gobal';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { CartController } from './controllers/cart.controller';
import { CategoryController } from './controllers/category.controller';
import { OrtherController } from './controllers/orther.controller';
import { ProductController } from './controllers/product.controller';
import { UserController } from './controllers/user.controller';
import { BullModule } from '@nestjs/bull';
import { OrtherItemController } from './controllers/orther-item.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    RmqModule.registerRmq(AUTH_SERVICE, process.env.RABBITMQ_AUTH_QUEUE),
    RmqModule.registerRmq(PRODUCT_SERVICE, process.env.RABBITMQ_PRODUCT_QUEUE),
    RmqModule.registerRmq(ORTHER_SERVICE, process.env.RABBITMQ_ORTHER_QUEUE),
  ],
  controllers: [
    AuthController,
    UserController,
    CategoryController,
    ProductController,
    CartController,
    OrtherController,
    OrtherItemController,
  ],
  providers: [],
})
export class AppModule {}
