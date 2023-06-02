import {
  MysqlModule,
  OrtherEntity,
  OrtherItemEntity,
  RmqModule,
} from '@app/common';
import { PRODUCT_SERVICE } from '@app/gobal';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrtherController } from './controllers/orther.controller';
import { OrtherService } from './services/orther.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    MysqlModule.register(
      [OrtherEntity, OrtherItemEntity],
      process.env.MYSQL_ORTHER_URI,
    ),
    RmqModule.registerRmq(PRODUCT_SERVICE, process.env.RABBITMQ_PRODUCT_QUEUE),
  ],
  controllers: [OrtherController],
  providers: [OrtherService],
})
export class OrtherModule {}
