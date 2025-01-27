import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './presentation/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  dotenv.config();

  const config = new DocumentBuilder()
    .setTitle('ddd')
    .setDescription('Api Documentation')
    .setVersion('1.0')
    .addTag('auth', 'احراز هویت')
    .addTag('Permission', 'سطح دسترسی')

    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.APP_PORT);
  console.log(`app running on : ${await app.getUrl()}`);
}
bootstrap();
