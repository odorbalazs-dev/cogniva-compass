import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const INTERNAL_AUTH_VERSION = "cogniva-hmac-v1";
export const INTERNAL_RESPONSE_AUTH_VERSION = "cogniva-hmac-response-v1";
export const INTERNAL_AUTH_HEADERS = Object.freeze({
  version: "x-cogniva-auth-version",
  keyId: "x-cogniva-key-id",
  timestamp: "x-cogniva-timestamp",
  nonce: "x-cogniva-nonce",
  signature: "x-cogniva-signature"
});
export const INTERNAL_RESPONSE_AUTH_HEADERS = Object.freeze({
  version: "x-cogniva-response-auth-version",
  keyId: "x-cogniva-response-key-id",
  timestamp: "x-cogniva-response-timestamp",
  requestNonce: "x-cogniva-response-request-nonce",
  bodyHash: "x-cogniva-response-body-sha256",
  signature: "x-cogniva-response-signature"
});

const NONCE_PATTERN = /^[A-Za-z0-9_-]{16,128}$/u;
const KEY_ID_PATTERN = /^[A-Za-z0-9._-]{1,64}$/u;

export class InternalAuthError extends Error {
  constructor(code, status = 401) {
    super(code);
    this.name = "InternalAuthError";
    this.code = code;
    this.status = status;
  }
}

function bytes(value, label, { allowEmpty = true } = {}) {
  let result;
  if (value === undefined || value === null) result = Buffer.alloc(0);
  else if (Buffer.isBuffer(value)) result = value;
  else if (value instanceof Uint8Array) result = Buffer.from(value);
  else if (typeof value === "string") result = Buffer.from(value, "utf8");
  else throw new TypeError(`${label} must be a string, Buffer, or Uint8Array.`);
  if (!allowEmpty && result.length === 0) throw new TypeError(`${label} must not be empty.`);
  return result;
}

function secretBytes(secret) {
  const result = bytes(secret, "secret", { allowEmpty: false });
  if (result.length < 32) {
    throw new InternalAuthError("INTERNAL_AUTH_SECRET_TOO_SHORT", 500);
  }
  return result;
}

function parseTimestamp(value) {
  const raw = typeof value === "number" ? String(value) : String(value || "");
  if (!/^\d{10,13}$/u.test(raw)) {
    throw new InternalAuthError("INVALID_AUTH_TIMESTAMP");
  }
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new InternalAuthError("INVALID_AUTH_TIMESTAMP");
  }
  return parsed > 9_999_999_999 ? Math.floor(parsed / 1000) : parsed;
}

function normalizeNonce(value) {
  const nonce = String(value || "");
  if (!NONCE_PATTERN.test(nonce)) throw new InternalAuthError("INVALID_AUTH_NONCE");
  return nonce;
}

function normalizeKeyId(value) {
  const keyId = String(value || "");
  if (!KEY_ID_PATTERN.test(keyId)) throw new InternalAuthError("INVALID_AUTH_KEY_ID");
  return keyId;
}

function normalizeMethod(value) {
  const method = String(value || "").toUpperCase();
  if (!/^[A-Z]{3,12}$/u.test(method)) throw new InternalAuthError("INVALID_AUTH_METHOD");
  return method;
}

function normalizeRequestTarget(value) {
  const target = String(value || "");
  if (!target.startsWith("/") || target.length > 2048 || /[\r\n]/u.test(target)) {
    throw new InternalAuthError("INVALID_AUTH_TARGET");
  }
  return target;
}

function nowMilliseconds(now) {
  const value = typeof now === "function" ? now() : now;
  const numeric = value instanceof Date ? value.getTime() : Number(value ?? Date.now());
  if (!Number.isFinite(numeric)) throw new TypeError("now must resolve to a valid time.");
  return numeric;
}

function signatureBytes(value) {
  const signature = String(value || "");
  if (!/^[A-Za-z0-9_-]{43}$/u.test(signature)) {
    throw new InternalAuthError("INVALID_AUTH_SIGNATURE");
  }
  return Buffer.from(signature, "base64url");
}

export function hashInternalBody(body = "") {
  return createHash("sha256").update(bytes(body, "body")).digest("hex");
}

export function canonicalizeInternalRequest({
  keyId,
  timestamp,
  nonce,
  method,
  requestTarget,
  body = ""
}) {
  const normalized = Object.freeze({
    keyId: normalizeKeyId(keyId),
    timestamp: parseTimestamp(timestamp),
    nonce: normalizeNonce(nonce),
    method: normalizeMethod(method),
    requestTarget: normalizeRequestTarget(requestTarget),
    bodyHash: hashInternalBody(body)
  });
  return {
    ...normalized,
    canonical: [
      INTERNAL_AUTH_VERSION,
      normalized.keyId,
      String(normalized.timestamp),
      normalized.nonce,
      normalized.method,
      normalized.requestTarget,
      normalized.bodyHash
    ].join("\n")
  };
}

