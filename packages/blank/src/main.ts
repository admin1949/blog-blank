import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotauthFilter } from '@/filters/notauth.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new NotauthFilter());
  await app.listen(3001);
}
bootstrap();
