import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { MongooseExceptionFilter } from './common/excption.filter';



async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('chat')
    .setDescription('The chat API description')
    .setVersion('1.0')
    .addTag('users')
    .addTag('chat')
    .addTag('Wallet')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);
  app.use(helmet());
  app.enableCors()
  // app.useGlobalFilters(new MongooseExceptionFilter())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
