import { Controller, Get } from '@nestjs/common';
import { OrtherService } from '../services/orther.service';

@Controller()
export class OrtherController {
  constructor(private readonly ortherService: OrtherService) {}

  @Get()
  getHello(): string {
    return this.ortherService.getHello();
  }
}
