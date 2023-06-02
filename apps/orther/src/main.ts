import { RmqService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { OrtherModule } from './orther.module';

async function bootstrap() {
  const app = await NestFactory.create(OrtherModule);

  const configService = app.get(ConfigService);

  const rmqService = app.get(RmqService);

  const queue = configService.get<string>('RABBITMQ_ORTHER_QUEUE');

  app.connectMicroservice<MicroserviceOptions>(rmqService.getOptions(queue));

  app.startAllMicroservices();
}
bootstrap();
