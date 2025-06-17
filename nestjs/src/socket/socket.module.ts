import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { DirectusModule } from '../directus/directus.module';

@Module({
  imports: [DirectusModule],
  providers: [SocketGateway],
})
export class SocketModule {}
