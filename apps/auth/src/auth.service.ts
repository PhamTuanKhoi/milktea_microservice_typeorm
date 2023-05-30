import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register(Payload): string {
    console.log(Payload);

    return 'Hello World!';
  }
}
