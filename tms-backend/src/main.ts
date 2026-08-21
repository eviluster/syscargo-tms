import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClearWhiteSpaceInterceptor } from './common/base/interceptors/white-space.interceptor';
import { LoggingInterceptor } from './common/base/interceptors/logging.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import Debugger from 'debug'
import { json, urlencoded } from 'body-parser';
import helmet from 'helmet';
import logger from './common/logging/winston.config';

const debug = Debugger('fin-auto:main')

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configurar Helmet para headers de seguridad
  app.use(helmet());

  // Global location of DNS/v1/ Rest URL — poner el prefijo antes de CORS es más fiable
  app.setGlobalPrefix('v1');

  // Servir archivos estáticos para las facturas subidas
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Validators
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClearWhiteSpaceInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Configurar el tamaño máximo del cuerpo de la solicitud
  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ limit: '20mb', extended: true }));

  // Habilitar CORS con opciones explícitas (incluye OPTIONS)
  app.enableCors({
    origin: ['https://admin.syscargo.cu', 'https://tms.syscargo.cu'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: ['Authorization'],
    credentials: true, // habilita si usas cookies/sesiones
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Configurar Swagger solo en modo desarrollo
  if (process.env.NODE_ENV === 'development') {
    const options = new DocumentBuilder()
      .setTitle('FIN AUTO')
      .setDescription('FIN AUTO API')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  // Configurar límite de tiempo de respuesta (30 segundos)
  app.use((req, res, next) => {
    res.setTimeout(30000, () => {
      logger.warn('Request timeout', {
        url: req.url,
        method: req.method,
        ip: req.ip,
      });
      if (!res.headersSent) {
        res.status(504).json({
          statusCode: 504,
          message: 'Gateway Timeout',
          error: 'Request timeout',
        });
      }
    });
    next();
  });

  // iniciando puerto 5000 para dejar free el 3000 para frontend
  await app.listen(5000, '0.0.0.0');
  logger.info('Application is running on http://0.0.0.0:5000');
}
bootstrap().catch((error) => {
  logger.error('Error starting application:', error);
  process.exit(1);
});
