import { DynamicModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

@Module({})
export class BullModuleCache {
  static register(): DynamicModule {
    return {
      module: BullModuleCache,
      imports: [
        BullModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            redis: {
              host: configService.get<string>('REDIS_HOST'),
              port: +configService.get<string>('REDIS_PORT'),
              password: configService.get<string>('REDIS_PASSWORD'),
            },
          }),
          inject: [ConfigService],
        }),
      ],
    };
  }
}
