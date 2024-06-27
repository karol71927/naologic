import { MongoDriver } from '@mikro-orm/mongodb';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { productModuleEntities } from '../../module/core/product/product.module';

export const mikroOrmConfigFactory = (
  configService: ConfigService,
  entities = [...productModuleEntities],
): MikroOrmModuleOptions => {
  const moduleOptions: MikroOrmModuleOptions = {
    port: configService.get<number>('DB_PORT'),
    user: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    dbName: configService.get<string>('DB_NAME'),
    clientUrl: `mongodb://${configService.get<string>('DB_HOST')}`,
    driver: MongoDriver,
    entities,
  };

  return moduleOptions;
};
