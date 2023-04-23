import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [SearchModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
