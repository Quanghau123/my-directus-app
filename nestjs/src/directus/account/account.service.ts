import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { SocketGateway } from '../../socket/socket.gateway';
import { StudentAccount } from '../interfaces/account.interface';

@Injectable()
export class AccountService {
  private cmsUrl: string;
  private token: string;

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly socket: SocketGateway,
  ) {
    this.cmsUrl = this.config.get<string>('CMS_URL') ?? '';
    this.token = this.config.get<string>('CMS_ACCESS_TOKEN') ?? '';
  }

  private headers() {
    return { Authorization: `Bearer ${this.token}` };
  }

  async createAccount(data: CreateAccountDto): Promise<StudentAccount> {
    const payload = {
      ...data,
      status: 'pending',
    };

    const res = await this.http.axiosRef.post<{ data: StudentAccount }>(
      `${this.cmsUrl}/items/student_account`,
      payload,
      { headers: this.headers() },
    );

    return res.data.data;
  }

  async countValidUsers(): Promise<number> {
    const res = await this.http.axiosRef.get<{
      data: { count: number }[];
    }>(`${this.cmsUrl}/items/student_account`, {
      headers: this.headers(),
      params: {
        aggregate: { count: '*' },
        filter: {
          status: { _nin: ['rejected', 'pending'] },
        },
      },
    });

    return res.data.data[0].count;
  }

  async getTopUsers(
    sortBy: 'nav' | 'rank',
    limit = 10,
  ): Promise<StudentAccount[]> {
    const res = await this.http.axiosRef.get<{ data: StudentAccount[] }>(
      `${this.cmsUrl}/items/student_account`,
      {
        headers: this.headers(),
        params: {
          sort: `-${sortBy}`,
          limit,
          filter: {
            status: { _nin: ['rejected', 'pending'] },
          },
        },
      },
    );

    return res.data.data;
  }

  notifyNavRankUpdate(
    id: string,
    payload: { nav?: number; rank?: number },
  ): void {
    this.socket.broadcastUpdate(id, payload);
  }
}
