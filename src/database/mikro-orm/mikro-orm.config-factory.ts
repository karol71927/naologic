import { MongoDriver } from '@mikro-orm/mongodb';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { productModuleEntities } from '../../module/core/product/product.module';

export const mikroOrmConfigFactory = (
  configService: ConfigService,
  entities = [...productModuleEntities],
): MikroOrmModuleOptions => {
  const moduleOptions: MikroOrmModuleOptions = {
    dbName: configService.get<string>('DB_NAME'),
    clientUrl: `mongodb://${configService.get<string>('DB_USER')}:${configService.get<string>('DB_PASSWORD')}@${configService.get<string>('DB_HOST')}:${configService.get<number>('DB_PORT')}`,
    driver: MongoDriver,
    entities,
  };

  return moduleOptions;
};
