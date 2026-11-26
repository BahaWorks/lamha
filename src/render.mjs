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

// WhatsApp share link (plain wa.me link, no tracking).
const wa = (text, url) => `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`;
const WA = `<svg class="wa-i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z"/></svg>`;
export function layout(ctx, page, body, ld = [], sub = null) {
  const { cfg, lang } = ctx; const t = T[lang]; const o = t.other;
  // sub: a page inside a section (hotel, city guide, club) with its own path, title and intro.
  const P = l => sub ? sub.path[l] : pagePath(l, page);
  const url = cfg.siteUrl + P(lang);
  const alt = l => cfg.siteUrl + P(l);
  const docT = sub?.title ?? t.docTitle[page], desc = sub?.desc ?? t.metaDesc[page];
  const nav = PAGES.map(p => `<a href="${pagePath(lang, p)}"${p === page ? ' aria-current="page"' : ""}>${esc(t.nav[p])}</a>`).join("");
  const bottom = ["news", "official", "sports", "hotels", "sources"].map(p => `<a href="${pagePath(lang, p)}"${p === page ? ' aria-current="page"' : ""}>${icon(p)}<span>${esc(t.nav[p])}</span></a>`).join("");
  const ldAll = [{ "@context": "https://schema.org", "@type": "WebPage", name: docT, url, inLanguage: lang, isPartOf: { "@type": "WebSite", name: "Lamha", alternateName: "لمحة", url: cfg.siteUrl + "/" } }, ...ld];
  return `<!doctype html>
<html lang="${lang}" dir="${t.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(docT)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="${lang}" href="${url}">
<link rel="alternate" hreflang="${o}" href="${alt(o)}">
<link rel="alternate" hreflang="x-default" href="${alt("en")}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Lamha لمحة">
<meta property="og:title" content="${esc(docT)}">
<meta property="og:description" content="${esc(desc)}">
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
    <a class="lang-switch" href="${P(o)}" hreflang="${o}" lang="${o}" data-setlang="${o}">${esc(t.otherLabel)}</a>
  </div>
  <nav class="top" aria-label="${lang === "ar" ? "الأقسام" : "Sections"}">${nav}</nav>
</header>
<main id="main" class="wrap">
  <section class="hero">
    <p class="eyebrow"><span class="live"></span>${esc(sub?.eyebrow ?? t.eyebrow[page])}</p>
    <h1 class="pt">${esc(sub?.h1 ?? t.title[page])}</h1>
    <p class="lede">${esc(sub?.lede ?? t.lede[page])}</p>
    <div class="edition"><span><span class="muted">${esc(t.lastUp)}:</span> <b><time datetime="${new Date(ctx.lastUpdate).toISOString()}">${esc(fmtStamp(lang, ctx.lastUpdate))}</time> ${esc(t.gmt)}</b></span>${page === "news" ? `<span class="stat">${t.stat(ctx.counts[lang].heads, ctx.counts[lang].srcs)}</span>` : ""}</div>
  </section>
${body}
  <footer>
    <span>${esc(t.foot)}</span>
    <span class="credit">© ${new Date(ctx.lastUpdate).getUTCFullYear()} ${esc(t.copyName)}</span>
    <span class="credit">${esc(t.builtBy)} <bdi>BahaWorks</bdi></span>
    <span>${esc(t.contact)}: <!--email_off--><a href="mailto:${esc(cfg.contactEmail)}"><bdi>${esc(cfg.contactEmail)}</bdi></a><!--/email_off--></span>
    <span><a href="${pagePath(lang, "about")}">${esc(t.nav.about)}</a> · <a href="${pagePath(lang, "sources")}">${esc(t.nav.sources)}</a> · <a href="${P(o)}" hreflang="${o}" data-setlang="${o}">${esc(T[o].nav[page])}</a></span>
    <span><a href="${wa(lang === "ar" ? "لمحة: أخبار السودان في مكان واحد" : "Lamha: Sudan news in one place", cfg.siteUrl + pagePath(lang, "news"))}" target="_blank" rel="noopener" class="wa-link">${WA} ${esc(lang === "ar" ? "شارك لمحة على واتساب" : "Share Lamha on WhatsApp")}</a></span>
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

const SH = { en: { brief: "Share the brief on WhatsApp", story: "Share on WhatsApp", via: "via Lamha" }, ar: { brief: "شارك الموجز على واتساب", story: "شارك على واتساب", via: "عبر لمحة" } };
// Share a story: headline + original link, then Lamha's page link.
const share = (ctx, title, url) => `<a class="wa-mini" target="_blank" rel="noopener" href="${wa(`${title}\n${url}\n— ${SH[ctx.lang].via}`, ctx.cfg.siteUrl + pagePath(ctx.lang, "news"))}" aria-label="${esc(SH[ctx.lang].story)}" title="${esc(SH[ctx.lang].story)}">${WA}</a>`;

/* ---------- News ---------- */
export function newsPage(ctx) {
  const t = T[ctx.lang]; const L = ctx.lang;
  const cl = ctx.clusters[L];
  const lead = [...cl].filter(c => c.sources >= 2 && ctx.lastUpdate - c.ts < 48 * 3600e3).sort((a, b) => b.sources - a.sources || b.members.length - a.members.length)[0];
  const brief = ctx.brief?.[L]?.length ? `<section class="brief" aria-labelledby="bh"><h2 id="bh">${esc(t.briefH)}</h2><ol>${ctx.brief[L].map(b => {
    const c = b.i >= 0 ? cl[b.i] : null; return `<li>${esc(b.text)}${c ? ` <a ${ext(c.lead.url)}>↗ ${esc(sn(ctx, c.lead.src))}${c.members.length > 1 ? ` +${c.members.length - 1}` : ""}</a>` : ""}</li>`;
  }).join("")}</ol><small>${esc(t.briefNote)} · ${esc(t.lastUp)}: <time datetime="${new Date(ctx.brief.ts).toISOString()}">${esc(fmtStamp(L, ctx.brief.ts))}</time> ${esc(t.gmt)}</small><a class="wa-share" target="_blank" rel="noopener" href="${wa(`${t.briefH}\n${ctx.brief[L].map((b, i) => `${i + 1}. ${b.text}`).join("\n")}`, ctx.cfg.siteUrl + pagePath(L, "news"))}">${WA}<span>${esc(SH[L].brief)}</span></a></section>` : "";
  const leadHtml = lead ? `<div class="sec-h"><h2>${esc(t.topStory)}</h2><span>${esc(t.topStoryNote)}</span></div>
  <article class="lead"><div class="band"></div><div class="in">
    <div class="meta"><span class="pill gold">${esc(t.sourcesN(lead.sources))}</span><span>${esc(fmtDate(L, lead.ts))}</span><span class="pill ghost">${esc(t.topics[lead.topic])}</span>${share(ctx, lead.lead.title, lead.lead.url)}</div>
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
      <div class="meta"><span class="src">${esc(sn(ctx, c.lead.src))}</span>${typePill(ctx, c.lead.src)}<time datetime="${new Date(c.ts).toISOString()}">${esc(fmtDate(L, c.ts))}</time><span class="pill ghost">${esc(t.topics[c.topic])}</span>${share(ctx, c.lead.title, c.lead.url)}</div>
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
  const clubLinks = `<p class="club-links">${CLUB_KEYS.map(k => `<a class="btn" href="${clubPath(ctx.lang, k)}">${esc(CLUBS[k][ctx.lang].name)} ${FWD(ctx.lang)}</a>`).join("")}</p>`;
  return layout(ctx, "sports", `<section>${clubLinks}<div class="teams">${teams}</div><div class="list" id="feed">${rows || `<div class="empty">${esc(t.none)}</div>`}<div class="empty" id="noMatch" hidden>${esc(t.none)}</div></div></section>`);
}

