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
import {
  ListEntiyReponse,
  QueryUserDto,
  RegisterRequest,
  UpdateUserDtoById,
} from '@app/gobal';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async list(
    queryUserDto: QueryUserDto,
  ): Promise<ListEntiyReponse<UserEntity>> {
    const { name, limit, page, sortBy, sortType } = queryUserDto;

    const query: FindManyOptions = {};

    if (name)
      query.where = {
        name: ILike(`%${name}%`),
      };

    if (sortBy && sortType) query.order = { [sortBy]: 'DESC' };

    if (page) query.skip = (page - 1) * limit;

    if (limit) query.take = limit;

    const users = await this.userRepository.find(query);

    return {
      list: users,
      count: users.length,
      limit: +limit || 0,
      page: +page || 0,
    };
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'password', 'avatar'],
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

  async update(updateUserDtoById: UpdateUserDtoById): Promise<UserEntity> {
    const { id, email, name, avatar } = updateUserDtoById;
    try {
      const user = await this.findByEmail(email);

      if (user && user !== null)
        throw new HttpException(`email is exist!!`, HttpStatus.CONFLICT);

      const userModel = new UserEntity();

      userModel.name = name;
      userModel.email = email;
      userModel.avatar = avatar;

      const updated = await this.userRepository.update(id, userModel);
      this.logger.log(`updated a user by id#${updated?.affected}`);

      return this.findById(id);
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
