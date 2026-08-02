export type CatalogStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
export type ProductType = 'SIMPLE' | 'VARIABLE';

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Category = {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  status: CatalogStatus;
  sortOrder: number;
};

export type Brand = {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  websiteUrl?: string | null;
  status: CatalogStatus;
};

export type ProductImage = {
  id: string;
  productId: string;
  variantId?: string | null;
  imageUrl: string;
  publicId?: string | null;
  altText?: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type ProductOptionValue = {
  id: string;
  uuid: string;
  optionId: string;
  value: string;
  sortOrder: number;
};

export type ProductOption = {
  id: string;
  uuid: string;
  productId: string;
  name: string;
  sortOrder: number;
  values: ProductOptionValue[];
};

export type ProductVariant = {
  id: string;
  uuid: string;
  productId: string;
  name: string;
  sku?: string | null;
  barcode?: string | null;
  price: string;
  compareAtPrice?: string | null;
  costPrice?: string | null;
  weight?: string | null;
  status: CatalogStatus;
  isDefault: boolean;
  images: ProductImage[];
  optionValues?: { optionValue: ProductOptionValue & { option: ProductOption } }[];
};

export type Product = {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  brand?: Brand | null;
  productType: ProductType;
  status: CatalogStatus;
  basePrice: string;
  compareAtPrice?: string | null;
  currency: string;
  featured: boolean;
  publishedAt?: string | null;
  categories: { category: Category }[];
  variants: ProductVariant[];
  options: ProductOption[];
  images: ProductImage[];
};

export type CatalogQuery = {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  brand?: string;
  featured?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
};