/* ---------- Hotels ---------- */
const FWD = l => l === "ar" ? "←" : "→", BACK = l => l === "ar" ? "→" : "←";
const HS = {
  en: { details: "Details", fb: "Facebook page", phone: "Phone", addr: "Address", facts: "At a glance", tip: "Visitor tip", contact: "Contact", all: "All hotels", guide: "Full guide",
    note: "Lamha is not affiliated with any hotel and takes no bookings. Details come from the hotels' own pages and public travel guides, and can change. Confirm directly with the hotel before you travel.",
    city: { khartoum: "Khartoum", port: "Port Sudan" }, inCity: c => `Hotel in ${c}`, others: "Other hotels in" },
  ar: { details: "التفاصيل", fb: "صفحة فيسبوك", phone: "الهاتف", addr: "العنوان", facts: "باختصار", tip: "نصيحة للزائر", contact: "التواصل", all: "كل الفنادق", guide: "الدليل الكامل",
    note: "لمحة غير مرتبطة بأي فندق ولا تقبل حجوزات. المعلومات مأخوذة من صفحات الفنادق نفسها ومن أدلة السفر المنشورة، وقد تتغير، فتأكّد من الفندق مباشرة قبل السفر.",
    city: { khartoum: "الخرطوم", port: "بورتسودان" }, inCity: c => `فندق في ${c}`, others: "فنادق أخرى في" }
};
const GUIDES = {
  port: {
    path: l => `/${l}/hotels/port-sudan/`,
    en: { title: "Hotels in Port Sudan: where to stay in 2026 · Lamha", h1: "Hotels in Port Sudan", eyebrow: "Hotels guide",
      lede: "A neutral guide to hotels and serviced apartments in Port Sudan, with contacts and booking tips.",
      desc: "Where to stay in Port Sudan: Marina (former Hilton), Baasher Palace, Basiri Plaza, Flora, BelMar Residence and more, with phone numbers, areas and booking tips.",
      intro: ["Port Sudan, on the Red Sea, has hosted the government, ministries and many international organisations since the war began in April 2023. Rooms are in heavy demand, so plan well ahead.",
        "Most hotels are around the harbour and the Corniche, in the city centre, or near the airport. Online booking sites often show outdated listings, so confirm by phone or through the hotel's own page."],
      groups: [["By the sea and the harbour", ["marina-hotel-port-sudan", "grand-sahil-hotel"]], ["City centre", ["baasher-palace-hotel", "basiri-plaza-hotel", "solitaire-hotel", "al-rabwa-tourism-complex"]], ["Near the airport", ["flora-hotel", "belmar-residence"]]],
      tipsH: "Before you book", tips: ["Book early and confirm again the day before you arrive.", "Ask whether the hotel has a backup generator and its own water supply.", "Carry cash: many hotels do not accept cards.", "Check your government's latest travel advice before you go."] },
    ar: { title: "فنادق بورتسودان: أين تقيم في 2026 · لمحة", h1: "فنادق بورتسودان", eyebrow: "دليل الفنادق",
      lede: "دليل محايد للفنادق والشقق الفندقية في بورتسودان، مع وسائل التواصل ونصائح الحجز.",
      desc: "أين تقيم في بورتسودان: فندق مارينا (هيلتون سابقاً)، باشر بالاس، البصيري بلازا، فلورا، بلمار ريزيدنس وغيرها، مع أرقام الهواتف والمناطق ونصائح الحجز.",
      intro: ["تستضيف بورتسودان على ساحل البحر الأحمر الحكومة والوزارات وكثيراً من المنظمات الدولية منذ اندلاع الحرب في أبريل 2023، لذلك يكثر الطلب على الغرف، ومن الأفضل التخطيط مبكراً.",
        "تتركز معظم الفنادق حول الميناء والكورنيش، وفي وسط المدينة، وقرب المطار. وكثيراً ما تكون بيانات مواقع الحجز العالمية قديمة، فتأكّد بالهاتف أو عبر صفحة الفندق نفسه."],
      groups: [["على البحر وقرب الميناء", ["marina-hotel-port-sudan", "grand-sahil-hotel"]], ["وسط المدينة", ["baasher-palace-hotel", "basiri-plaza-hotel", "solitaire-hotel", "al-rabwa-tourism-complex"]], ["قرب المطار", ["flora-hotel", "belmar-residence"]]],
      tipsH: "قبل الحجز", tips: ["احجز مبكراً وأكّد الحجز مرة أخرى قبل وصولك بيوم.", "اسأل إن كان لدى الفندق مولد كهرباء احتياطي ومصدر مياه خاص.", "احمل نقوداً: كثير من الفنادق لا تقبل البطاقات.", "راجع آخر تحذيرات السفر الصادرة عن حكومتك قبل السفر."] }
  },
  khartoum: {
    path: l => `/${l}/hotels/khartoum/`,
    en: { title: "Hotels in Khartoum: which have reopened (2026) · Lamha", h1: "Hotels in Khartoum", eyebrow: "Hotels guide",
      lede: "Which Khartoum hotels are reopening, and what to check before you book.",
      desc: "Hotels in Khartoum in 2026: Al Salam (former Rotana), the historic Grand Hotel, Kanon and Corinthia. Which are reopening, contacts, and what to check before you book.",
      intro: ["Many of Khartoum's hotels closed or were damaged during the war. In January 2026 the prime minister toured several major hotels, including Al Salam Rotana, Kanon Hotel and the historic Grand Hotel, to check their readiness to host international delegations, and called on diplomatic missions and UN agencies to return to the capital.",
        "The Corinthia, the egg-shaped landmark on the Nile, was damaged during the war. Other well-known names include Kanon Hotel in Khartoum 2 and Coral Khartoum in the Al Mogran area; Lamha could not confirm their current status.",
        "Electricity, water and other services are being restored gradually, so ask each hotel what is working before you travel."],
      groups: [["Hotels with details on Lamha", ["al-salam-hotel", "grand-hotel-khartoum"]]],
      more: { h: "Other well-known Khartoum hotels", items: [
        ["Corinthia Hotel Khartoum", "Nile Road. A five-star hotel opened in 2008, known for its sail-shaped tower at the meeting of the Blue and White Nile. It was damaged during the war."],
        ["Kanon Hotel", "37th Street, Khartoum 2. One of the hotels the prime minister inspected in January 2026 to check its readiness to host delegations."],
        ["Coral Khartoum Hotel", "Al Mogran area, close to the Blue Nile. A large business hotel with about 270 rooms; its current status could not be confirmed."]] },
      tipsH: "Before you book", tips: ["Call the hotel to confirm it is open and taking bookings.", "Ask about power, water and internet.", "Check your government's latest travel advice: several governments still advise against travel to Sudan."] },
    ar: { title: "فنادق الخرطوم: أيها عاد للعمل (2026) · لمحة", h1: "فنادق الخرطوم", eyebrow: "دليل الفنادق",
      lede: "أي فنادق الخرطوم تعود إلى العمل، وما الذي تتأكد منه قبل الحجز.",
      desc: "فنادق الخرطوم في 2026: السلام (روتانا سابقاً)، الفندق الكبير التاريخي، كانون وكورنثيا. أيها يعود للعمل، ووسائل التواصل، وما تتأكد منه قبل الحجز.",
      intro: ["أُغلق كثير من فنادق الخرطوم أو تضرر خلال الحرب. وفي يناير 2026 تفقّد رئيس الوزراء عدداً من الفنادق الكبرى، منها السلام روتانا وفندق كانون والفندق الكبير التاريخي، للتأكد من جاهزيتها لاستقبال الوفود الدولية، ودعا البعثات الدبلوماسية ووكالات الأمم المتحدة إلى العودة إلى العاصمة.",
        "تضرر فندق كورنثيا، المبنى البيضاوي الشهير على النيل، خلال الحرب. ومن الأسماء المعروفة أيضاً فندق كانون في الخرطوم 2 وفندق كورال الخرطوم في منطقة المقرن، ولم تتمكن لمحة من التأكد من وضعهما الحالي.",
        "تعود خدمات الكهرباء والمياه وغيرها تدريجياً، فاسأل كل فندق عمّا يعمل لديه قبل السفر."],
      groups: [["فنادق لها صفحات تفصيلية في لمحة", ["al-salam-hotel", "grand-hotel-khartoum"]]],
      more: { h: "فنادق معروفة أخرى في الخرطوم", items: [
        ["فندق كورنثيا الخرطوم", "شارع النيل. فندق خمس نجوم افتُتح عام 2008، يشتهر ببرجه المصمم على شكل شراع عند ملتقى النيلين الأزرق والأبيض، وتضرر خلال الحرب."],
        ["فندق كانون", "شارع 37، الخرطوم 2. من الفنادق التي تفقّدها رئيس الوزراء في يناير 2026 للتأكد من جاهزيتها لاستقبال الوفود."],
        ["فندق كورال الخرطوم", "منطقة المقرن قرب النيل الأزرق. فندق أعمال كبير يضم نحو 270 غرفة، ولم نتمكن من التأكد من وضعه الحالي."]] },
      tipsH: "قبل الحجز", tips: ["اتصل بالفندق للتأكد من أنه يعمل ويستقبل الحجوزات.", "اسأل عن الكهرباء والمياه والإنترنت.", "راجع آخر تحذيرات السفر لحكومتك: ما زالت عدة حكومات تنصح بعدم السفر إلى السودان."] }
  }
};
export const hotelPath = (l, h) => `/${l}/hotels/${h.slug}/`;
export const guidePath = (l, c) => GUIDES[c].path(l);
const hotelLd = (ctx, h) => ({ "@context": "https://schema.org", "@type": "Hotel", name: h[ctx.lang], url: ctx.cfg.siteUrl + hotelPath(ctx.lang, h), description: h.desc?.[ctx.lang],
  address: { "@type": "PostalAddress", streetAddress: h.addr[ctx.lang], addressLocality: HS[ctx.lang].city[h.city], addressCountry: "SD" },
  ...(h.phone ? { telephone: h.phone } : {}), sameAs: [h.site, h.fb].filter(Boolean) });
