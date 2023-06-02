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
import { AudioConsumer } from './test.consumer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    RmqModule.registerRmq(AUTH_SERVICE, process.env.RABBITMQ_AUTH_QUEUE),
    RmqModule.registerRmq(PRODUCT_SERVICE, process.env.RABBITMQ_PRODUCT_QUEUE),
    RmqModule.registerRmq(ORTHER_SERVICE, process.env.RABBITMQ_ORTHER_QUEUE),
    BullModule.registerQueue({
      name: 'test',
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: 'redis-13397.c93.us-east-1-3.ec2.cloud.redislabs.com',
          port: 13397,
          password: 'mvkDOVdHIjKDSaB4yu4Ix4zMW5GRivAd',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    CategoryController,
    ProductController,
    CartController,
    OrtherController,
  ],
  providers: [AudioConsumer],
})
export class AppModule {}
