import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 3000);

app.disable("x-powered-by");
app.use((_, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});
app.get("/health", (_, res) => res.json({ ok: true, service: "cogniva-compass", version: "1.0.0" }));
app.use(express.static(path.join(root, "public"), { extensions: ["html"], maxAge: "1h" }));
app.get("*path", (_, res) => res.sendFile(path.join(root, "public", "index.html")));
app.listen(port, () => console.log(`Cogniva Compass listening on ${port}`));
