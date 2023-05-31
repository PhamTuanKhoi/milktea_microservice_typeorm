import { LoginRequest, RegisterRequest } from '@app/gobal';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email);

      const doesUserExist = !!user;

      if (!doesUserExist)
        throw new HttpException(`Email does not exist!!`, HttpStatus.NOT_FOUND);

      const match = await this.userService.doesPasswordMatch(
        password,
        user.password,
      );

      if (user && match) {
        return { ...user, password: user.password };
      }

      return null;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async login({ email, password }: LoginRequest) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    delete user.password;

    const jwt = await this.jwtService.signAsync({ user });

    return { token: jwt };
  }

  async register(registerRequest: RegisterRequest) {
    return this.userService.register(registerRequest);
  }

  async verifyJwt(jwt: string) {
    try {
      if (!jwt) throw new UnauthorizedException();

      const { user, exp } = await this.jwtService.verifyAsync(jwt);

      return { user, exp };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
