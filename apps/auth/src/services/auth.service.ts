import { UserEntity } from '@app/common';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterRequest } from 'libs/gobal/src';
import { Repository } from 'typeorm';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
  ) {}

  async register(registerRequest: RegisterRequest) {
    return this.userService.register(registerRequest);
  }
}
