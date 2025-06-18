import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Product } from '../interfaces/product.interface';
import { DirectusAuthService } from '../auth/directus-auth.service';

interface DirectusDataResponse<T> {
  data: T;
}

@Injectable()
export class DirectusProductService {
  private readonly logger = new Logger(DirectusProductService.name);

  constructor(
    private readonly http: HttpService,
    private readonly authService: DirectusAuthService,
    private readonly config: ConfigService,
  ) {}

  async fetchProducts(): Promise<Product[]> {
    await this.authService.refreshTokenIfNeeded();
    const token = await this.authService.getAccessToken();
    const directusUrl =
      this.config.get<string>('DIRECTUS_URL') || 'http://localhost:8055';

    try {
      const res = await firstValueFrom(
        this.http.get<DirectusDataResponse<Product[]>>(
          `${directusUrl}/items/products`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      );
      return res.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError;

      if (error?.response?.status === 401) {
        await this.authService.login();
        return this.fetchProducts();
      }

      this.logger.error(
        'Lỗi khi lấy sản phẩm',
        error?.message || error?.stack || 'Unknown error',
      );
      return [];
    }
  }
}
