import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as Cors from 'cors'
import { AppModule } from './app.module';
import helmet from 'helmet';



async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('chat')
    .setDescription('The chat API description')
    .setVersion('1.0')
    .addTag('users')
    .addTag('chat')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);
  app.use(helmet());
  app.enableCors()
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
