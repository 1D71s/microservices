import { ConfigService } from '@nestjs/config';
import { IRMQServiceAsyncOptions } from 'nestjs-rmq';

export const getRMQConfig = (): IRMQServiceAsyncOptions => ({
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => ({
		exchangeName: configService.get<string>('RMQ_EXCHANGE'),
		connections: [
			{
				login: configService.get<string>('RMQ_USER'),
				password: configService.get<string>('RMQ_PASSWORD'),
				host: configService.get<string>('RMQ_HOSTNAME')
			}
		],
		prefetchCount: 32,
		serviceName: configService.get<string>('RMQ_QUEUE'),
	})
});
