import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  PRODUCT_CATALOG,
  configuredStripePriceIds,
  normalizeStripeProductPrice,
  productByCode,
  validateProductTracks
} from "../src/products.js";

const ENV = Object.freeze({
  STRIPE_SINGLE_PRICE_ID: "price_single_test",
  STRIPE_BUNDLE_PRICE_ID: "price_bundle_test"
});

function stripePrice(productCode, overrides = {}) {
  const product = productByCode(productCode);
  return {
    id: ENV[product.stripePriceEnv],
    active: true,
    type: "one_time",
    recurring: null,
    billing_scheme: "per_unit",
    custom_unit_amount: null,
    transform_quantity: null,
    unit_amount: product.amount,
    unit_amount_decimal: String(product.amount),
    currency: "usd",
    tax_behavior: "inclusive",
    ...overrides
  };
}

test("the versioned product catalogue fixes the approved USD package amounts", () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(PRODUCT_CATALOG).map(([code, product]) => [code, {
      amount: product.amount,
      currency: product.currency,
      count: product.assessmentCount,
      priceEnv: product.stripePriceEnv
    }])),
    {
      single_v1: { amount: 799, currency: "USD", count: 1, priceEnv: "STRIPE_SINGLE_PRICE_ID" },
      bundle_v1: { amount: 1299, currency: "USD", count: 2, priceEnv: "STRIPE_BUNDLE_PRICE_ID" }
    }
  );
  assert.equal(Object.isFrozen(PRODUCT_CATALOG), true);
  assert.equal(Object.isFrozen(PRODUCT_CATALOG.bundle_v1.requiredTracks), true);
});

test("Stripe Price environment mapping is complete, unique and well formed", () => {
  assert.deepEqual({ ...configuredStripePriceIds(ENV) }, {
    single_v1: "price_single_test",
    bundle_v1: "price_bundle_test"
  });
  assert.throws(
    () => configuredStripePriceIds({ STRIPE_SINGLE_PRICE_ID: "price_single_test" }),
    (error) => error?.code === "MISSING_STRIPE_PRICE_ID"
  );
  assert.throws(
    () => configuredStripePriceIds({ ...ENV, STRIPE_BUNDLE_PRICE_ID: "not-a-price" }),
    (error) => error?.code === "INVALID_STRIPE_PRICE_ID"
  );
  assert.throws(
    () => configuredStripePriceIds({ ...ENV, STRIPE_BUNDLE_PRICE_ID: ENV.STRIPE_SINGLE_PRICE_ID }),
    (error) => error?.code === "DUPLICATE_STRIPE_PRICE_ID"
  );
});

test("each exact fixed, inclusive, one-time Stripe Price normalizes", () => {
  for (const code of ["single_v1", "bundle_v1"]) {
    const normalized = normalizeStripeProductPrice(code, stripePrice(code), ENV);
    assert.equal(normalized.productCode, code);
    assert.equal(normalized.amount, PRODUCT_CATALOG[code].amount);
    assert.equal(normalized.currency, "USD");
    assert.equal(normalized.taxBehavior, "inclusive");
    assert.equal(Object.isFrozen(normalized), true);
  }
});

test("Stripe Price validation fails closed for every material mismatch", () => {
  const cases = [
    [{ active: false }, "INACTIVE_STRIPE_PRICE"],
    [{ type: "recurring", recurring: { interval: "month" } }, "STRIPE_PRICE_NOT_ONE_TIME"],
    [{ billing_scheme: "tiered" }, "STRIPE_PRICE_NOT_FIXED"],
    [{ custom_unit_amount: { minimum: 1 } }, "STRIPE_PRICE_NOT_FIXED"],
    [{ transform_quantity: { divide_by: 2, round: "up" } }, "STRIPE_PRICE_NOT_FIXED"],
    [{ unit_amount: null }, "STRIPE_PRICE_NOT_FIXED"],
    [{ unit_amount_decimal: "799.5" }, "STRIPE_PRICE_DECIMAL_MISMATCH"],
    [{ currency: "eur" }, "STRIPE_PRICE_CURRENCY_MISMATCH"],
    [{ tax_behavior: "exclusive" }, "STRIPE_PRICE_TAX_BEHAVIOR_MISMATCH"],
    [{ unit_amount: 800, unit_amount_decimal: "800" }, "STRIPE_PRICE_AMOUNT_MISMATCH"],
    [{ id: "price_someone_else" }, "STRIPE_PRICE_ID_MISMATCH"]
  ];
  for (const [override, code] of cases) {
    assert.throws(
      () => normalizeStripeProductPrice("single_v1", stripePrice("single_v1", override), ENV),
      (error) => error?.code === code,
      code
    );
  }
});

test("package track entitlements are exact and deterministic", () => {
  assert.deepEqual([...validateProductTracks("single_v1", ["emotional"])], ["emotional"]);
  assert.deepEqual(
    [...validateProductTracks("bundle_v1", ["emotional", "cognitive"])],
    ["cognitive", "emotional"]
  );
  assert.throws(
    () => validateProductTracks("bundle_v1", ["cognitive"]),
    (error) => error?.code === "PRODUCT_ASSESSMENT_COUNT_MISMATCH"
  );
  assert.throws(
    () => validateProductTracks("bundle_v1", ["cognitive", "cognitive"]),
    (error) => error?.code === "DUPLICATE_PRODUCT_TRACK"
  );
  assert.throws(
    () => validateProductTracks("single_v1", ["clinical"]),
    (error) => error?.code === "UNSUPPORTED_PRODUCT_TRACK"
  );
});

test("the additive migration contains normalized, replay-safe and idempotent structures", () => {
  const migration = fs.readFileSync(
    new URL("../src/db/migrations/002_products_legal_integration.sql", import.meta.url),
    "utf8"
  );
  assert.match(migration, /ADD COLUMN IF NOT EXISTS package_code/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS assessment_order_assessments/);
  assert.match(migration, /ON CONFLICT \(order_id, track\) DO NOTHING/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS assessment_consent_receipts/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS integration_nonces/);
  assert.match(migration, /PRIMARY KEY \(integration_code, nonce_hash\)/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS integration_audit_events/);
  assert.match(migration, /UNIQUE \(integration_code, event_id\)/);
  assert.match(migration, /metadata \?\| ARRAY/);
  const contentVersionMigration = fs.readFileSync(
    new URL("../src/db/migrations/003_consent_content_version.sql", import.meta.url),
    "utf8"
  );
  assert.match(contentVersionMigration, /ADD COLUMN IF NOT EXISTS content_version/);
  assert.match(contentVersionMigration, /statement_snapshot->>'contentVersion'/);
});
