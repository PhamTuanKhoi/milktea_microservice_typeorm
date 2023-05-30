import { Injectable } from '@nestjs/common';
import { RegisterRequest } from 'libs/gobal/src';

@Injectable()
export class AuthService {
  async register(registerRequest: RegisterRequest) {
    return 'Hello World!';
  }
}
