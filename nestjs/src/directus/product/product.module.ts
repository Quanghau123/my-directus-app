import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DirectusProductService } from './directus-product.service';
import { ProductController } from './directus-product.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule, ConfigModule, AuthModule],
  controllers: [ProductController],
  providers: [DirectusProductService],
  exports: [DirectusProductService],
})
export class ProductModule {}
