import { catalogFetch, toQuery } from './catalog-client';
import { Brand, CatalogQuery, Paginated, Product } from '@/types/catalog';

export const brandsApi = {
  list: (query: CatalogQuery = {}) => catalogFetch<Paginated<Brand>>(`/brands${toQuery(query)}`),
  bySlug: (slug: string) => catalogFetch<Brand>(`/brands/${slug}`),
  products: (slug: string, query: CatalogQuery = {}) => catalogFetch<Paginated<Product>>(`/brands/${slug}/products${toQuery(query)}`),
};
