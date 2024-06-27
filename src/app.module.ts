import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { mikroOrmConfigFactory } from './database/mikro-orm/mikro-orm.config-factory';
import { BullModule } from '@nestjs/bull';
import { ProductModule } from './module/core/product/product.module';
import { QueueOptions } from 'bull';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return mikroOrmConfigFactory(configService);
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): QueueOptions => {
        return {
          defaultJobOptions: {
            removeOnComplete: true,
          },
          redis: {
            host: configService.get<string>('REDIS_HOST'),
            port: parseInt(configService.get<string>('REDIS_PORT'), 10),
          },
        };
      },
      inject: [ConfigService],
    }),
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
