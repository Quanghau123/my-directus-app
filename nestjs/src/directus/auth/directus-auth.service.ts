import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { firstValueFrom } from 'rxjs';

interface LoginResponse {
  data: {
    access_token: string;
    refresh_token: string;
  };
}

@Injectable()
export class DirectusAuthService {
  private readonly logger = new Logger(DirectusAuthService.name);

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async login(): Promise<string | null> {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');

    if (!email || !password) {
      this.logger.error('!email || !password trong .env');
      return null;
    }

    try {
      const res = await firstValueFrom(
        this.http.post<LoginResponse>('http://localhost:8055/auth/login', {
          email,
          password,
        }),
      );

      const { access_token, refresh_token } = res.data.data;

      await this.redis.set('access_token', access_token, 'EX', 600);
      await this.redis.set('refresh_token', refresh_token, 'EX', 86400);

      this.logger.log('Đăng nhập Directus thành công');
      return access_token;
    } catch (err) {
      this.logger.error(
        'Đăng nhập Directus thất bại',
        err instanceof Error ? err.message : String(err),
      );
      return null;
    }
  }

  async getAccessToken(): Promise<string | null> {
    return await this.redis.get('access_token');
  }

  async refreshTokenIfNeeded(): Promise<void> {
    const token = await this.getAccessToken();
    if (!token) {
      await this.login();
    }
  }

  async getCurrentUser(): Promise<Record<string, unknown> | null> {
    await this.refreshTokenIfNeeded();
    const token = await this.getAccessToken();

    if (!token) {
      this.logger.warn('Không tìm thấy access_token trong Redis');
      return null;
    }

    try {
      const response = await firstValueFrom(
        this.http.get<{ data: unknown }>('http://localhost:8055/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      const userData = response.data.data;

      if (typeof userData === 'object' && userData !== null) {
        return userData as Record<string, unknown>;
      }

      this.logger.warn('Dữ liệu từ /users/me không hợp lệ');
      return null;
    } catch (error) {
      this.logger.error(
        'Lỗi khi lấy người dùng hiện tại',
        error instanceof Error ? error.message : String(error),
      );
      return null;
    }
  }
}
