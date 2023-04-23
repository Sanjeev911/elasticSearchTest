import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { SearchModule } from './search/search.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ProductModule, SearchModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
