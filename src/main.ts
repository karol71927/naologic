import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FetchProductsScheduler } from './module/core/product/scheduler/fetch-products.scheduler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  await app.get(FetchProductsScheduler).fetchDocuments();
}
bootstrap();
