import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { LoginUserDto } from './dto/login-user.dto';
import Redis from 'ioredis';

interface DirectusLoginResponse {
  data: {
    access_token: string;
    refresh_token: string;
  };
}

interface DirectusUser {
  id: string;
  email: string;
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly directusUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.directusUrl =
      this.config.get<string>('DIRECTUS_URL') || 'http://localhost:8055';
  }

  async login(dto: LoginUserDto): Promise<{
    access_token: string;
    user: DirectusUser;
  } | null> {
    try {
      const loginRes = await firstValueFrom(
        this.http.post<DirectusLoginResponse>(
          `${this.directusUrl}/auth/login`,
          {
            email: dto.email,
            password: dto.password,
          },
        ),
      );

      const { access_token, refresh_token } = loginRes.data.data;

      const userRes = await firstValueFrom(
        this.http.get<{ data: DirectusUser }>(`${this.directusUrl}/users/me`, {
          headers: { Authorization: `Bearer ${access_token}` },
        }),
      );

      const user = userRes.data.data;
      const userId = user.id;

      await this.redis.set(`access_token:${userId}`, access_token, 'EX', 3600);
      await this.redis.set(
        `refresh_token:${userId}`,
        refresh_token,
        'EX',
        604800,
      );

      return {
        access_token,
        user,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.warn('Đăng nhập thất bại: ' + err.message);
      } else {
        this.logger.warn('Đăng nhập thất bại: Unknown error');
      }
      return null;
    }
  }
}
