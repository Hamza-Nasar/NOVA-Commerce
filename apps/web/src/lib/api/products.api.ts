import { catalogFetch, toQuery } from './catalog-client';
import { CatalogQuery, Paginated, Product } from '@/types/catalog';

export const productsApi = {
  list: (query: CatalogQuery = {}) => catalogFetch<Paginated<Product>>(`/products${toQuery(query)}`),
  featured: (query: CatalogQuery = {}) => catalogFetch<Paginated<Product>>(`/products/featured${toQuery(query)}`),
  newArrivals: (query: CatalogQuery = {}) => catalogFetch<Paginated<Product>>(`/products/new-arrivals${toQuery(query)}`),
  bySlug: (slug: string) => catalogFetch<Product>(`/products/${slug}`),
};
