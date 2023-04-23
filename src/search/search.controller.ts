import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
}
