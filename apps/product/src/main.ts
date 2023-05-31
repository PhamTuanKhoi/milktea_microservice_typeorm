import { RmqService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ProductModule } from './product.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);

  const configService = app.get(ConfigService);

  const rmqService = app.get(RmqService);

  const queue = configService.get<string>('RABBITMQ_PRODUCT_QUEUE');

  app.connectMicroservice<MicroserviceOptions>(rmqService.getOptions(queue));

  app.startAllMicroservices();
}
bootstrap();
