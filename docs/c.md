# NOVA Commerce — Milestone 5 Implementation Audit

## Scope

Milestone 5 covers cart, guest cart, authenticated cart, wishlist, backend-controlled pricing, coupons/promotions foundation, guest-cart merge, and the `/cart` and `/wishlist` frontend pages. Checkout, payments, orders, inventory, shipping, tax, reviews and analytics are explicitly out of scope.

## Implemented in this pass

- Prisma models and migration foundation for Cart, CartItem, Wishlist, WishlistItem, Promotion and Coupon.
- Cart status and promotion type enums.
- Guest cart retrieval through `x-guest-session-id`.
- Cart read, add item, update quantity, remove item, clear cart and summary endpoints.
- Product, publication, active-status, variant and quantity validation.
- Backend price lookup from product/variant records; frontend price is not trusted.
- Coupon apply/remove foundation with status, dates, usage limit and minimum-order validation.
- Wishlist authenticated read/add/remove endpoints with duplicate prevention.
- Frontend cart and wishlist pages plus cart/wishlist API clients.
- App module registration and API/web typecheck validation.

## Verification

- API TypeScript typecheck: PASS.
- API Nest compilation: PASS.
- Web TypeScript typecheck: PASS.
- Existing Milestone 4 runtime smoke tests remain passing before this change.

## Remaining work before strict approval

- Complete and test guest-cart merge endpoint and quantity conflict handling.
- Add wishlist move-to-cart endpoint and UI action.
- Integrate add-to-cart and wishlist buttons into product cards/detail and variant selector.
- Add reusable cart drawer, quantity selector, coupon form and loading/error states.
- Add promotion/coupon administration or seed fixtures as required by the final product workflow.
- Run Prisma client generation and migration deployment on a clean non-OneDrive environment, then execute end-to-end API tests against the new tables.
- Add dedicated automated/manual tests for price changes, inactive products/variants, coupon expiry/limits and unauthorized wishlist access.

## Status

**Not yet approved as complete.** The database and core cart/wishlist foundation is present, but the items listed under remaining work must be completed and manually verified before Milestone 5 can be marked production-ready.