export function signInternalRequest(options) {
  const normalized = canonicalizeInternalRequest(options);
  const signature = createHmac("sha256", secretBytes(options.secret))
    .update(normalized.canonical, "utf8")
    .digest("base64url");
  return Object.freeze({
    keyId: normalized.keyId,
    timestamp: normalized.timestamp,
    nonce: normalized.nonce,
    bodyHash: normalized.bodyHash,
    signature,
    headers: Object.freeze({
      [INTERNAL_AUTH_HEADERS.version]: INTERNAL_AUTH_VERSION,
      [INTERNAL_AUTH_HEADERS.keyId]: normalized.keyId,
      [INTERNAL_AUTH_HEADERS.timestamp]: String(normalized.timestamp),
      [INTERNAL_AUTH_HEADERS.nonce]: normalized.nonce,
      [INTERNAL_AUTH_HEADERS.signature]: signature
    })
  });
}

export function signInternalResponse({
  secret,
  keyId,
  timestamp,
  requestNonce,
  statusCode,
  body = ""
}) {
  const normalizedKeyId = normalizeKeyId(keyId);
  const normalizedTimestamp = parseTimestamp(timestamp);
  const normalizedNonce = normalizeNonce(requestNonce);
  const normalizedStatus = Number(statusCode);
  if (!Number.isInteger(normalizedStatus) || normalizedStatus < 100 || normalizedStatus > 599) {
    throw new InternalAuthError("INVALID_RESPONSE_STATUS", 500);
  }
  const bodyHash = hashInternalBody(body);
  const canonical = [
    INTERNAL_RESPONSE_AUTH_VERSION,
    normalizedKeyId,
    String(normalizedTimestamp),
    normalizedNonce,
    String(normalizedStatus),
    bodyHash
  ].join("\n");
  const signature = createHmac("sha256", secretBytes(secret))
    .update(canonical, "utf8")
    .digest("base64url");
  return Object.freeze({
    keyId: normalizedKeyId,
    timestamp: normalizedTimestamp,
    requestNonce: normalizedNonce,
    statusCode: normalizedStatus,
    bodyHash,
    signature,
    headers: Object.freeze({
      [INTERNAL_RESPONSE_AUTH_HEADERS.version]: INTERNAL_RESPONSE_AUTH_VERSION,
      [INTERNAL_RESPONSE_AUTH_HEADERS.keyId]: normalizedKeyId,
      [INTERNAL_RESPONSE_AUTH_HEADERS.timestamp]: String(normalizedTimestamp),
      [INTERNAL_RESPONSE_AUTH_HEADERS.requestNonce]: normalizedNonce,
      [INTERNAL_RESPONSE_AUTH_HEADERS.bodyHash]: bodyHash,
      [INTERNAL_RESPONSE_AUTH_HEADERS.signature]: signature
    })
  });
}

export async function verifyInternalRequest({
  secret,
  keyId,
  timestamp,
  nonce,
  signature,
  method,
  requestTarget,
  body = "",
  now = Date.now,
  maxAgeSeconds = 60,
  consumeNonce
}) {
  const ageLimit = Number(maxAgeSeconds);
  if (!Number.isInteger(ageLimit) || ageLimit < 1 || ageLimit > 300) {
    throw new InternalAuthError("INVALID_AUTH_WINDOW", 500);
  }
  if (typeof consumeNonce !== "function") {
    throw new InternalAuthError("REPLAY_PROTECTION_NOT_CONFIGURED", 500);
  }

  const normalized = canonicalizeInternalRequest({
    keyId,
    timestamp,
    nonce,
    method,
    requestTarget,
    body
  });
  const currentSeconds = Math.floor(nowMilliseconds(now) / 1000);
  if (Math.abs(currentSeconds - normalized.timestamp) > ageLimit) {
    throw new InternalAuthError("AUTH_TIMESTAMP_OUTSIDE_WINDOW");
  }

  const expected = createHmac("sha256", secretBytes(secret))
    .update(normalized.canonical, "utf8")
    .digest();
  const supplied = signatureBytes(signature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    throw new InternalAuthError("INVALID_AUTH_SIGNATURE");
  }

  let accepted;
  try {
    accepted = await consumeNonce(Object.freeze({
      keyId: normalized.keyId,
      nonce: normalized.nonce,
      timestamp: normalized.timestamp,
      bodyHash: normalized.bodyHash,
      method: normalized.method,
      requestTarget: normalized.requestTarget,
      expiresAtEpochSeconds: normalized.timestamp + ageLimit
    }));
  } catch {
    throw new InternalAuthError("REPLAY_CHECK_FAILED", 503);
  }
  if (accepted !== true) throw new InternalAuthError("AUTH_REPLAY_DETECTED");

  return Object.freeze({
    authenticated: true,
    keyId: normalized.keyId,
    nonce: normalized.nonce,
    timestamp: normalized.timestamp,
    bodyHash: normalized.bodyHash
  });
}
