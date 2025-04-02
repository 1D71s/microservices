import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const mongoConfig = (): MongooseModuleAsyncOptions => ({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        uri: getMongoUri(configService),
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }),
});

const getMongoUri = (configService: ConfigService): string => {
    const login = configService.get<string>('MONGO_LOGIN');
    const password = configService.get<string>('MONGO_PASSWORD');
    const host = configService.get<string>('MONGO_HOST');
    const port = configService.get<number>('MONGO_PORT');
    const database = configService.get<string>('MONGO_DATABASE');
    const authSource = configService.get<string>('MONGO_AUTHDATABASE', 'admin');

    return `mongodb://${login}:${password}@${host}:${port}/${database}?authSource=${authSource}`;
};
