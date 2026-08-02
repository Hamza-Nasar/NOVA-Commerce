import { catalogFetch, toQuery } from './catalog-client';
import { CatalogQuery, Category, Paginated, Product } from '@/types/catalog';

export const categoriesApi = {
  list: (query: CatalogQuery = {}) => catalogFetch<Paginated<Category>>(`/categories${toQuery(query)}`),
  bySlug: (slug: string) => catalogFetch<Category>(`/categories/${slug}`),
  products: (slug: string, query: CatalogQuery = {}) => catalogFetch<Paginated<Product>>(`/categories/${slug}/products${toQuery(query)}`),
};
