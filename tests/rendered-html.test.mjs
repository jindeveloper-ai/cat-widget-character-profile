import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Narin character profile metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Narin — The Crown Prince Who Hates Being Left on Read<\/title>/i);
  assert.match(html, /property="og:image"/i);
  assert.match(html, /content="http:\/\/localhost(?::3000)?\/og\.png"/i);
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
