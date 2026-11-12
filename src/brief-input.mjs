// Prints the most widely covered stories per language, as input for writing the daily brief.
// Usage: node src/brief-input.mjs   ->  JSON {en:[...], ar:[...]}
import fs from "node:fs";
import { cluster, makeRank } from "./classify.mjs";
const ROOT = new URL("..", import.meta.url).pathname;
const items = JSON.parse(fs.readFileSync(ROOT + "data/items.json", "utf8"));
const SRCS = JSON.parse(fs.readFileSync(ROOT + "config/sources.json", "utf8")).sources;
const srcs = Object.fromEntries(SRCS.map(s => [s.id, s.name.en]));
const type = Object.fromEntries(SRCS.map(s => [s.id, s.type]));
const rank = makeRank(id => type[id]); // Sudan Tribune, Dabanga, Radio Tamazuj first
const now = Date.now(), out = {};
for (const L of ["en", "ar"]) {
  const recent = items.filter(i => (i.cat === "en" || i.cat === "ar") && i.lang === L && now - i.ts < 36 * 3600e3);
  out[L] = cluster(recent, 0.5, { rank }).sort((a, b) => b.sources - a.sources || b.ts - a.ts).slice(0, 15).map(c => ({
    sources: c.sources,
    newest: new Date(c.ts).toISOString(),
    headlines: c.members.slice(0, 6).map(m => ({ source: srcs[m.src] || m.src, title: m.title, url: m.url }))
  }));
}
console.log(JSON.stringify(out, null, 1));
