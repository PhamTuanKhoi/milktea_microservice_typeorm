import { MysqlModule, RmqModule, UserEntity } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtSecret } from './contants/contants';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

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
          expiresIn: '3600s',
        },
      }),
    }),
    MysqlModule.register([UserEntity], process.env.MYSQL_USER_URI),
    RmqModule,
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
