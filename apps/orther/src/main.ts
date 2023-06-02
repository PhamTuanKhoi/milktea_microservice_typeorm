import { NestFactory } from '@nestjs/core';
import { OrtherModule } from './orther.module';

async function bootstrap() {
  const app = await NestFactory.create(OrtherModule);
  await app.listen(3000);
}
bootstrap();
