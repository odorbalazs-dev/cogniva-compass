const TRACKS = Object.freeze(["cognitive", "emotional"]);

function freezeProduct(product) {
  return Object.freeze({
    ...product,
    allowedTracks: Object.freeze([...product.allowedTracks]),
    requiredTracks: Object.freeze([...product.requiredTracks])
  });
}

export const PRODUCT_CATALOG = Object.freeze({
  single_v1: freezeProduct({
    code: "single_v1",
    assessmentCount: 1,
    allowedTracks: TRACKS,
    requiredTracks: [],
    amount: 799,
    currency: "USD",
    taxBehavior: "inclusive",
    stripePriceEnv: "STRIPE_SINGLE_PRICE_ID"
  }),
  bundle_v1: freezeProduct({
    code: "bundle_v1",
    assessmentCount: 2,
    allowedTracks: TRACKS,
    requiredTracks: TRACKS,
    amount: 1299,
    currency: "USD",
    taxBehavior: "inclusive",
    stripePriceEnv: "STRIPE_BUNDLE_PRICE_ID"
  })
});

export const PRODUCT_CODES = Object.freeze(Object.keys(PRODUCT_CATALOG));

export class ProductSelectionError extends Error {
  constructor(message, code = "INVALID_PRODUCT_SELECTION") {
    super(message);
    this.name = "ProductSelectionError";
    this.code = code;
    this.status = 400;
  }
}

export class ProductConfigurationError extends Error {
  constructor(message, code = "INVALID_PRODUCT_CONFIGURATION") {
    super(message);
    this.name = "ProductConfigurationError";
    this.code = code;
  }
}

export function productByCode(value) {
  const code = String(value || "").trim().toLowerCase();
  const product = PRODUCT_CATALOG[code];
  if (!product) throw new ProductSelectionError("Unsupported product package.", "UNSUPPORTED_PRODUCT");
  return product;
}

function cleanPriceId(value) {
  return String(value || "").trim();
}

export function configuredStripePriceIds(environment = process.env) {
  const configured = {};
  for (const product of Object.values(PRODUCT_CATALOG)) {
    const priceId = cleanPriceId(environment?.[product.stripePriceEnv]);
    if (!priceId) {
      throw new ProductConfigurationError(
        `${product.stripePriceEnv} is not configured.`,
        "MISSING_STRIPE_PRICE_ID"
      );
    }
    if (!/^price_[A-Za-z0-9_]+$/.test(priceId)) {
      throw new ProductConfigurationError(
        `${product.stripePriceEnv} is not a valid Stripe Price identifier.`,
        "INVALID_STRIPE_PRICE_ID"
      );
    }
    configured[product.code] = priceId;
  }
  if (new Set(Object.values(configured)).size !== PRODUCT_CODES.length) {
    throw new ProductConfigurationError(
      "Each product package must use a different Stripe Price.",
      "DUPLICATE_STRIPE_PRICE_ID"
    );
  }
  return Object.freeze(configured);
}

export function stripePriceIdForProduct(productCode, environment = process.env) {
  const product = productByCode(productCode);
  return configuredStripePriceIds(environment)[product.code];
}

function priceError(message, code) {
  throw new ProductConfigurationError(message, code);
}

export function normalizeStripeProductPrice(productCode, price, environment = process.env) {
  const product = productByCode(productCode);
  const configuredPriceId = stripePriceIdForProduct(product.code, environment);

  if (!price || typeof price !== "object") {
    priceError("Stripe returned no Price object.", "INVALID_STRIPE_PRICE");
  }
  if (price.id !== configuredPriceId) {
    priceError("Stripe returned a different Price than the configured package Price.", "STRIPE_PRICE_ID_MISMATCH");
  }
  if (price.active !== true) {
    priceError("The configured Stripe Price is inactive.", "INACTIVE_STRIPE_PRICE");
  }
  if (price.type !== "one_time" || price.recurring) {
    priceError("The configured Stripe Price must be one-time.", "STRIPE_PRICE_NOT_ONE_TIME");
  }
  if (
    price.billing_scheme !== "per_unit" ||
    price.custom_unit_amount != null ||
    price.transform_quantity != null ||
    !Number.isInteger(price.unit_amount) ||
    price.unit_amount < 1
  ) {
    priceError("The configured Stripe Price must be a fixed per-unit amount.", "STRIPE_PRICE_NOT_FIXED");
  }
  if (
    price.unit_amount_decimal != null &&
    String(price.unit_amount_decimal) !== String(price.unit_amount)
  ) {
    priceError("The Stripe Price decimal amount does not match its integer amount.", "STRIPE_PRICE_DECIMAL_MISMATCH");
  }
  if (String(price.currency || "").toUpperCase() !== product.currency) {
    priceError(`The ${product.code} Stripe Price must use ${product.currency}.`, "STRIPE_PRICE_CURRENCY_MISMATCH");
  }
  if (price.tax_behavior !== product.taxBehavior) {
    priceError("The configured Stripe Price must include tax.", "STRIPE_PRICE_TAX_BEHAVIOR_MISMATCH");
  }
  if (price.unit_amount !== product.amount) {
    priceError(
      `The ${product.code} Stripe Price must be exactly ${product.amount} minor units.`,
      "STRIPE_PRICE_AMOUNT_MISMATCH"
    );
  }

  return Object.freeze({
    productCode: product.code,
    priceId: configuredPriceId,
    amount: product.amount,
    currency: product.currency,
    taxBehavior: product.taxBehavior,
    assessmentCount: product.assessmentCount,
    requiredTracks: product.requiredTracks
  });
}

export function validateProductTracks(productCode, values) {
  const product = productByCode(productCode);
  if (!Array.isArray(values) || values.length !== product.assessmentCount) {
    throw new ProductSelectionError(
      `The ${product.code} package requires exactly ${product.assessmentCount} assessment(s).`,
      "PRODUCT_ASSESSMENT_COUNT_MISMATCH"
    );
  }
  const tracks = values.map((value) => String(value || "").trim().toLowerCase());
  if (tracks.some((track) => !product.allowedTracks.includes(track))) {
    throw new ProductSelectionError("The package contains an unsupported assessment track.", "UNSUPPORTED_PRODUCT_TRACK");
  }
  if (new Set(tracks).size !== tracks.length) {
    throw new ProductSelectionError("The package contains a duplicate assessment track.", "DUPLICATE_PRODUCT_TRACK");
  }
  if (product.requiredTracks.some((track) => !tracks.includes(track))) {
    throw new ProductSelectionError("The package is missing a required assessment track.", "MISSING_REQUIRED_PRODUCT_TRACK");
  }
  return Object.freeze([...tracks].sort((left, right) => TRACKS.indexOf(left) - TRACKS.indexOf(right)));
}
