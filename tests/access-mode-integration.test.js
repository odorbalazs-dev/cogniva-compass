import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function availablePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

async function startIsolatedServer(mode) {
  const port = await availablePort();
  const environment = {
    ...process.env,
    PORT: String(port),
    ASSESSMENT_ACCESS_MODE: mode,
    DATABASE_URL: "",
    STRIPE_SECRET_KEY: "",
    STRIPE_WEBHOOK_SECRET: "",
    STRIPE_SINGLE_PRICE_ID: "",
    STRIPE_BUNDLE_PRICE_ID: "",
    RESEND_API_KEY: "",
    RESEND_WEBHOOK_SECRET: "",
    EMAIL_FROM: "",
    OPENAI_REPORT_ENABLED: "false",
    OPENAI_API_KEY: "",
    LEGAL_CONSENT_SECRET: ""
  };
  const child = spawn(process.execPath, ["src/server.js"], {
    cwd: root,
    env: environment,
    stdio: ["ignore", "pipe", "pipe"]
  });
  let diagnostic = "";
  child.stdout.on("data", (chunk) => { diagnostic += chunk.toString(); });
  child.stderr.on("data", (chunk) => { diagnostic += chunk.toString(); });
  const origin = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Isolated server exited early: ${diagnostic}`);
    try {
      const response = await fetch(`${origin}/health`, { cache: "no-store" });
      if (response.ok) return { child, origin };
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  child.kill();
  throw new Error(`Isolated server did not become ready: ${diagnostic}`);
}

async function stopIsolatedServer(child) {
  if (child.exitCode !== null) return;
  child.kill();
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 2000))
  ]);
}

test("preview permits only local assessment access and rejects server-side writes", async () => {
  const { child, origin } = await startIsolatedServer("preview");
  try {
    const health = await (await fetch(`${origin}/health`)).json();
    assert.equal(health.assessmentMode, "preview");
    assert.equal(health.assessmentReady, true);
    assert.equal(health.legalConsentReady, false);
    assert.equal(health.commerceConfigured, false);

    const legal = await (await fetch(`${origin}/api/legal/config`)).json();
    assert.equal(legal.assessmentMode, "preview");
    assert.equal(legal.assessmentReady, true);
    assert.equal(legal.legalReady, false);
    assert.equal(legal.legalStorageReady, false);

    const commerce = await (await fetch(`${origin}/api/config`)).json();
    assert.equal(commerce.commerceReady, false);
    assert.deepEqual(commerce.products, []);
    assert.equal(commerce.aiReportAvailable, false);

    const consent = await fetch(`${origin}/api/legal/consent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}"
    });
    assert.equal(consent.status, 503);

    const checkout = await fetch(`${origin}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}"
    });
    assert.equal(checkout.status, 503);
    assert.equal((await checkout.json()).code, "COMMERCE_NOT_READY");
  } finally {
    await stopIsolatedServer(child);
  }
});

test("disabled and incomplete production modes remain fail-closed", async () => {
  for (const mode of ["disabled", "production"]) {
    const { child, origin } = await startIsolatedServer(mode);
    try {
      const health = await (await fetch(`${origin}/health`)).json();
      assert.equal(health.assessmentMode, mode);
      assert.equal(health.assessmentReady, false);
      assert.equal(health.legalConsentReady, false);
      assert.equal(health.commerceConfigured, false);
    } finally {
      await stopIsolatedServer(child);
    }
  }
});
