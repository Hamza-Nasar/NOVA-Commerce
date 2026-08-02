import { IsBoolean, IsInt, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateImageDto {
  @IsUrl({ require_tld: false })
  imageUrl!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  publicId?: string;

  @IsOptional()
  @IsString()
  variantId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  altText?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class UpdateImageDto extends PartialType(CreateImageDto) {}
