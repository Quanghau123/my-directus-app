import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Response } from 'express';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('register')
  async showRegisterPage(@Res() res: Response) {
    const total = await this.accountService.getTotalValidAccounts();
    res.render('register/index', { total });
  }

  @Post('register')
  async create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.createAccount(createAccountDto);
  }
}
