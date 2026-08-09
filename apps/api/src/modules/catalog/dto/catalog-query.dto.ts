import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CatalogStatus, ProductType } from '@prisma/client';

export class CatalogQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 12;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsEnum(CatalogStatus)
  status?: CatalogStatus;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsString()
  sort?: 'relevance' | 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' = 'newest';

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(ProductType)
  productType?: ProductType;
}
