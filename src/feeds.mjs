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
    const su = b.match(/<source[^>]*url=["']([^"']+)["']/i);
    const sourceUrl = su ? decode(su[1]) : "";
    if (title && link) items.push({ title, url: link.trim(), date, summary, sourceName, sourceUrl });
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

// Fetch every feed of a source, keep relevant items, merge them (dedupe by URL).
// keep(item) decides relevance, so a feed full of off-topic items no longer hides its fallback.
const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };
export async function fetchSource(src, keep = () => true) {
  const errors = []; const out = new Map(); const used = [];
  for (const f of src.feeds) {
    const url = f.url || gnewsUrl(f.gnews, f.lang);
    try {
      const xml = await fetchText(url);
      let items = parseFeed(xml);
      if (f.gnews) {
        // Google News titles end with " - Publisher"; strip it.
        items = items.map(i => ({ ...i, title: i.sourceName ? i.title.replace(new RegExp(`\\s+-\\s+${i.sourceName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`), "") : i.title.replace(/\s+-\s+[^-]+$/, ""), via: "gnews" }));
        // Only accept items actually published on the source's own domains.
        if (src.domains) items = items.filter(i => src.domains.some(d => hostOf(i.sourceUrl).endsWith(d)));
      }
      const kept = items.filter(keep);
      for (const i of kept) if (!out.has(i.url)) out.set(i.url, i);
      if (kept.length) used.push(f.url ? "feed" : "gnews");
      else errors.push(`${url}: ${items.length ? items.length + " items, none relevant" : "no items"}`);
    } catch (e) {
      errors.push(`${url}: ${e.message}`);
    }
  }
  return { items: [...out.values()], used: used.length ? used.join("+") : null, url: src.feeds.map(f => f.url || "gnews").join(" + "), errors };
}

export async function pool(list, n, fn) {
  const out = new Array(list.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < list.length) { const k = i++; out[k] = await fn(list[k], k); }
  }));
  return out;
}
