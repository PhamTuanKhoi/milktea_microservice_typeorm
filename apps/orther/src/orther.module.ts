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
import { OrtherItemController } from './controllers/orther-item.controller';
import { OrtherItemService } from './services/orther-item.service';

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
  controllers: [OrtherController, OrtherItemController],
  providers: [OrtherService, OrtherConsumer, OrtherItemService],
})
export class OrtherModule {}
