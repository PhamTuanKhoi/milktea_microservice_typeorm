import { Module } from '@nestjs/common';
import { OrtherController } from './controllers/orther.controller';
import { OrtherService } from './services/orther.service';

@Module({
  imports: [],
  controllers: [OrtherController],
  providers: [OrtherService],
})
export class OrtherModule {}
