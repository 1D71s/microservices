import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { RMQExceptionFilter } from './app/common/exceptions/rmq-exception';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    app.useGlobalFilters(new RMQExceptionFilter());

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3000;     
    
    await app.listen(port);
    Logger.log(
        `🚀 API Application is running on: PORT: ${port}`
    );
}

bootstrap();
