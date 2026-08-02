import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { CatalogStatus } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBrandDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(120)
  name!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @MaxLength(140)
  slug!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  logo?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  websiteUrl?: string;

  @IsOptional()
  @IsEnum(CatalogStatus)
  status?: CatalogStatus;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
