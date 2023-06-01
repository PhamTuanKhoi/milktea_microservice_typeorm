import { UserEntity } from '@app/common';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { QueryUserDto, RegisterRequest } from '@app/gobal';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async list(queryUserDto: QueryUserDto): Promise<UserEntity[]> {
    const { name, limit, page, sortBy, sortType } = queryUserDto;

    const query: FindManyOptions = {};

    if (name)
      query.where = {
        name: ILike(`%${name}%`),
      };

    if (sortBy && sortType) query.order = { [sortBy]: 'DESC' };

    if (page) query.skip = (page - 1) * limit;

    if (limit) query.take = limit;

    return this.userRepository.find(query);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'password', 'avartar'],
    });
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
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

  async register(registerRequest: RegisterRequest): Promise<UserEntity> {
    let { password, email } = registerRequest;

    try {
      const user = await this.findByEmail(email);

      if (user)
        throw new HttpException('email already exists!', HttpStatus.CONFLICT);

      password = await this.hashPassword(password);

      const created = await this.userRepository.save({
        ...registerRequest,
        password,
      });

      delete created.password;

      this.logger.log(`register a new user by id#${created?.id}`);
      return created;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new BadRequestException();
    }
  }

  async isModelExist(id: number) {
    try {
      const user = await this.findById(id);

      if (!user || user === null)
        throw new HttpException(
          `user not found by id ${id}`,
          HttpStatus.NOT_FOUND,
        );

      return user;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new BadRequestException();
    }
  }
}
