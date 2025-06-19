import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { StudentAccountDto } from './dto/student-account.dto';
import { AccountService } from './account.service';
import { plainToInstance } from 'class-transformer';

interface WebhookPayload {
  data: {
    id: string;
    nav?: number;
    rank?: number;
  };
}

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  async register(@Body() dto: CreateAccountDto) {
    return this.accountService.createAccount(dto);
  }

  @Get('count-valid')
  async countValid() {
    const count = await this.accountService.countValidUsers();
    return { count };
  }

  @Get('top')
  async top(
    @Query('sortBy') sortBy: 'nav' | 'rank',
  ): Promise<StudentAccountDto[]> {
    const students = await this.accountService.getTopUsers(sortBy);
    return plainToInstance(StudentAccountDto, students);
  }

  @Post('webhook/update')
  handleWebhook(@Body() body: WebhookPayload) {
    const { id, nav, rank } = body.data;

    if (id && (nav !== undefined || rank !== undefined)) {
      this.accountService.notifyNavRankUpdate(id, { nav, rank });
    }

    return { ok: true };
  }
}
