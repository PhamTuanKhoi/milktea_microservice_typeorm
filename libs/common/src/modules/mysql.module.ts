import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
        TypeOrmModule.forFeature(entities),
      ],
      exports: [TypeOrmModule],
    };
  }
}
