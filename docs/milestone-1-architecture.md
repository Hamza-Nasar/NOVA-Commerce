# Milestone 1 architecture

## Urdu overview

NOVA Commerce ایک **monorepo** ہے: ایک repository میں `apps/web` (customer-facing Next.js app) اور `apps/api` (NestJS backend) رہتے ہیں۔ اس سے types، shared UI، اور deployment standards بعد میں ایک ہی جگہ سے manage ہوں گے۔

Request flow یہ ہے:

`Browser → Next.js storefront → NestJS /api/v1 → Prisma → PostgreSQL`

Redis PostgreSQL کا متبادل نہیں ہے۔ PostgreSQL اصل transactional data رکھتا ہے؛ Redis fast, temporary workloads کے لیے ہے، مثلاً cache، rate limiting، session-like state، اور BullMQ jobs۔ BullMQ وہ jobs background میں چلائے گا جن کے لیے user کو request میں wait نہیں کرنا چاہیے، مثلاً order email یا stock alert۔

## Why this is production-ready groundwork

- **Config validation:** API start ہوتے ہی ضروری URLs اور ports check ہوتے ہیں، اس لیے غلط deployment configuration جلد fail ہوتی ہے۔
- **Database migrations:** `prisma/migrations` میں schema history محفوظ رہتی ہے؛ production میں `prisma migrate deploy` استعمال کریں۔
- **Module boundaries:** ہر future domain، جیسے `catalog`, `cart`, `orders` اور `auth`، اپنی module directory میں controller/service/DTOs کے ساتھ رہے گا۔
- **Consistent APIs:** success responses ایک envelope میں اور failures global exception filter سے آتے ہیں، جس سے frontend predictable رہتا ہے۔
- **Security baseline:** Helmet، restricted CORS origin، validation whitelist، اور environment-based configuration شامل ہیں۔

## What comes in later milestones

یہ foundation جان بوجھ کر Stripe checkout، product CRUD، JWT endpoints اور admin screens implement نہیں کرتا۔ پہلے ان domains کے database models، policies، auditability، tests، اور integrations ایک ایک کر کے شامل کرنا بہتر ہے۔
