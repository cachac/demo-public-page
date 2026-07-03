// Bun server serving the Aurora proposal page
// Background color can be set via env variable BG_COLOR (default #030712)
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import { hostname } from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bgColor = process.env.BG_COLOR || "#030712";
const pkgVersion = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf8"),
).version;
const version = process.env.VERSION || pkgVersion;

const isInsideContainer = () => {
  if (process.env.container) return true;
  try {
    if (existsSync("/.dockerenv") || existsSync("/.containerenv")) return true;
    const cgroup = readFileSync("/proc/self/cgroup", "utf8");
    return cgroup.includes("docker") || cgroup.includes("kubepods") || cgroup.includes("containerd");
  } catch {
    return false;
  }
};
const containerId = isInsideContainer() ? hostname() : "LOCAL";

// Preload HTML and inject background color and container ID
let rawHtml = readFileSync(resolve(__dirname, "index.html"), "utf8");
rawHtml = rawHtml.replace("{{BG_COLOR}}", bgColor);
rawHtml = rawHtml.replace("{{CONTAINER_ID}}", containerId);

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
