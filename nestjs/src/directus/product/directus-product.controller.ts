import { Controller, Get } from '@nestjs/common';
import { DirectusProductService } from './directus-product.service';
import { Product } from '../interfaces/product.interface';

@Controller('products')
export class ProductController {
  constructor(
    private readonly directusProductService: DirectusProductService,
  ) {}

  @Get()
  async getProducts(): Promise<Product[]> {
    return await this.directusProductService.fetchProducts();
  }
}
