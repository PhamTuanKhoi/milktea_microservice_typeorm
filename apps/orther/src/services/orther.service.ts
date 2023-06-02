import { Injectable } from '@nestjs/common';

@Injectable()
export class OrtherService {
  getHello(): string {
    return 'Hello World!';
  }
}
