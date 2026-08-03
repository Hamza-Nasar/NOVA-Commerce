import { CatalogStatus, PrismaClient, ProductType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Phones, laptops, accessories, and connected devices.',
      status: CatalogStatus.ACTIVE,
      sortOrder: 1,
      metaTitle: 'Electronics - NOVA Commerce',
    },
  });

  const novaBrand = await prisma.brand.upsert({
    where: { slug: 'nova-labs' },
    update: {},
    create: {
      name: 'NOVA Labs',
      slug: 'nova-labs',
      description: 'Modern commerce demo brand for catalog verification.',
      logo: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=400&auto=format&fit=crop',
      websiteUrl: 'https://example.com',
      status: CatalogStatus.ACTIVE,
    },
  });

  const product = await prisma.product.upsert({
    where: { slug: 'nova-x1-headphones' },
    update: { status: CatalogStatus.ACTIVE, featured: true, publishedAt: new Date(), brandId: novaBrand.id },
    create: {
      name: 'NOVA X1 Wireless Headphones',
      slug: 'nova-x1-headphones',
      shortDescription: 'Wireless headphones with clean audio and all-day comfort.',
      description: 'A catalog-ready variable product used to verify images, variants, options, category browsing, brand browsing, pricing, featured products, and new arrivals.',
      brandId: novaBrand.id,
      productType: ProductType.VARIABLE,
      status: CatalogStatus.ACTIVE,
      basePrice: 129.99,
      compareAtPrice: 159.99,
      costPrice: 72.5,
      currency: 'USD',
      featured: true,
      publishedAt: new Date(),
      metaTitle: 'NOVA X1 Wireless Headphones',
      categories: { create: [{ categoryId: electronics.id }] },
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop',
            publicId: 'nova-demo/headphones-primary',
            altText: 'NOVA X1 Wireless Headphones',
            isPrimary: true,
            sortOrder: 1,
          },
        ],
      },
      options: {
        create: [
          { name: 'Color', sortOrder: 1, values: { create: [{ value: 'Black', sortOrder: 1 }, { value: 'Blue', sortOrder: 2 }] } },
          { name: 'Size', sortOrder: 2, values: { create: [{ value: 'Standard', sortOrder: 1 }, { value: 'Large', sortOrder: 2 }] } },
        ],
      },
    },
  });

  const existingVariant = await prisma.productVariant.findUnique({ where: { sku: 'NOVA-X1-BLK' } });
  if (!existingVariant) {
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: 'Black / Standard',
        sku: 'NOVA-X1-BLK',
        barcode: '100000000001',
        price: 129.99,
        compareAtPrice: 159.99,
        costPrice: 72.5,
        weight: 0.35,
        status: CatalogStatus.ACTIVE,
        isDefault: true,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
