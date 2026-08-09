import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/products`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/categories`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/brands`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/search`, changeFrequency: 'daily', priority: 0.6 },
  ];
}
