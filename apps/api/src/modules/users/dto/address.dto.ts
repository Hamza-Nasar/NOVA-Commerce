import { IsBoolean, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class AddressDto {
  @IsString()
  @MaxLength(60)
  title!: string;

  @IsString()
  @MaxLength(120)
  fullName!: string;

  @IsPhoneNumber()
  phone!: string;

  @IsString()
  @MaxLength(80)
  country!: string;

  @IsString()
  @MaxLength(80)
  province!: string;

  @IsString()
  @MaxLength(80)
  city!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @IsString()
  @MaxLength(180)
  addressLine1!: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  addressLine2?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
