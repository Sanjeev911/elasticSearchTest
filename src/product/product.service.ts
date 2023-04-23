/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  async sampleFunction(): Promise<void> {}
  async addProduct(productData: any): Promise<any> {
    return productData;
  }
}
