import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClearWhiteSpaceInterceptor } from './common/base/interceptors/white-space.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import Debugger from 'debug'
import { json, urlencoded } from 'body-parser';

const debug = Debugger('fin-auto:main')

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global location of DNS/v1/ Rest URL — poner el prefijo antes de CORS es más fiable
  app.setGlobalPrefix('v1');

  // Validators
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClearWhiteSpaceInterceptor());

  // Configurar el tamaño máximo del cuerpo de la solicitud
  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ limit: '20mb', extended: true }));

  // Habilitar CORS con opciones explícitas (incluye OPTIONS)
  app.enableCors({
    origin: ['https://admin.syscargo.cu', 'https://tms.syscargo.cu'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
//     credentials: true, // habilita si usas cookies/sesiones
    // preflightContinue: false,
    // optionsSuccessStatus: 204,
  });



  const options = new DocumentBuilder()
    .setTitle('FIN AUTO')
    .setDescription('FIN AUTO API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // iniciando puerto 5000 para dejar free el 3000 para frontend
  await app.listen(5000, '0.0.0.0');
}
bootstrap();
