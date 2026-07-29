ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'MANAGER';

ALTER TABLE "User" RENAME TO "users";
ALTER TABLE "users" RENAME COLUMN "firstName" TO "first_name";
ALTER TABLE "users" RENAME COLUMN "lastName" TO "last_name";
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "users"
  ADD COLUMN "uuid" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  ADD COLUMN "full_name" TEXT,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "password_hash" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "profile_image" TEXT,
  ADD COLUMN "email_verified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "phone_verified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "last_login" TIMESTAMP(3);

UPDATE "users"
SET "full_name" = trim(coalesce("first_name", '') || ' ' || coalesce("last_name", ''))
WHERE "full_name" IS NULL;

ALTER TABLE "users" ALTER COLUMN "password_hash" DROP DEFAULT;

CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

CREATE TABLE "user_addresses" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "full_name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "province" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "postal_code" TEXT,
  "address_line_1" TEXT NOT NULL,
  "address_line_2" TEXT,
  "is_default" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "user_addresses_user_id_idx" ON "user_addresses"("user_id");

ALTER TABLE "user_addresses"
  ADD CONSTRAINT "user_addresses_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "refresh_tokens" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "revoked_at" TIMESTAMP(3),
  "device" TEXT,
  "ip_address" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");
CREATE INDEX "refresh_tokens_token_hash_idx" ON "refresh_tokens"("token_hash");

ALTER TABLE "refresh_tokens"
  ADD CONSTRAINT "refresh_tokens_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
