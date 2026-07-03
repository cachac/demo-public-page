// Bun server serving the Aurora proposal page
// Background color can be set via env variable BG_COLOR (default #030712)
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bgColor = process.env.BG_COLOR || "#030712";
const pkgVersion = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf8"),
).version;
const version = process.env.VERSION || pkgVersion;

// Preload HTML and inject background color
let rawHtml = readFileSync(resolve(__dirname, "index.html"), "utf8");
rawHtml = rawHtml.replace("{{BG_COLOR}}", bgColor);

Bun.serve({
  port: Number(process.env.PORT) || 3000,
  async fetch(req) {
    const url = new URL(req.url);
      if (url.pathname === "/api/ping") {
        const payload = { message: "¡Conexión exitosa!", version };
        return new Response(JSON.stringify(payload), {
          headers: { "Content-Type": "application/json" },
        });
      } else if (url.pathname === "/api/version") {
        const payload = { version };
        return new Response(JSON.stringify(payload), {
          headers: { "Content-Type": "application/json" },
        });
      }
    // Serve index.html for any other request
    return new Response(rawHtml, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
});

console.log(
  `🚀 Server listening on http://localhost:${process.env.PORT || 3000}`,
);
