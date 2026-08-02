import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CatalogService } from './catalog.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';
import { CatalogQueryDto } from './dto/catalog-query.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CreateImageDto, UpdateImageDto } from './dto/image.dto';
import { CreateOptionDto, UpdateOptionDto } from './dto/option.dto';
import { CreateProductDto, UpdateProductDto, UpdateProductStatusDto } from './dto/product.dto';
import { CreateVariantDto, UpdateVariantDto } from './dto/variant.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
@Controller('admin')
export class AdminCatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.catalog.createCategory(dto);
  }

  @Get('categories')
  listCategories(@Query() query: CatalogQueryDto) {
    return this.catalog.listAdminCategories(query);
  }

  @Get('categories/:id')
  getCategory(@Param('id') id: string) {
    return this.catalog.getAdminCategory(id);
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.catalog.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.catalog.deleteCategory(id);
  }

  @Post('brands')
  createBrand(@Body() dto: CreateBrandDto) {
    return this.catalog.createBrand(dto);
  }

  @Get('brands')
  listBrands(@Query() query: CatalogQueryDto) {
    return this.catalog.listAdminBrands(query);
  }

  @Get('brands/:id')
  getBrand(@Param('id') id: string) {
    return this.catalog.getAdminBrand(id);
  }

  @Patch('brands/:id')
  updateBrand(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.catalog.updateBrand(id, dto);
  }

  @Delete('brands/:id')
  deleteBrand(@Param('id') id: string) {
    return this.catalog.deleteBrand(id);
  }

  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.catalog.createProduct(dto);
  }

  @Get('products')
  listProducts(@Query() query: CatalogQueryDto) {
    return this.catalog.listAdminProducts(query);
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string) {
    return this.catalog.getAdminProduct(id);
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.catalog.updateProduct(id, dto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.catalog.deleteProduct(id);
  }

  @Patch('products/:id/status')
  updateProductStatus(@Param('id') id: string, @Body() dto: UpdateProductStatusDto) {
    return this.catalog.updateProductStatus(id, dto.status);
  }

  @Post('products/:id/publish')
  publishProduct(@Param('id') id: string) {
    return this.catalog.publishProduct(id);
  }

  @Post('products/:id/unpublish')
  unpublishProduct(@Param('id') id: string) {
    return this.catalog.unpublishProduct(id);
  }

  @Post('products/:productId/variants')
  createVariant(@Param('productId') productId: string, @Body() dto: CreateVariantDto) {
    return this.catalog.createVariant(productId, dto);
  }

  @Get('products/:productId/variants')
  listVariants(@Param('productId') productId: string) {
    return this.catalog.listVariants(productId);
  }

  @Patch('products/:productId/variants/:variantId')
  updateVariant(@Param('productId') productId: string, @Param('variantId') variantId: string, @Body() dto: UpdateVariantDto) {
    return this.catalog.updateVariant(productId, variantId, dto);
  }

  @Delete('products/:productId/variants/:variantId')
  deleteVariant(@Param('productId') productId: string, @Param('variantId') variantId: string) {
    return this.catalog.deleteVariant(productId, variantId);
  }

  @Post('products/:productId/options')
  createOption(@Param('productId') productId: string, @Body() dto: CreateOptionDto) {
    return this.catalog.createOption(productId, dto);
  }

  @Get('products/:productId/options')
  listOptions(@Param('productId') productId: string) {
    return this.catalog.listOptions(productId);
  }

  @Patch('products/:productId/options/:optionId')
  updateOption(@Param('productId') productId: string, @Param('optionId') optionId: string, @Body() dto: UpdateOptionDto) {
    return this.catalog.updateOption(productId, optionId, dto);
  }

  @Delete('products/:productId/options/:optionId')
  deleteOption(@Param('productId') productId: string, @Param('optionId') optionId: string) {
    return this.catalog.deleteOption(productId, optionId);
  }

  @Post('products/:productId/images')
  createImage(@Param('productId') productId: string, @Body() dto: CreateImageDto) {
    return this.catalog.createImage(productId, dto);
  }

  @Post('products/:productId/images/upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  uploadImage(@Param('productId') productId: string, @UploadedFile() file: { buffer: Buffer; mimetype: string }, @Body() body: { altText?: string; sortOrder?: string; variantId?: string }) {
    if (!file) throw new BadRequestException('Image file is required');
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, WEBP, and GIF images are allowed');
    }
    return this.catalog.uploadImage(productId, file, body);
  }

  @Get('products/:productId/images')
  listImages(@Param('productId') productId: string) {
    return this.catalog.listImages(productId);
  }

  @Patch('products/:productId/images/:imageId')
  updateImage(@Param('productId') productId: string, @Param('imageId') imageId: string, @Body() dto: UpdateImageDto) {
    return this.catalog.updateImage(productId, imageId, dto);
  }

  @Delete('products/:productId/images/:imageId')
  deleteImage(@Param('productId') productId: string, @Param('imageId') imageId: string) {
    return this.catalog.deleteImage(productId, imageId);
  }

  @Patch('products/:productId/images/:imageId/primary')
  setPrimaryImage(@Param('productId') productId: string, @Param('imageId') imageId: string) {
    return this.catalog.setPrimaryImage(productId, imageId);
  }
}
