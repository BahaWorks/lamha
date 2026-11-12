// Optional: translations and the daily brief via the Claude API.
// Runs only when ANTHROPIC_API_KEY is set. Without it the site still builds:
// titles show in their original language and the brief section is hidden.

const KEY = process.env.ANTHROPIC_API_KEY;
export const aiEnabled = cfg => Boolean(KEY && cfg.ai?.enabled);

async function ask(cfg, system, user, maxTokens = 2000) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: cfg.ai.model, max_tokens: maxTokens, system, messages: [{ role: "user", content: user }] })
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.content.map(c => c.text || "").join("");
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  return JSON.parse(json);
}

// titles: [{id, lang, title}] -> {id: {en, ar}}
export async function translate(cfg, titles) {
  if (!titles.length) return {};
  const out = {};
  for (let i = 0; i < titles.length; i += 40) {
    const batch = titles.slice(i, i + 40);
    const r = await ask(cfg,
      "You translate news headlines between Arabic and English for a neutral news aggregator. Translate faithfully. Keep names, numbers and quoted words accurate. Do not add, soften or sharpen anything. Reply with JSON only.",
      `Translate each headline into the other language (Arabic <-> English). Return {"items":[{"id":"...","en":"...","ar":"..."}]} keeping the original text in its own language field.\n\n${JSON.stringify(batch)}`, 4000);
    for (const it of r.items || []) out[it.id] = { en: it.en, ar: it.ar };
  }
  return out;
}

// clusters: [{i, lang, titles:[...], sources:[...]}] -> {en:[{text, i}], ar:[{text, i}]}
export async function dailyBrief(cfg, clustersEn, clustersAr) {
  return ask(cfg,
    "You write a short, strictly neutral daily brief for Lamha, an independent Sudan news aggregator not affiliated with any side. Use only facts present in the headlines given. Attribute contested claims to whoever made them (e.g. 'the RSF said', 'the army said'). No adjectives that take sides, no speculation, no advice. Reply with JSON only.",
    `Write 4 bullet points in English from the English stories and 4 in Arabic from the Arabic stories, choosing the most widely covered events. Each bullet is one sentence (max 30 words) and references the story index it summarises.\nReturn {"en":[{"text":"...","i":0}],"ar":[{"text":"...","i":0}]}.\n\nENGLISH STORIES:\n${JSON.stringify(clustersEn)}\n\nARABIC STORIES:\n${JSON.stringify(clustersAr)}`, 2000);
}
