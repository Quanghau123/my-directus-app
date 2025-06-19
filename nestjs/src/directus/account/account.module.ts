import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { SocketModule } from '../../socket/socket.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule, SocketModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
