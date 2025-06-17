import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ProductController } from './product/directus-product.controller';
import { DirectusAuthService } from './auth/directus-auth.service';
import { DirectusProductService } from './product/directus-product.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ProductController],
  providers: [DirectusAuthService, DirectusProductService],
  exports: [DirectusAuthService, DirectusProductService],
})
export class DirectusModule {}
