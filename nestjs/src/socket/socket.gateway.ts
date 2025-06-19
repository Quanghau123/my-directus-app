import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  @WebSocketServer()
  server!: Server;

  broadcastUpdate(userId: string, payload: any) {
    this.server.emit('nav_rank_updated', { userId, ...payload });
  }
}
