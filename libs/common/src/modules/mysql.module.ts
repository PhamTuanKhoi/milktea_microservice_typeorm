import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';

@Module({})
export class MysqlModule {
  static register(entities: Function[], database: string): DynamicModule {
    return {
      module: MysqlModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'mysql',
            url: database,
            entities,
            synchronize: true,
          }),
        }),
      ],
    };
  }
}
