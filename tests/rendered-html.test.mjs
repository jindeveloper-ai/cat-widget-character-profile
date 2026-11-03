import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import test, { after, before } from "node:test";

let worker;
let origin;

before(async () => {
  const socket = createServer();
  socket.listen(0, "127.0.0.1");
  await once(socket, "listening");
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  origin = `http://127.0.0.1:${port}`;

  // Execute the built Worker in workerd, including cloudflare: runtime imports.
  // The local emulator never deploys to or writes to the hosted Site.
  worker = spawn(
    process.execPath,
    [
      fileURLToPath(new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url)),
      "dev", "--config", "dist/server/wrangler.json", "--local",
      "--ip", "127.0.0.1", "--port", String(port), "--log-level", "error",
    ],
    {
      cwd: fileURLToPath(new URL("../", import.meta.url)),
      env: { ...process.env, CLOUDFLARE_SEND_METRICS: "false", WRANGLER_WRITE_LOGS: "false" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let diagnostic = "";
  const collect = (chunk) => { diagnostic = (diagnostic + chunk.toString()).slice(-5000); };
  worker.stdout.on("data", collect);
  worker.stderr.on("data", collect);
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (worker.exitCode !== null) throw new Error(`Worker exited: ${diagnostic}`);
    try {
      const response = await fetch(origin, { signal: AbortSignal.timeout(1000) });
      if (response.ok) return;
    } catch { /* The emulator is not listening yet. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Local Worker did not become ready: ${diagnostic}`);
});

after(async () => {
  if (!worker || worker.exitCode !== null) return;
  worker.kill("SIGTERM");
  await once(worker, "exit");
});

async function render() {
  return fetch(origin, {
    headers: { accept: "text/html", "x-forwarded-proto": "http" },
  });
}

test("server-renders the Narin character profile metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Narin — The Crown Prince Who Hates Being Left on Read<\/title>/i);
  assert.match(html, /property="og:image"/i);
  const ogImage = /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i.exec(html);
  assert.ok(ogImage, "the rendered page must include the Open Graph image URL");
  const imageUrl = new URL(ogImage[1]);
  assert.equal(imageUrl.origin, origin);
  assert.equal(imageUrl.pathname, "/og.png");
  assert.match(html, /황태자가.*무너졌다/s);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("server-renders the accessible messenger shell", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /<main class="site-shell lang-ko">/);
  assert.match(html, /aria-label="나린 캐릭터 메신저"/);
  assert.match(html, /aria-label="빠른 답장"/);
  assert.match(html, /aria-label="주요 메뉴"/);
  assert.match(html, /src="\/images\/hyeon-profile-animated\.gif"/);
});
