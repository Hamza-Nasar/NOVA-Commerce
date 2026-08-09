CREATE TABLE "recently_viewed_products" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "product_id" TEXT NOT NULL,
  "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "recently_viewed_products_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "recently_viewed_products_user_id_product_id_key" ON "recently_viewed_products"("user_id", "product_id");
CREATE INDEX "recently_viewed_products_user_id_viewed_at_idx" ON "recently_viewed_products"("user_id", "viewed_at");
ALTER TABLE "recently_viewed_products" ADD CONSTRAINT "recently_viewed_products_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recently_viewed_products" ADD CONSTRAINT "recently_viewed_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
