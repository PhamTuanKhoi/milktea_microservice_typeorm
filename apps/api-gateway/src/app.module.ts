import { RmqModule } from '@app/common';
import { AUTH_SERVICE, CATEGORY_SERVICE } from '@app/gobal';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { CategoryController } from './controllers/category.controller';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    RmqModule.registerRmq(AUTH_SERVICE, process.env.RABBITMQ_AUTH_QUEUE),
    RmqModule.registerRmq(CATEGORY_SERVICE, process.env.RABBITMQ_PRODUCT_QUEUE),
  ],
  controllers: [AuthController, UserController, CategoryController],
  providers: [],
})
export class AppModule {}
