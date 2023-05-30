import { RmqService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const configService = app.get(ConfigService);

  const rmqService = app.get(RmqService);

  const queue = configService.get<string>('RABBITMQ_AUTH_QUEUE');

  app.connectMicroservice<MicroserviceOptions>(rmqService.getOptions(queue));

  app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
