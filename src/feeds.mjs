// Fetching and parsing RSS / Atom feeds with no external dependencies.

const UA = "LamhaBot/1.0 (+https://lamha-sd.com/en/about/; news aggregator)";

export function gnewsUrl(q, lang) {
  const p = lang === "ar"
    ? { hl: "ar", gl: "EG", ceid: "EG:ar" }
    : { hl: "en-US", gl: "US", ceid: "US:en" };
  const qs = new URLSearchParams({ q: `${q} when:7d`, ...p });
  return `https://news.google.com/rss/search?${qs}`;
}

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
export function decode(s = "") {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
}
const stripTags = s => decode(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : "";
};

export function parseFeed(xml) {
  const items = [];
  const isAtom = /<feed[\s>]/i.test(xml) && !/<rss[\s>]/i.test(xml);
  const blocks = xml.match(isAtom ? /<entry[\s>][\s\S]*?<\/entry>/gi : /<item[\s>][\s\S]*?<\/item>/gi) || [];
  for (const b of blocks) {
    let link = "";
    if (isAtom) {
      const alt = b.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i) || b.match(/<link[^>]*href=["']([^"']+)["']/i);
      link = alt ? decode(alt[1]) : "";
    } else {
      link = stripTags(tag(b, "link")) || stripTags(tag(b, "guid"));
    }
    const title = stripTags(tag(b, "title"));
    const date = stripTags(tag(b, isAtom ? "updated" : "pubDate")) || stripTags(tag(b, "published")) || stripTags(tag(b, "dc:date"));
    const summary = stripTags(tag(b, isAtom ? "summary" : "description")).slice(0, 400);
    const sourceName = stripTags(tag(b, "source"));
    if (title && link) items.push({ title, url: link.trim(), date, summary, sourceName });
  }
  return items;
}

export async function fetchText(url, timeoutMs = 20000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { "user-agent": UA, accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally { clearTimeout(t); }
}

// Try each feed of a source in order; return the first that yields items.
export async function fetchSource(src) {
  const errors = [];
  for (const f of src.feeds) {
    const url = f.url || gnewsUrl(f.gnews, f.lang);
    try {
      const xml = await fetchText(url);
      let items = parseFeed(xml);
      if (f.gnews) {
        // Google News titles end with " - Publisher"; strip it.
        items = items.map(i => ({ ...i, title: i.sourceName ? i.title.replace(new RegExp(`\\s+-\\s+${i.sourceName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`), "") : i.title.replace(/\s+-\s+[^-]+$/, ""), via: "gnews" }));
      }
      if (items.length) return { items, used: f.url ? "feed" : "gnews", url };
      errors.push(`${url}: no items`);
    } catch (e) {
      errors.push(`${url}: ${e.message}`);
    }
  }
  return { items: [], used: null, errors };
}

export async function pool(list, n, fn) {
  const out = new Array(list.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < list.length) { const k = i++; out[k] = await fn(list[k], k); }
  }));
  return out;
}
