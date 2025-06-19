import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DirectusModule } from './directus/directus.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DirectusModule,
    SocketModule,
  ],
})
export class AppModule {}
