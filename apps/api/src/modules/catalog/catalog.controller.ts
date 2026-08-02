import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogQueryDto } from './dto/catalog-query.dto';

@Controller()
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('products')
  products(@Query() query: CatalogQueryDto) {
    return this.catalog.listProducts(query);
  }

  @Get('products/featured')
  featuredProducts(@Query() query: CatalogQueryDto) {
    return this.catalog.featuredProducts(query);
  }

  @Get('products/new-arrivals')
  newArrivals(@Query() query: CatalogQueryDto) {
    return this.catalog.newArrivals(query);
  }

  @Get('products/:slug')
  product(@Param('slug') slug: string) {
    return this.catalog.getProductBySlug(slug);
  }

  @Get('categories')
  categories(@Query() query: CatalogQueryDto) {
    return this.catalog.listCategories(query);
  }

  @Get('categories/:slug')
  category(@Param('slug') slug: string) {
    return this.catalog.getCategoryBySlug(slug);
  }

  @Get('categories/:slug/products')
  categoryProducts(@Param('slug') slug: string, @Query() query: CatalogQueryDto) {
    return this.catalog.getCategoryProducts(slug, query);
  }

  @Get('brands')
  brands(@Query() query: CatalogQueryDto) {
    return this.catalog.listBrands(query);
  }

  @Get('brands/:slug')
  brand(@Param('slug') slug: string) {
    return this.catalog.getBrandBySlug(slug);
  }

  @Get('brands/:slug/products')
  brandProducts(@Param('slug') slug: string, @Query() query: CatalogQueryDto) {
    return this.catalog.getBrandProducts(slug, query);
  }
}
