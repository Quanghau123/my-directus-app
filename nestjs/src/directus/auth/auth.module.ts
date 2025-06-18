import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DirectusAuthService } from './directus-auth.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [DirectusAuthService],
  exports: [DirectusAuthService],
})
export class AuthModule {}
