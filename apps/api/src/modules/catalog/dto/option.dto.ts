import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class OptionValueInputDto {
  @IsString()
  @MaxLength(120)
  value!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class CreateOptionDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionValueInputDto)
  values?: OptionValueInputDto[];
}

export class UpdateOptionDto extends PartialType(CreateOptionDto) {}
