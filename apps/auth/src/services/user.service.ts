import { UserEntity } from '@app/common';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterRequest } from 'libs/gobal/src';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async list(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'password', 'avartar'],
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hashSync(password, 12);
  }

  async doesPasswordMatch(
    passwordText: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compareSync(passwordText, hashedPassword);
  }

  async register(registerRequest: RegisterRequest) {
    let { password, email } = registerRequest;

    const user = await this.findByEmail(email);

    if (user)
      throw new HttpException('email already exists!', HttpStatus.CONFLICT);

    password = await this.hashPassword(password);

    const created = await this.userRepository.save({
      ...registerRequest,
      password,
    });

    delete created.password;

    return created;
  }
}
