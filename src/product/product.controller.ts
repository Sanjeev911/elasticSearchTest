import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { SearchService } from 'src/search/search.service';

@Controller('products')
export class ProductController {
  constructor(
    private productService: ProductService,
    private readonly searchService: SearchService,
  ) {}

  @Get('/')
  async sampleFunction() {
    this.productService.sampleFunction();
  }

  @Post('search')
  async search(@Body() body) {
    return await this.searchService.search(body.data);
  }
  @Post('createFlipkartIndex') // to create new Index if not present
  async createIndex(@Body() body) {
    return await this.searchService.createIndex(body);
  }
  @Post('add') // to add a product - uses dummy constant data
  async addProduct(@Body() body) {
    const dbEntry = await this.productService.addProduct(body);
    return await this.searchService.index(dbEntry);
  }
  @Get('getCountByField') // to get aggregate info over a field
  async getProductCountByBrand(@Body() body) {
    return await this.searchService.aggregate(body.field);
  }
  @Get('textSearch') // to get textSearch response
  async getProuctByTextSearch(@Body() body) {
    return await this.searchService.textSearch(body.data);
  }
  @Get('facetSearch') // to get facetSearch response
  async getProductsByFacetSearcg(@Body() body) {
    return await this.searchService.facetSearch(body.data);
  }
}
