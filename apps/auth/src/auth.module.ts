import { CartEntity, MysqlModule, RmqModule, UserEntity } from '@app/common';
import { PRODUCT_SERVICE } from '@app/gobal';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from './contants/contants';
import { AuthController } from './controllers/auth.controller';
import { CartController } from './controllers/cart.controller';
import { UserController } from './controllers/user.controller';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { UserService } from './services/user.service';
import { JwtStrategy } from './strategys/jwt.stratery';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: jwtSecret,
        signOptions: {
          expiresIn: '14400s',
        },
      }),
    }),
    MysqlModule.register([UserEntity, CartEntity], process.env.MYSQL_USER_URI),
    RmqModule.registerRmq(PRODUCT_SERVICE, process.env.RABBITMQ_PRODUCT_QUEUE),
  ],
  controllers: [AuthController, UserController, CartController],
  providers: [AuthService, UserService, JwtStrategy, CartService],
})
export class AuthModule {}
