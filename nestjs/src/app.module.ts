import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DirectusModule } from './directus/directus.module';
import { SocketModule } from './socket/socket.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../../directus/.env'),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'views'),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): RedisModuleOptions => ({
        type: 'single',
        options: {
          host: config.get<string>('REDIS_HOST') || 'cache',
          port: parseInt(config.get<string>('REDIS_PORT') || '6379', 10),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
          db: parseInt(config.get<string>('REDIS_DB') || '0', 10),
        },
      }),
    }),
    DirectusModule,
    SocketModule,
  ],
})
export class AppModule {}
