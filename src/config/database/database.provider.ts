import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from 'src/models/index';

export const DatabaseProvider = [
    TypeOrmModule.forRootAsync({
        imports:[ConfigModule],
        inject:[ConfigService],
        useFactory: async (config:ConfigService) => ({
            type: 'postgres',
            host: config.get('DB_HOST_DEV'),
            port: parseInt(config.get('DB_PORT_DEV')),
            database: config.get('DB_DEV'),
            username: config.get('DB_USERNAME_DEV'),
            password: config.get('DB_PASSWORD_DEV'),
            entities:[entities],
            synchronize:true,
            ssl:true
        })
    })
    
]