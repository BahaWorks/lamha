// Lamha build: fetch feeds -> filter -> cluster -> render static bilingual site into dist/.
// Usage: node src/build.mjs            (live fetch)
//        node src/build.mjs --offline  (build from fixtures/sample-items.json, no network)
//        node src/build.mjs --check    (report which feeds work, no build)
//        node src/build.mjs --render   (no fetching: render dist/ from data/items.json, used by Cloudflare Pages)
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fetchSource, pool } from "./feeds.mjs";
import { isSudan, teamsOf, cluster } from "./classify.mjs";
import { aiEnabled, translate, dailyBrief } from "./ai.mjs";
import * as R from "./render.mjs";
import { PAGES, pagePath } from "./i18n.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const P = (...p) => path.join(ROOT, ...p);
const readJson = async (f, d) => { try { return JSON.parse(await fs.readFile(P(f), "utf8")); } catch { return d; } };
const writeJson = (f, v) => fs.writeFile(P(f), JSON.stringify(v, null, 1));
const args = new Set(process.argv.slice(2));
const OFFLINE = args.has("--offline"), CHECK = args.has("--check"), RENDER = args.has("--render");

const cfg = await readJson("config/site.json");
const { sources } = await readJson("config/sources.json");
const SRC = Object.fromEntries(sources.map(s => [s.id, s]));
const hasArabic = s => /[؀-ۿ]/.test(s);
const idOf = url => crypto.createHash("sha1").update(url).digest("hex").slice(0, 12);

const JUNK = /\barchives?\b|page \d+ of \d+|public schedule|^[0-9a-f]{8,}\b|^(home|search|contact)$/i;
function keep(src, it) {
  const text = `${it.title} ${it.summary || ""}`;
  if (JUNK.test(it.title) || it.title.length < 12) return false;
  if (src.filter === "sudan" && !isSudan(text)) return false;
  if (src.filter === "teams" && !teamsOf(it.title).length) return false;
  return true;
}

/* ---------- 1. collect ---------- */
let fresh = [];
let lastUpdate = Date.now();
if (OFFLINE) {
  lastUpdate = Date.parse("2026-11-09T21:08:00Z");
  fresh = (await readJson("fixtures/sample-items.json", [])).map(i => ({ ...i, ts: Date.parse(i.date) }));
} else if (RENDER) {
  lastUpdate = (await readJson("data/meta.json", {})).lastUpdate || Date.now();
} else {
  const results = await pool(sources, 8, async s => ({ s, r: await fetchSource(s, i => keep(s, i)) }));
  if (CHECK) {
    for (const { s, r } of results) {
      const kept = r.items.length;
      console.log(`${r.used ? "OK " : "-- "} ${s.id.padEnd(12)} ${String(r.items.length).padStart(3)} items, ${String(kept).padStart(3)} kept  ${r.used ? r.url : (r.errors || []).join(" | ")}`);
    }
    process.exit(0);
  }
  for (const { s, r } of results) {
    const items = r.items.map(i => {
      const ts = Date.parse(i.date); return { ...i, ts: Number.isFinite(ts) ? Math.min(ts, lastUpdate) : lastUpdate };
    }).sort((a, b) => b.ts - a.ts).slice(0, cfg.maxItemsPerSource);
    for (const i of items) fresh.push({ src: s.id, title: i.title, url: i.url, ts: i.ts, summary: i.summary });
    if (!r.used) console.warn(`[warn] ${s.id}: ${(r.errors || []).join(" | ")}`);
  }
}

/* ---------- 2. normalise + merge history ---------- */
const history = OFFLINE ? [] : await readJson("data/items.json", []);
const byId = new Map(history.map(i => [i.id, i]));
for (const f of fresh) {
  const s = SRC[f.src]; if (!s) continue;
  const lang = s.cat === "en" ? "en" : s.cat === "ar" ? "ar" : (hasArabic(f.title) ? "ar" : "en");
  const id = idOf(f.url);
  const prev = byId.get(id);
  byId.set(id, { id, src: f.src, cat: s.cat, lang, title: f.title, url: f.url, ts: prev?.ts ?? f.ts, tr: prev?.tr || f.tr, summary: f.summary });
}
const minTs = lastUpdate - cfg.keepDays * 864e5;
let all = [...byId.values()].filter(i => i.ts >= minTs || OFFLINE);

/* ---------- 3. optional AI translations ---------- */
const useAI = aiEnabled(cfg) && !OFFLINE && !RENDER;
const trCache = await readJson("data/translations.json", {});
for (const i of all) if (!i.tr && trCache[i.id]) i.tr = trCache[i.id];
if (useAI && cfg.ai.translateOfficialAndSports) {
  const need = all.filter(i => (i.cat === "off" || i.cat === "sport") && !i.tr).map(i => ({ id: i.id, lang: i.lang, title: i.title }));
  try { const got = await translate(cfg, need); for (const i of all) if (got[i.id]) { i.tr = got[i.id]; trCache[i.id] = got[i.id]; } }
  catch (e) { console.warn("[warn] translation skipped:", e.message); }
}

