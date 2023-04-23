import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import sampleProducts from 'src/product/utility';

@Injectable()
export class SearchService {
  constructor(
    private readonly EsService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}

  async search(search: { key: string }) {
    const searchResult = await this.EsService.search({
      index: this.configService.get('ES_INDEX'),
      body: {
        query: {
          match_phrase: search,
        },
      },
    });
    const hits = searchResult.hits.hits ?? [];
    return {
      results: hits,
    };
  }

  async createIndex(body: any) {
    const checkIndex: any = await this.EsService.indices.exists({
      index: this.configService.get('ES_INDEX'),
    });
    if (!checkIndex) {
      this.EsService.indices.create({
        index: this.configService.get('ES_INDEX'),
        body: {
          mappings: {
            // This is a mapping that can be used for storing docs related to filpkart data , there can be multiple fieilds, some of them are listed below.
            properties: {
              brand: {
                type: 'keyword',
                fields: {
                  raw: {
                    type: 'text',
                  },
                },
              },
              category: {
                type: 'keyword', // term Search
              },
              description: {
                type: 'text', //phrase Search
              },
              discountedPrice: {
                type: 'float',
              },
              rating: {
                type: 'half_float',
              },
              barcode: {
                type: 'keyword', // term Search
              },
              name: {
                type: 'text', //phraseSearch
              },
              url: {
                type: 'keyword', // term Search
              },
              price: {
                type: 'float', // range Queries
              },
              databaseUniqueId: {
                type: 'keyword',
              },
            },
          },
        },
      });
    }
  }

  async index(data: any) {
    // adds new document to index
    const bulk = [];
    sampleProducts.map((product) => {
      bulk.push({
        index: { _index: 'flipkart' },
      });
      bulk.push(product);
    });
    const res = await this.EsService.bulk({
      index: this.configService.get('ES_INDEX'),
      body: bulk,
    });
  }

  async aggregate(field: string) {
    // Useful for getting aggregate count based on field of the document
    // input:  field = "brand"
    // output: {
    //   "results": [
    //     {
    //       "key": "Apple",
    //       "doc_count": 5
    //     },
    //     {
    //       "key": "Levis",
    //       "doc_count": 1
    //     }
    //   ]
    // }
    const searchResult = await this.EsService.search({
      index: this.configService.get('ES_INDEX'),
      body: {
        aggs: {
          flipkart: {
            terms: {
              field,
              size: 1000,
            },
          },
        },
      },
    });
    const hits = searchResult.aggregations.flipkart['buckets'] ?? [];
    return {
      results: hits,
    };
  }

  async textSearch(data: any) {
    // Useful for a text search where we can leverage multi match to match query over multiple fields
    // "ram" keyword is looked for in fields brand, name and description
    const searchResult = await this.EsService.search({
      index: this.configService.get('ES_INDEX'),
      body: {
        size: 100,
        query: {
          multi_match: {
            query: 'ram',
            fields: ['brand', 'name', 'description'],
          },
        },
      },
    });
    return {
      results: searchResult.hits.hits ?? [],
    };
  }

  async facetSearch(data: any) {
    // Useful for a facet search where we leverage term search
    // example if we want to fetch by category ( a term in our mapping )
    const searchResult = await this.EsService.search({
      index: this.configService.get('ES_INDEX'),
      body: {
        query: {
          term: { category: 'laptop' },
        },
      },
    });
    return {
      results: searchResult.hits.hits ?? [],
    };
  }
}
