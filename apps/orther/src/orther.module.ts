import {
  BullModuleCache,
  MysqlModule,
  OrtherEntity,
  OrtherItemEntity,
  RmqModule,
} from '@app/common';
import { BULL_ORTHER_QUEUE, PRODUCT_SERVICE } from '@app/gobal';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrtherController } from './controllers/orther.controller';
import { OrtherService } from './services/orther.service';
import { BullModule } from '@nestjs/bull';
import { OrtherConsumer } from './consumers/orther.consumer';

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
    BullModuleCache.register(),
    BullModule.registerQueue({
      name: BULL_ORTHER_QUEUE,
    }),
  ],
  controllers: [OrtherController],
  providers: [OrtherService, OrtherConsumer],
})
export class OrtherModule {}