/* ---------- 4. shape sections ---------- */
const showMin = lastUpdate - cfg.showHours * 3600e3;
const clusters = {};
for (const L of ["en", "ar"]) clusters[L] = cluster(all.filter(i => i.cat === L && (i.ts >= showMin || OFFLINE)));

const pinned = await readJson("data/official-pinned.json", []);
const offFeed = all.filter(i => i.cat === "off");
const seenUrl = new Set(offFeed.map(i => i.url));
const official = [...offFeed, ...pinned.filter(p => !seenUrl.has(p.url)).map(p => ({ ...p, id: idOf(p.url), title: p.tr[p.lang], ts: Date.parse(p.date) }))]
  .sort((a, b) => b.ts - a.ts).slice(0, 40);

const sportItems = all.filter(i => i.cat === "sport" && (i.ts >= lastUpdate - 7 * 864e5 || OFFLINE));
const sports = cluster(sportItems, 0.5, { ignoreLang: true }).map(c => {
  const teams = [...new Set(c.members.flatMap(m => teamsOf(`${m.title} ${m.tr?.en || ""} ${m.tr?.ar || ""}`)))];
  return { ...c, teams };
});

/* ---------- 5. optional daily brief ---------- */
let brief = await readJson("data/brief.json", null);
if (useAI && cfg.ai.dailyBrief) {
  const pack = L => clusters[L].map((c, i) => ({ i, sources: c.sources, titles: c.members.slice(0, 4).map(m => m.title) })).sort((a, b) => b.sources - a.sources).slice(0, 12);
  try { brief = { ts: lastUpdate, ...(await dailyBrief(cfg, pack("en"), pack("ar"))) }; await writeJson("data/brief.json", brief); }
  catch (e) { console.warn("[warn] brief skipped:", e.message); }
}
if (OFFLINE) {
  brief = await readJson("fixtures/sample-brief.json", null);
  for (const L of ["en", "ar"]) for (const b of brief?.[L] || []) if (b.key) b.i = clusters[L].findIndex(c => c.members.some(m => m.title.includes(b.key)));
}
if (brief && !OFFLINE && lastUpdate - brief.ts > 12 * 3600e3) brief = null; // never show a stale brief

/* ---------- 6. counts ---------- */
const counts = {}; const srcCount = {};
for (const L of ["en", "ar"]) {
  const ms = clusters[L].flatMap(c => c.members);
  counts[L] = { heads: ms.length, srcs: new Set(ms.map(m => m.src)).size };
  for (const m of ms) srcCount[m.src] = (srcCount[m.src] || 0) + 1;
}
for (const o of official) { srcCount[o.src] = (srcCount[o.src] || 0) + 1; for (const w of o.with || []) srcCount[w] = (srcCount[w] || 0) + 1; }
for (const c of sports) for (const m of c.members) srcCount[m.src] = (srcCount[m.src] || 0) + 1;

/* ---------- 7. render ---------- */
const hotels = await readJson("data/hotels.json", []);
const DIST = P("dist");
await fs.rm(DIST, { recursive: true, force: true });
await fs.mkdir(DIST, { recursive: true });
await fs.cp(P("static"), path.join(DIST, "static"), { recursive: true });
const version = lastUpdate.toString(36);
const renderers = { news: R.newsPage, official: R.officialPage, sports: R.sportsPage, stays: R.staysPage, sources: R.sourcesPage, about: R.aboutPage };
for (const lang of ["ar", "en"]) {
  const ctx = { cfg, lang, src: SRC, sourceList: sources, clusters, official, sports, hotels, brief, lastUpdate, counts, srcCount, version };
  for (const page of PAGES) {
    const dir = path.join(DIST, pagePath(lang, page));
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, "index.html"), renderers[page](ctx));
  }
  await fs.writeFile(path.join(DIST, lang, "feed.xml"), R.rss(ctx));
}
await fs.writeFile(path.join(DIST, "index.html"), R.rootPage(cfg));
await fs.writeFile(path.join(DIST, "404.html"), R.notFound());
await fs.writeFile(path.join(DIST, "sitemap.xml"), R.sitemap(cfg, lastUpdate));
await fs.writeFile(path.join(DIST, "robots.txt"), R.robots(cfg));
await fs.writeFile(path.join(DIST, "_headers"), "/static/*\n  Cache-Control: public, max-age=86400\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n");

/* ---------- 8. persist ---------- */
if (!OFFLINE && !RENDER) {
  await writeJson("data/meta.json", { lastUpdate });
  await writeJson("data/items.json", all);
  await writeJson("data/translations.json", trCache);
}
console.log(`Built ${new Date(lastUpdate).toISOString()} · EN ${counts.en.heads} headlines / ${clusters.en.length} stories · AR ${counts.ar.heads} / ${clusters.ar.length} · official ${official.length} · sports ${sports.length}`);