const hotelCard = (ctx, h) => {
  const t = T[ctx.lang], L = ctx.lang, hs = HS[L];
  return `<article class="hotel"><div class="cap"><span>${esc(hs.city[h.city])}</span></div><div class="bd">
    <h3><a href="${hotelPath(L, h)}">${esc(h[L])}</a><small>${esc(h.sub[L])}</small></h3>
    <p class="addr">${esc(h.addr[L])}</p>
    ${h.facts[L].length ? `<div class="facts">${h.facts[L].map(f => `<span>${esc(f)}</span>`).join("")}</div>` : ""}
    <div class="actions"><a class="btn primary" href="${hotelPath(L, h)}">${esc(hs.details)}</a>${h.phone ? `<button class="btn" type="button" data-copy="${esc(h.phone)}"><bdi dir="ltr">${esc(h.phone)}</bdi></button>` : ""}</div>
  </div></article>`;
};
export function hotelsPage(ctx) {
  const t = T[ctx.lang]; const L = ctx.lang;
  const city = key => {
    const [label, note] = t.cities[key];
    return `<h2 class="city-h">${esc(label)} <small>${esc(note)}</small> <a class="guide-link" href="${guidePath(L, key)}">${esc(HS[L].guide)} ${FWD(L)}</a></h2><div class="hotels">${ctx.hotels.filter(h => h.city === key).map(h => hotelCard(ctx, h)).join("")}</div>`;
  };
  return layout(ctx, "hotels", `<section><div class="notice">${t.stayNotice}</div>${city("port")}${city("khartoum")}</section>`, ctx.hotels.map(h => hotelLd(ctx, h)));
}
export function hotelPage(ctx, h) {
  const t = T[ctx.lang], L = ctx.lang, hs = HS[L];
  const contact = [h.phone && `<button class="btn" type="button" data-copy="${esc(h.phone)}">${esc(hs.phone)}: <bdi dir="ltr">${esc(h.phone)}</bdi></button>`,
    h.site && `<a class="btn primary" ${ext(h.site)}>${esc(t.site)} ↗</a>`, h.fb && `<a class="btn" ${ext(h.fb)}>${esc(hs.fb)} ↗</a>`].filter(Boolean).join("");
  const others = ctx.hotels.filter(x => x.city === h.city && x.slug !== h.slug);
  const body = `<section class="hotel-detail">
    <div class="prose"><p>${esc(h.desc[L])}</p>${h.extra ? `<p>${esc(h.extra[L])}</p>` : ""}</div>
    <dl class="kv"><div><dt>${esc(hs.addr)}</dt><dd>${esc(h.addr[L])}</dd></div>${h.facts[L].length ? `<div><dt>${esc(hs.facts)}</dt><dd><div class="facts">${h.facts[L].map(f => `<span>${esc(f)}</span>`).join("")}</div></dd></div>` : ""}</dl>
    <div class="sec-h"><h2>${esc(hs.contact)}</h2></div><div class="actions">${contact}</div>
    <div class="tipbox"><b>${esc(hs.tip)}</b><p>${esc(h.tip[L])}</p></div>
    <div class="sec-h"><h2>${esc(L === "ar" ? `الإقامة في ${hs.city[h.city]}` : `Staying in ${hs.city[h.city]}`)}</h2></div>
    <div class="prose"><p>${esc(GUIDES[h.city][L].intro[0])}</p><ul>${GUIDES[h.city][L].tips.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <p class="muted small">${esc(hs.note)}</p>
    <div class="sec-h"><h2>${esc(hs.others)} ${esc(hs.city[h.city])}</h2><a href="${guidePath(L, h.city)}">${esc(HS[L].guide)}</a></div>
    <ul class="link-list">${others.map(x => `<li><a href="${hotelPath(L, x)}">${esc(x[L])}</a> <span class="muted">— ${esc(x.sub[L])}</span></li>`).join("")}</ul>
    <p><a href="${pagePath(L, "hotels")}">${BACK(L)} ${esc(hs.all)}</a></p></section>`;
  return layout(ctx, "hotels", body, [hotelLd(ctx, h)], {
    path: { ar: hotelPath("ar", h), en: hotelPath("en", h) },
    title: `${h[L]} · ${hs.city[h.city]} · ${L === "ar" ? "لمحة" : "Lamha"}`,
    desc: h.desc[L].slice(0, 155), eyebrow: hs.inCity(hs.city[h.city]), h1: h[L], lede: h.sub[L] });
}
export function guidePage(ctx, key) {
  const L = ctx.lang, g = GUIDES[key][L], by = Object.fromEntries(ctx.hotels.map(h => [h.slug, h]));
  const body = `<section><div class="notice">${T[L].stayNotice}</div><div class="prose">${g.intro.map(p => `<p>${esc(p)}</p>`).join("")}</div>
    ${g.groups.map(([h, slugs]) => `<h2 class="city-h">${esc(h)}</h2><div class="hotels">${slugs.filter(x => by[x]).map(x => hotelCard(ctx, by[x])).join("")}</div>`).join("")}
    ${g.more ? `<h2 class="city-h">${esc(g.more.h)}</h2><dl class="kv">${g.more.items.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
    <div class="tipbox"><b>${esc(g.tipsH)}</b><ul>${g.tips.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <p class="muted small">${esc(HS[L].note)}</p><p><a href="${pagePath(L, "hotels")}">${BACK(L)} ${esc(HS[L].all)}</a></p></section>`;
  const list = g.groups.flatMap(([, s]) => s).filter(x => by[x]);
  return layout(ctx, "hotels", body, [{ "@context": "https://schema.org", "@type": "ItemList", name: g.h1, itemListElement: list.map((x, i) => ({ "@type": "ListItem", position: i + 1, url: ctx.cfg.siteUrl + hotelPath(L, by[x]), name: by[x][L] })) }],
    { path: { ar: guidePath("ar", key), en: guidePath("en", key) }, title: g.title, desc: g.desc, eyebrow: g.eyebrow, h1: g.h1, lede: g.lede });
}

/* ---------- Club pages ---------- */
const CLUBS = {
  hilal: { en: { name: "Al-Hilal Omdurman", h1: "Al-Hilal Omdurman: latest news and results", eyebrow: "Club page",
      lede: "News on Al-Hilal from Sudanese, Rwandan and African football sources, updated through the day.",
      desc: "Al-Hilal Omdurman latest news and results in the Rwanda Premier League and the CAF Champions League, from Sudanese, Rwandan and African sources.",
      intro: "Al-Hilal Club of Omdurman, founded in 1930 and known for its blue and white colours, is one of Sudan's two biggest football clubs. With football in Sudan disrupted by the war, Al-Hilal and Al-Merrikh are playing this season in the Rwanda Premier League.",
      facts: [["Founded", "13 February 1930, Omdurman"], ["Home ground", "Al-Hilal Stadium, “the Blue Jewel” (opened 1968, renovated and reopened in 2018)"], ["Nicknames", "Sayed Al-Balad (Leader of the Country), Al-Mawj Al-Azraq (the Blue Wave)"], ["Sudan league", "The most titles of any club in Sudan"], ["Africa", "CAF Champions League runners-up in 1987 and 1992; semi-finalists in 2007, 2009, 2011 and 2015"], ["This season", "Rwanda Premier League (temporarily, because of the war) and the CAF Champions League"]],
      history: ["Al-Hilal was founded in Omdurman in 1930 by a group of graduates of Gordon Memorial College, and its motto is “God – the Nation – Al-Hilal”. Its rivalry with Al-Merrikh, also from Omdurman, is the biggest fixture in Sudanese football.", "Since the war began in April 2023, league football in Sudan has been disrupted. Al-Hilal has played abroad, and this season it is a guest team in the Rwanda Premier League while also representing Sudan in the CAF Champions League."],
      comps: ["Rwanda Premier League", "CAF Champions League"] },
    ar: { name: "الهلال أم درمان", h1: "الهلال أم درمان: آخر الأخبار والنتائج", eyebrow: "صفحة النادي",
      lede: "أخبار الهلال من الصحافة الرياضية السودانية والرواندية والأفريقية، تُحدَّث على مدار اليوم.",
      desc: "آخر أخبار ونتائج الهلال أم درمان في الدوري الرواندي الممتاز ودوري أبطال أفريقيا، من المصادر السودانية والرواندية والأفريقية.",
      intro: "نادي الهلال بأم درمان، تأسس عام 1930 ويُعرف باللونين الأزرق والأبيض، وهو أحد أكبر ناديين لكرة القدم في السودان. ومع توقف النشاط الكروي في السودان بسبب الحرب، يشارك الهلال والمريخ هذا الموسم في الدوري الرواندي الممتاز.",
      facts: [["التأسيس", "13 فبراير 1930، أم درمان"], ["الملعب", "استاد الهلال «الجوهرة الزرقاء» (افتُتح 1968، وأُعيد افتتاحه بعد التجديد في 2018)"], ["الألقاب", "سيد البلد، الموج الأزرق"], ["الدوري السوداني", "صاحب أكبر عدد من ألقاب الدوري في السودان"], ["أفريقياً", "وصيف دوري أبطال أفريقيا عامي 1987 و1992، وبلغ نصف النهائي في 2007 و2009 و2011 و2015"], ["هذا الموسم", "الدوري الرواندي الممتاز (بصورة مؤقتة بسبب الحرب) ودوري أبطال أفريقيا"]],
      history: ["تأسس الهلال في أم درمان عام 1930 على يد مجموعة من خريجي كلية غردون التذكارية، وشعاره «الله – الوطن – الهلال». ومواجهته مع المريخ، جاره في أم درمان، هي أكبر مباراة في الكرة السودانية.", "منذ اندلاع الحرب في أبريل 2023 تعطّل النشاط الكروي في السودان، فلعب الهلال خارج البلاد، ويشارك هذا الموسم ضيفاً في الدوري الرواندي الممتاز، إلى جانب تمثيله السودان في دوري أبطال أفريقيا."],
      comps: ["الدوري الرواندي الممتاز", "دوري أبطال أفريقيا"] } },
  merrikh: { en: { name: "Al-Merrikh", h1: "Al-Merrikh: latest news and results", eyebrow: "Club page",
      lede: "News on Al-Merrikh from Sudanese, Rwandan and African football sources, updated through the day.",
      desc: "Al-Merrikh latest news and results in the Rwanda Premier League, from Sudanese, Rwandan and African sources.",
      intro: "Al-Merrikh Sporting Club of Omdurman, known for its red and yellow colours, is one of Sudan's oldest and most popular football clubs. With football in Sudan disrupted by the war, Al-Merrikh and Al-Hilal are playing this season in the Rwanda Premier League.",
      facts: [["Founded", "1908 as Al-Masalma Sporting Club; renamed Al-Merrikh (“Mars”) on 14 November 1927"], ["Home ground", "Al-Merrikh Stadium, “the Red Castle”, in Omdurman (opened 1964, capacity about 43,000), also used by Sudan's national team"], ["Nickname", "Al-Zaeem (the Chief)"], ["Africa", "African Cup Winners' Cup winners in 1989, the only continental title won by a Sudanese club; CAF Confederation Cup runners-up in 2007"], ["Region", "CECAFA Clubs Cup winners in 1986, 1994 and 2014"], ["This season", "Rwanda Premier League (temporarily, because of the war)"]],
      history: ["Al-Merrikh is one of the oldest football clubs in Africa. It began in 1908 as Al-Masalma Sporting Club, founded by students from the Al-Masalma district of Omdurman, and took the name Al-Merrikh, Arabic for Mars, in 1927. Its rivalry with Al-Hilal is the biggest fixture in Sudanese football.", "Since the war began in April 2023, league football in Sudan has been disrupted, and Al-Merrikh is playing this season as a guest team in the Rwanda Premier League."],
      comps: ["Rwanda Premier League"] },
    ar: { name: "المريخ", h1: "المريخ: آخر الأخبار والنتائج", eyebrow: "صفحة النادي",
      lede: "أخبار المريخ من الصحافة الرياضية السودانية والرواندية والأفريقية، تُحدَّث على مدار اليوم.",
      desc: "آخر أخبار ونتائج نادي المريخ في الدوري الرواندي الممتاز، من المصادر السودانية والرواندية والأفريقية.",
      intro: "نادي المريخ الرياضي بأم درمان، يُعرف باللونين الأحمر والأصفر، وهو من أعرق أندية كرة القدم في السودان وأكثرها شعبية. ومع توقف النشاط الكروي في السودان بسبب الحرب، يشارك المريخ والهلال هذا الموسم في الدوري الرواندي الممتاز.",
      facts: [["التأسيس", "1908 باسم نادي المسالمة الرياضي، وتغيّر اسمه إلى المريخ في 14 نوفمبر 1927"], ["الملعب", "استاد المريخ «القلعة الحمراء» في أم درمان (افتُتح 1964، ويتسع لنحو 43 ألف متفرج)، ويلعب عليه المنتخب الوطني أيضاً"], ["اللقب", "الزعيم"], ["أفريقياً", "بطل كأس الكؤوس الأفريقية 1989، وهو اللقب القاري الوحيد لنادٍ سوداني، ووصيف كأس الكونفدرالية 2007"], ["إقليمياً", "بطل كأس سيكافا للأندية أعوام 1986 و1994 و2014"], ["هذا الموسم", "الدوري الرواندي الممتاز (بصورة مؤقتة بسبب الحرب)"]],
      history: ["المريخ من أقدم أندية كرة القدم في أفريقيا، بدأ عام 1908 باسم نادي المسالمة الرياضي على يد طلاب من حي المسالمة بأم درمان، ثم حمل اسم المريخ عام 1927. ومواجهته مع الهلال هي أكبر مباراة في الكرة السودانية.", "منذ اندلاع الحرب في أبريل 2023 تعطّل النشاط الكروي في السودان، ويشارك المريخ هذا الموسم ضيفاً في الدوري الرواندي الممتاز."],
      comps: ["الدوري الرواندي الممتاز"] } }
};
export const clubPath = (l, k) => `/${l}/sports/${k}/`;
export const CLUB_KEYS = Object.keys(CLUBS);
export function clubPage(ctx, key) {
  const L = ctx.lang, c = CLUBS[key][L], t = T[L];
  const rows = ctx.sports[L].filter(x => x.teams.includes(key)).map(cl => {
    const { title, note, langAttr } = titleFor(ctx, cl.lead);
    return `<article class="row"><div class="meta"><span class="src">${esc(sn(ctx, cl.lead.src))}</span><time datetime="${new Date(cl.ts).toISOString()}">${esc(fmtDate(L, cl.ts))}</time>${note}${share(ctx, title, cl.lead.url)}</div>
      <h3${langAttr ? ` lang="${langAttr}" dir="auto"` : ""}><a ${ext(cl.lead.url)}>${esc(title)}</a></h3></article>`;
  }).join("");
  const other = key === "hilal" ? "merrikh" : "hilal";
  const body = `<section><div class="prose"><p>${esc(c.intro)}</p></div>
    <div class="meta comps">${c.comps.map(x => `<span class="pill">${esc(x)}</span>`).join("")}</div>
    <div class="sec-h"><h2>${esc(L === "ar" ? "عن النادي" : "About the club")}</h2></div>
    <dl class="kv">${c.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    <div class="prose">${c.history.map(p => `<p>${esc(p)}</p>`).join("")}</div>
    <div class="sec-h"><h2>${esc(L === "ar" ? "آخر الأخبار" : "Latest news")}</h2><span>${ctx.sports[L].filter(x => x.teams.includes(key)).length}</span></div>
    <div class="list">${rows || `<div class="empty">${esc(t.none)}</div>`}</div>
    <p><a href="${clubPath(L, other)}">${esc(CLUBS[other][L].name)} ${FWD(L)}</a> · <a href="${pagePath(L, "sports")}">${esc(t.nav.sports)}</a></p></section>`;
  return layout(ctx, "sports", body, [{ "@context": "https://schema.org", "@type": "SportsTeam", name: c.name, sport: "Football", location: { "@type": "Place", name: L === "ar" ? "أم درمان، السودان" : "Omdurman, Sudan" } }],
    { path: { ar: clubPath("ar", key), en: clubPath("en", key) }, title: `${c.h1} · ${L === "ar" ? "لمحة" : "Lamha"}`, desc: c.desc, eyebrow: c.eyebrow, h1: c.h1, lede: c.lede });
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
<meta name="description" content="لمحة: أخبار السودان في مكان واحد، موقع مستقل بالعربية والإنجليزية. Lamha is an independent Sudan news aggregator in Arabic and English.">
<meta name="robots" content="noindex, follow">
<link rel="icon" href="/static/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/static/apple-touch-icon.png"><link rel="stylesheet" href="/static/style.css">
<script>try{var l=localStorage.getItem("lamha-lang")||((navigator.language||"").slice(0,2)==="ar"?"ar":"en");location.replace("/"+(l==="ar"?"ar":"en")+"/");}catch(e){}</script>
</head><body><main class="chooser"><h1>لمحة · Lamha</h1><p>اختر اللغة · Choose your language</p><p><a class="btn primary" href="/ar/" hreflang="ar">العربية</a> <a class="btn" href="/en/" hreflang="en">English</a></p></main></body></html>`;
}
export function sitemap(cfg, lastUpdate, extra = []) {
  const lm = new Date(lastUpdate).toISOString();
  const urls = PAGES.flatMap(p => ["ar", "en"].map(l => `<url><loc>${cfg.siteUrl}${pagePath(l, p)}</loc><lastmod>${lm}</lastmod><changefreq>${p === "news" || p === "sports" || p === "official" ? "hourly" : "monthly"}</changefreq><priority>${p === "news" ? "1.0" : "0.7"}</priority>
  <xhtml:link rel="alternate" hreflang="ar" href="${cfg.siteUrl}${pagePath("ar", p)}"/><xhtml:link rel="alternate" hreflang="en" href="${cfg.siteUrl}${pagePath("en", p)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${cfg.siteUrl}${pagePath("en", p)}"/></url>`));
  // extra: [{ ar, en, freq }] paths for hotel, guide and club pages.
  for (const e of extra) for (const l of ["ar", "en"]) urls.push(`<url><loc>${cfg.siteUrl}${e[l]}</loc><lastmod>${lm}</lastmod><changefreq>${e.freq || "monthly"}</changefreq><priority>0.6</priority>
  <xhtml:link rel="alternate" hreflang="ar" href="${cfg.siteUrl}${e.ar}"/><xhtml:link rel="alternate" hreflang="en" href="${cfg.siteUrl}${e.en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${cfg.siteUrl}${e.en}"/></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}
export const robots = cfg => `User-agent: *\nAllow: /\n\nSitemap: ${cfg.siteUrl}/sitemap.xml\n`;
export function rss(ctx) {
  const L = ctx.lang; const t = T[L];
  const items = ctx.clusters[L].slice(0, 50).map(c => `<item><title>${esc(c.lead.title)}</title><link>${esc(c.lead.url)}</link><guid isPermaLink="false">${esc(c.lead.id)}</guid><pubDate>${new Date(c.ts).toUTCString()}</pubDate><source url="${esc(ctx.src[c.lead.src]?.site || "")}">${esc(sn(ctx, c.lead.src))}</source></item>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${esc(t.docTitle.news)}</title><link>${ctx.cfg.siteUrl}/${L}/</link><description>${esc(t.metaDesc.news)}</description><language>${L}</language><lastBuildDate>${new Date(ctx.lastUpdate).toUTCString()}</lastBuildDate>\n${items}\n</channel></rss>\n`;
}
export const notFound = () => `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>404 · لمحة</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/static/style.css"></head><body><main class="chooser"><h1>404</h1><p>الصفحة غير موجودة · Page not found</p><p><a class="btn primary" href="/ar/">الرئيسية</a> <a class="btn" href="/en/">Home</a></p></main></body></html>`;
