import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DirectusProductService } from '../directus/product/directus-product.service';
import { DirectusAuthService } from '../directus/auth/directus-auth.service';
import { Interval } from '@nestjs/schedule';
import { AccountService } from '../directus/account/account.service';

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly directusProductService: DirectusProductService,
    private readonly directusAuthService: DirectusAuthService,
    private readonly accountService: AccountService,
  ) {}

  afterInit(): void {
    console.log('Socket Gateway Initialized');
  }

  private emitSafe<T>(event: string, data: T): void {
    if (this.server && typeof this.server.emit === 'function') {
      this.server.emit(event, data);
    }
  }

  @Interval(5000)
  async handleInterval(): Promise<void> {
    // Gửi user hiện tại
    const currentUser = await this.directusAuthService.getCurrentUser();
    if (currentUser) {
      this.emitSafe('current_user', currentUser);
    }

    // Gửi sản phẩm random
    const products = await this.directusProductService.fetchProducts();
    if (products.length > 0) {
      const random = products[Math.floor(Math.random() * products.length)];
      this.emitSafe('product_created', random);
    }

    const count = await this.accountService.getTotalValidAccounts();
    this.emitSafe('valid_account_count', count);
  }
}
