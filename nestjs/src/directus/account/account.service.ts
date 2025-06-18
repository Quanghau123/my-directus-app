import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateAccountDto } from './dto/create-account.dto';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AccountService {
  private readonly directusUrl: string;
  private readonly directusToken: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.directusUrl =
      this.config.get<string>('DIRECTUS_URL') || 'http://localhost:8055';
    this.directusToken = this.config.get<string>('DIRECTUS_TOKEN') || '';
  }

  async createAccount(
    data: CreateAccountDto,
  ): Promise<{ data: { id: string } }> {
    const url = `${this.directusUrl}/items/account`;

    const response: AxiosResponse<{ data: { id: string } }> =
      await lastValueFrom(
        this.http.post(url, data, {
          headers: {
            Authorization: `Bearer ${this.directusToken}`,
          },
        }),
      );

    return response.data;
  }

  async getTotalValidAccounts(): Promise<number> {
    const url = `${this.directusUrl}/items/account?filter[account_status][_neq]=rejected&aggregate[count]=*`;

    const response: AxiosResponse<{ data: { count: number }[] }> =
      await lastValueFrom(
        this.http.get(url, {
          headers: {
            Authorization: `Bearer ${this.directusToken}`,
          },
        }),
      );

    return response.data.data[0].count;
  }
}
