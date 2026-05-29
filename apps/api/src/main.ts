import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.enableCors({ origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*', credentials: true });
  const doc = SwaggerModule.createDocument(app, new DocumentBuilder()
    .setTitle('Chatowa API').setVersion('1.0').addBearerAuth().build());
  SwaggerModule.setup('api/docs', app, doc);
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log('Chatowa API on port ' + port);
}
bootstrap();