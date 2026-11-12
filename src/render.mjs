import { T, PAGES, pagePath } from "./i18n.mjs";

export const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ext = u => `href="${esc(u)}" target="_blank" rel="noopener"`;
const fmtDate = (lang, ts, approx) => new Intl.DateTimeFormat(T[lang].locale, approx
  ? { month: "long", year: "numeric", timeZone: "UTC" }
  : { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(ts));
const fmtStamp = (lang, ts) => new Intl.DateTimeFormat(T[lang].locale, { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "UTC" }).format(new Date(ts));

const ICONS = {
  news: '<path d="M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"/><path d="M7 9h10M7 13h10M7 17h6"/>',
  official: '<path d="M3 9l9-5 9 5"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
  sports: '<circle cx="12" cy="12" r="9"/><path d="M12 7l4 3-1.5 4.5h-5L8 10z"/>',
  hotels: '<path d="M3 19V7M3 13h18v6M21 13a3 3 0 0 0-3-3h-7v3"/><circle cx="7" cy="10.5" r="1.8"/>',
  sources: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7.5l3 8M16 7.5l-3 8M8.5 6h7"/>'
};
const icon = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;
const LOGO = `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15" fill="none" stroke="var(--teal)" stroke-width="4.6"/><path d="M20 5A15 15 0 0 1 35 20" fill="none" stroke="#C9A15E" stroke-width="4.6" stroke-linecap="round"/><circle cx="20" cy="20" r="6" fill="var(--teal)"/></svg>`;

export function layout(ctx, page, body, ld = []) {
  const { cfg, lang } = ctx; const t = T[lang]; const o = t.other;
  const url = cfg.siteUrl + pagePath(lang, page);
  const alt = l => cfg.siteUrl + pagePath(l, page);
  const nav = PAGES.map(p => `<a href="${pagePath(lang, p)}"${p === page ? ' aria-current="page"' : ""}>${esc(t.nav[p])}</a>`).join("");
  const bottom = ["news", "official", "sports", "hotels", "sources"].map(p => `<a href="${pagePath(lang, p)}"${p === page ? ' aria-current="page"' : ""}>${icon(p)}<span>${esc(t.nav[p])}</span></a>`).join("");
  const ldAll = [{ "@context": "https://schema.org", "@type": "WebPage", name: t.docTitle[page], url, inLanguage: lang, isPartOf: { "@type": "WebSite", name: "Lamha", alternateName: "لمحة", url: cfg.siteUrl + "/" } }, ...ld];
  return `<!doctype html>
<html lang="${lang}" dir="${t.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(t.docTitle[page])}</title>
<meta name="description" content="${esc(t.metaDesc[page])}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="${lang}" href="${url}">
<link rel="alternate" hreflang="${o}" href="${alt(o)}">
<link rel="alternate" hreflang="x-default" href="${cfg.siteUrl}/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Lamha لمحة">
<meta property="og:title" content="${esc(t.docTitle[page])}">
<meta property="og:description" content="${esc(t.metaDesc[page])}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${cfg.siteUrl}/static/og-${lang}.png">
<meta property="og:locale" content="${t.ogLocale}">
<meta property="og:locale:alternate" content="${T[o].ogLocale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#2D6F78">
<link rel="icon" href="/static/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/static/apple-touch-icon.png">
<link rel="alternate" type="application/rss+xml" title="Lamha" href="${cfg.siteUrl}/${lang}/feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/static/style.css?v=${ctx.version}">
<script type="application/ld+json">${JSON.stringify(ldAll.length === 1 ? ldAll[0] : { "@context": "https://schema.org", "@graph": ldAll.map(x => { const { ["@context"]: _, ...r } = x; return r; }) })}</script>
</head>
<body data-page="${page}" data-lang="${lang}">
<a class="skip" href="#main">${lang === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}</a>
<header class="mast">
  <div class="mast-row">
    <a class="brand" href="${pagePath(lang, "news")}">${LOGO}<span><span class="wm">${t.brandWm}</span><small>${esc(t.tagline)}</small></span></a>
    <a class="lang-switch" href="${pagePath(o, page)}" hreflang="${o}" lang="${o}" data-setlang="${o}">${esc(t.otherLabel)}</a>
  </div>
  <nav class="top" aria-label="${lang === "ar" ? "الأقسام" : "Sections"}">${nav}</nav>
</header>
<main id="main" class="wrap">
  <section class="hero">
    <p class="eyebrow"><span class="live"></span>${esc(t.eyebrow[page])}</p>
    <h1 class="pt">${esc(t.title[page])}</h1>
    <p class="lede">${esc(t.lede[page])}</p>
    <div class="edition"><span><span class="muted">${esc(t.lastUp)}:</span> <b><time datetime="${new Date(ctx.lastUpdate).toISOString()}">${esc(fmtStamp(lang, ctx.lastUpdate))}</time> ${esc(t.gmt)}</b></span>${page === "news" ? `<span class="stat">${t.stat(ctx.counts[lang].heads, ctx.counts[lang].srcs)}</span>` : ""}</div>
  </section>
${body}
  <footer>
    <span>${esc(t.foot)}</span>
    <span class="credit">© ${new Date(ctx.lastUpdate).getUTCFullYear()} ${esc(t.copyName)}</span>
    <span class="credit">${esc(t.builtBy)} <bdi>BahaWorks</bdi></span>
    <span>${esc(t.contact)}: <bdi>${esc(cfg.contactEmail)}</bdi></span>
    <span><a href="${pagePath(lang, "about")}">${esc(t.nav.about)}</a> · <a href="${pagePath(lang, "sources")}">${esc(t.nav.sources)}</a> · <a href="${pagePath(o, page)}" hreflang="${o}" data-setlang="${o}">${esc(T[o].nav[page])}</a></span>
  </footer>
</main>
<nav class="bottom" aria-label="${lang === "ar" ? "الأقسام" : "Sections"}">${bottom}</nav>
<div class="toast" id="toast" hidden role="status"></div>
<script>window.LAMHA={copied:${JSON.stringify(t.copied)},none:${JSON.stringify(t.none)}};</script>
<script src="/static/app.js?v=${ctx.version}" defer></script>
</body>
</html>`;
}

const typePill = (ctx, k) => {
  const s = ctx.src[k]; if (!s) return "";
  return `<span class="pill${s.type === "off" ? " gold" : ""}">${esc(T[ctx.lang].types[s.type])}</span>`;
};
const sn = (ctx, k) => ctx.src[k]?.name[ctx.lang] || k;
function titleFor(ctx, it) {
  const t = T[ctx.lang];
  if (it.lang === ctx.lang) return { title: it.title, note: "" };
  const tr = it.tr?.[ctx.lang];
  if (tr) return { title: tr, note: `<span class="tr">${esc(it.lang === "ar" ? t.trFromAr : t.trFromEn)}</span>` };
  return { title: it.title, note: "", langAttr: it.lang };
}
const dayGroup = (ctx, ts) => {
  const d = Math.floor(ctx.lastUpdate / 864e5) - Math.floor(ts / 864e5);
  return d <= 0 ? "today" : d === 1 ? "yesterday" : "earlier";
};

/* ---------- News ---------- */
export function newsPage(ctx) {
  const t = T[ctx.lang]; const L = ctx.lang;
  const cl = ctx.clusters[L];
  const lead = [...cl].filter(c => c.sources >= 2 && ctx.lastUpdate - c.ts < 48 * 3600e3).sort((a, b) => b.sources - a.sources || b.members.length - a.members.length)[0];
  const brief = ctx.brief?.[L]?.length ? `<section class="brief" aria-labelledby="bh"><h2 id="bh">${esc(t.briefH)}</h2><ol>${ctx.brief[L].map(b => {
    const c = b.i >= 0 ? cl[b.i] : null; return `<li>${esc(b.text)}${c ? ` <a ${ext(c.lead.url)}>↗ ${esc(sn(ctx, c.lead.src))}${c.members.length > 1 ? ` +${c.members.length - 1}` : ""}</a>` : ""}</li>`;
  }).join("")}</ol><small>${esc(t.briefNote)} · ${esc(t.lastUp)}: <time datetime="${new Date(ctx.brief.ts).toISOString()}">${esc(fmtStamp(L, ctx.brief.ts))}</time> ${esc(t.gmt)}</small></section>` : "";
  const leadHtml = lead ? `<div class="sec-h"><h2>${esc(t.topStory)}</h2><span>${esc(t.topStoryNote)}</span></div>
  <article class="lead"><div class="band"></div><div class="in">
    <div class="meta"><span class="pill gold">${esc(t.sourcesN(lead.sources))}</span><span>${esc(fmtDate(L, lead.ts))}</span><span class="pill ghost">${esc(t.topics[lead.topic])}</span></div>
    <h3><a ${ext(lead.lead.url)}>${esc(lead.lead.title)}</a></h3>
    <div class="voices">${lead.members.map(m => `<a ${ext(m.url)}><span class="vs">${esc(sn(ctx, m.src))}</span><span class="vt">${esc(m.title)}</span></a>`).join("")}</div>
  </div></article>` : "";
  const srcKeys = [...new Set(cl.flatMap(c => c.members.map(m => m.src)))];
  const chips = ["all", ...Object.keys(t.topics)].map(k => `<button class="chip" type="button" data-topic="${k}" aria-pressed="${k === "all"}">${esc(k === "all" ? t.all : t.topics[k])}</button>`).join("");
  let rows = ""; let lastG = null;
  for (const c of cl) {
    const g = dayGroup(ctx, c.ts);
    if (g !== lastG) { rows += `<div class="group-l">${esc(t[g])}</div>`; lastG = g; }
    const more = c.members.slice(1);
    rows += `<article class="row" data-topic="${c.topic}" data-srcs="${esc(c.members.map(m => m.src).join(" "))}">
      <div class="meta"><span class="src">${esc(sn(ctx, c.lead.src))}</span>${typePill(ctx, c.lead.src)}<time datetime="${new Date(c.ts).toISOString()}">${esc(fmtDate(L, c.ts))}</time><span class="pill ghost">${esc(t.topics[c.topic])}</span></div>
      <h3><a ${ext(c.lead.url)}>${esc(c.lead.title)}</a></h3>
      ${more.length ? `<details class="more"><summary>${esc(t.also(more.length))}</summary><ul>${more.map(m => `<li><a ${ext(m.url)}>${esc(m.title)}</a> <span class="muted">— ${esc(sn(ctx, m.src))}</span></li>`).join("")}</ul></details>` : ""}
    </article>`;
  }
  const body = `
  <section>
    ${brief}
    ${leadHtml}
    <div class="sec-h"><h2>${esc(t.allHeadlines)}</h2><span id="countNote" data-tpl="${esc(t.countNote("{n}"))}">${esc(t.countNote(cl.length))}</span></div>
    <div class="filters" role="group">${chips}</div>
    <div class="tools">
      <select id="srcSel" aria-label="${esc(t.allSrc)}"><option value="all">${esc(t.allSrc)}</option>${srcKeys.map(k => `<option value="${k}">${esc(sn(ctx, k))}</option>`).join("")}</select>
      <input id="q" type="search" placeholder="${esc(t.search)}" aria-label="${esc(t.search)}" autocomplete="off">
    </div>
    <div class="list" id="feed">${rows || `<div class="empty">${esc(t.none)}</div>`}<div class="empty" id="noMatch" hidden>${esc(t.none)}</div></div>
  </section>`;
  const ld = [{ "@context": "https://schema.org", "@type": "ItemList", name: t.allHeadlines, itemListElement: cl.slice(0, 30).map((c, i) => ({ "@type": "ListItem", position: i + 1, url: c.lead.url, name: c.lead.title })) }];
  if (L === "en") ld.push({ "@context": "https://schema.org", "@type": "Organization", name: "Lamha", alternateName: "لمحة", url: ctx.cfg.siteUrl + "/", logo: ctx.cfg.siteUrl + "/static/logo.png", description: T.en.aboutP[1] });
  return layout(ctx, "news", body, ld);
}

/* ---------- Official ---------- */
export function officialPage(ctx) {
  const t = T[ctx.lang];
  // Statements in the page language, plus statements in the other language that have a translation (marked as translated).
  const items = ctx.official.filter(o => o.lang === ctx.lang || o.tr?.[ctx.lang]);
  const issuers = [...new Set(items.map(o => o.src))];
  const chips = ["all", ...issuers].map(k => `<button class="chip" type="button" data-issuer="${k}" aria-pressed="${k === "all"}">${esc(k === "all" ? t.issuers : sn(ctx, k))}</button>`).join("");
  const rows = items.map(o => {
    const { title, note, langAttr } = titleFor(ctx, o);
    const sum = o.summary?.[ctx.lang];
    const withs = (o.with || []).map(k => sn(ctx, k));
    return `<article class="row" data-issuer="${esc([o.src, ...(o.with || [])].join(" "))}">
      <div class="meta"><span class="src">${esc(sn(ctx, o.src))}</span><span class="pill gold">${esc(t.types.off)}</span><time datetime="${new Date(o.ts).toISOString()}">${esc(fmtDate(ctx.lang, o.ts, o.approx))}</time>${o.via ? `<span>${esc(t.via)} ${esc(ctx.src[o.via]?.name[ctx.lang] || ({ National: { en: "The National", ar: "ذا ناشيونال" }, x: { en: "X", ar: "منصة X" } })[o.via]?.[ctx.lang] || o.via)}</span>` : ""}${note}</div>
      <h3${langAttr ? ` lang="${langAttr}" dir="auto"` : ""}><a ${ext(o.url)}>${esc(title)}</a></h3>
      ${sum ? `<p class="sum">${esc(sum)}</p>` : ""}${withs.length ? `<div class="meta"><span class="muted">+ ${esc(withs.join(ctx.lang === "ar" ? "، " : ", "))}</span></div>` : ""}
      ${o.lang !== ctx.lang ? (() => {
        const host = (() => { try { return new URL(/news\.google\./.test(o.url) ? (ctx.src[o.src]?.site || o.url) : o.url).hostname.replace(/^www\./, ""); } catch { return ""; } })();
        const orig = o.title || o.tr?.[o.lang] || "";
        return `<p class="trnote">${esc(T[ctx.lang].autoTr)} ${esc(T[ctx.lang].origIn[o.lang])}: <a ${ext(o.url)} lang="${o.lang}" dir="${o.lang === "ar" ? "rtl" : "ltr"}">${esc(orig)}</a>${host ? ` <span class="muted">(<bdi>${esc(host)}</bdi>)</span>` : ""}</p>`;
      })() : ""}
    </article>`;
  }).join("");
  return layout(ctx, "official", `<section><div class="filters" role="group">${chips}</div><div class="list" id="feed">${rows || `<div class="empty">${esc(t.none)}</div>`}<div class="empty" id="noMatch" hidden>${esc(t.none)}</div></div></section>`);
}

/* ---------- Sports ---------- */
export function sportsPage(ctx) {
  const t = T[ctx.lang];
  const kit = { hilal: "k-hilal", merrikh: "k-merrikh", nat: "k-nat" };
  const teams = Object.entries(t.teams).map(([k, [n, s]]) => `<button class="team" type="button" data-team="${k}" aria-pressed="false"><i class="${kit[k]}"></i><span><b>${esc(n)}</b><small>${esc(s)}</small></span></button>`).join("");
  const rows = ctx.sports[ctx.lang].map(c => {
    const { title, note, langAttr } = titleFor(ctx, c.lead);
    const more = c.members.slice(1);
    return `<article class="row" data-teams="${esc(c.teams.join(" "))}">
      <div class="meta"><span class="src">${esc(sn(ctx, c.lead.src))}</span>${c.teams.map(k => `<span class="pill">${esc(t.teams[k][0])}</span>`).join("")}<time datetime="${new Date(c.ts).toISOString()}">${esc(fmtDate(ctx.lang, c.ts))}</time>${note}</div>
      <h3${langAttr ? ` lang="${langAttr}" dir="auto"` : ""}><a ${ext(c.lead.url)}>${esc(title)}</a></h3>
      ${more.length ? `<details class="more"><summary>${esc(t.also(more.length))}</summary><ul>${more.map(m => { const x = titleFor(ctx, m); return `<li><a ${ext(m.url)}>${esc(x.title)}</a> <span class="muted">— ${esc(sn(ctx, m.src))}</span></li>`; }).join("")}</ul></details>` : ""}
    </article>`;
  }).join("");
  return layout(ctx, "sports", `<section><div class="teams">${teams}</div><div class="list" id="feed">${rows || `<div class="empty">${esc(t.none)}</div>`}<div class="empty" id="noMatch" hidden>${esc(t.none)}</div></div></section>`);
}

/* ---------- Stays ---------- */
export function staysPage(ctx) {
  const t = T[ctx.lang]; const L = ctx.lang;
  const city = key => {
    const [label, note] = t.cities[key];
    const cards = ctx.hotels.filter(h => h.city === key).map(h => `
      <article class="hotel" itemscope itemtype="https://schema.org/Hotel"><div class="cap"><span>${esc(label)}</span></div><div class="bd">
        <h3 itemprop="name">${esc(h[L])}<small>${esc(h.sub[L])}</small></h3>
        <p class="addr" itemprop="address">${esc(h.addr[L])}</p>
        ${h.facts[L].length ? `<div class="facts">${h.facts[L].map(f => `<span>${esc(f)}</span>`).join("")}</div>` : ""}
        ${h.confirm ? `<p class="addr warn">${esc(t.toConfirm)}</p>` : ""}
        <div class="actions"><a class="btn primary" itemprop="url" ${ext(h.site)}>${esc(t.site)} ↗</a>${h.phone ? `<button class="btn" type="button" data-copy="${esc(h.phone)}"><bdi dir="ltr" itemprop="telephone">${esc(h.phone)}</bdi></button>` : ""}</div>
      </div></article>`).join("");
    return `<h2 class="city-h">${esc(label)} <small>${esc(note)}</small></h2><div class="hotels">${cards}</div>`;
  };
  return layout(ctx, "hotels", `<section><div class="notice">${t.stayNotice}</div>${city("khartoum")}${city("port")}</section>`);
}

/* ---------- Sources ---------- */
export function sourcesPage(ctx) {
  const t = T[ctx.lang];
  const tbl = cat => {
    const L = ctx.lang;
    const news = cat === "en" || cat === "ar";
    const has = s => (ctx.srcCount[L][s.id] || 0) > 0;
    const ids = ctx.sourceList.filter(s => news
      ? ((s.cat === "en" || s.cat === "ar") && (s.cat === L || has(s)))
      : (s.cat === cat && ((s.pageLangs || ["en", "ar"]).includes(L) || has(s))));
    const rows = ids.map(s => {
      const n = ctx.srcCount[L][s.id] || 0;
      return `<tr><td><a ${ext(s.site)}>${esc(s.name[ctx.lang])}</a></td><td>${typePill(ctx, s.id)}${s.pay ? ` <span class="pill ghost">${esc(t.paywall)}</span>` : ""}</td>${cat === "off" ? `<td>${esc(s.langs || "")}</td>` : ""}<td>${n ? `<span class="dot on"></span>${n}` : `<span class="dot"></span>${esc(t.live)}`}</td></tr>`;
    }).join("");
    return `<div class="sec-h"><h2>${esc(t.tbl[cat])}</h2><span>${ids.length}</span></div><div class="tbl"><table><thead><tr><th>${esc(t.colName)}</th><th>${esc(t.colType)}</th>${cat === "off" ? `<th>${esc(t.colLang)}</th>` : ""}<th>${esc(t.colStatus)}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  };
  return layout(ctx, "sources", `<section>${tbl(ctx.lang)}${tbl("off")}${tbl("sport")}</section>`);
}

/* ---------- About ---------- */
export function aboutPage(ctx) {
  const t = T[ctx.lang];
  return layout(ctx, "about", `<section><div class="prose">${t.aboutP.map(p => `<p>${esc(p)}</p>`).join("")}</div>
    <div class="princ">${t.princ.map(([a, b]) => `<div><h2>${esc(a)}</h2><p>${esc(b)}</p></div>`).join("")}</div></section>`,
    [{ "@context": "https://schema.org", "@type": "AboutPage", name: t.docTitle.about }]);
}

/* ---------- Root, sitemap, robots, feeds, 404 ---------- */
export function rootPage(cfg) {
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>لمحة · Lamha · أخبار السودان في لمحة · Sudan news at a glance</title>
<meta name="description" content="لمحة مجمّع أخبار السودان المستقل بالعربية والإنجليزية. Lamha is an independent Sudan news aggregator in Arabic and English.">
<link rel="canonical" href="${cfg.siteUrl}/">
<link rel="alternate" hreflang="ar" href="${cfg.siteUrl}/ar/"><link rel="alternate" hreflang="en" href="${cfg.siteUrl}/en/"><link rel="alternate" hreflang="x-default" href="${cfg.siteUrl}/">
<link rel="icon" href="/static/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/static/apple-touch-icon.png"><link rel="stylesheet" href="/static/style.css">
<script>try{var l=localStorage.getItem("lamha-lang")||((navigator.language||"").slice(0,2)==="ar"?"ar":"en");location.replace("/"+(l==="ar"?"ar":"en")+"/");}catch(e){}</script>
</head><body><main class="chooser"><h1>لمحة · Lamha</h1><p>اختر اللغة · Choose your language</p><p><a class="btn primary" href="/ar/" hreflang="ar">العربية</a> <a class="btn" href="/en/" hreflang="en">English</a></p></main></body></html>`;
}
export function sitemap(cfg, lastUpdate) {
  const lm = new Date(lastUpdate).toISOString();
  const urls = PAGES.flatMap(p => ["ar", "en"].map(l => `<url><loc>${cfg.siteUrl}${pagePath(l, p)}</loc><lastmod>${lm}</lastmod><changefreq>${p === "news" || p === "sports" || p === "official" ? "hourly" : "monthly"}</changefreq><priority>${p === "news" ? "1.0" : "0.7"}</priority>
  <xhtml:link rel="alternate" hreflang="ar" href="${cfg.siteUrl}${pagePath("ar", p)}"/><xhtml:link rel="alternate" hreflang="en" href="${cfg.siteUrl}${pagePath("en", p)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${cfg.siteUrl}/"/></url>`));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n<url><loc>${cfg.siteUrl}/</loc><lastmod>${lm}</lastmod></url>\n${urls.join("\n")}\n</urlset>\n`;
}
export const robots = cfg => `User-agent: *\nAllow: /\n\nSitemap: ${cfg.siteUrl}/sitemap.xml\n`;
export function rss(ctx) {
  const L = ctx.lang; const t = T[L];
  const items = ctx.clusters[L].slice(0, 50).map(c => `<item><title>${esc(c.lead.title)}</title><link>${esc(c.lead.url)}</link><guid isPermaLink="false">${esc(c.lead.id)}</guid><pubDate>${new Date(c.ts).toUTCString()}</pubDate><source url="${esc(ctx.src[c.lead.src]?.site || "")}">${esc(sn(ctx, c.lead.src))}</source></item>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${esc(t.docTitle.news)}</title><link>${ctx.cfg.siteUrl}/${L}/</link><description>${esc(t.metaDesc.news)}</description><language>${L}</language><lastBuildDate>${new Date(ctx.lastUpdate).toUTCString()}</lastBuildDate>\n${items}\n</channel></rss>\n`;
}
export const notFound = () => `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>404 · لمحة</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/static/style.css"></head><body><main class="chooser"><h1>404</h1><p>الصفحة غير موجودة · Page not found</p><p><a class="btn primary" href="/ar/">الرئيسية</a> <a class="btn" href="/en/">Home</a></p></main></body></html>`;
