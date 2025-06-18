import { Module } from '@nestjs/common';
import { ProductModule } from '../directus/product/product.module';
import { AccountModule } from '../directus/account/account.module';
import { UserModule } from '../directus/user/user.module';
import { AuthModule } from '../directus/auth/auth.module';

@Module({
  imports: [ProductModule, AuthModule, AccountModule, UserModule],
  exports: [ProductModule, AuthModule, AccountModule, UserModule],
})
export class DirectusModule {}
