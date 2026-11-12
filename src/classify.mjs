// Relevance filters, topic tagging and story clustering.

const SUDAN = /\b(sudan(?:ese)?|khartoum|omdurman|darfur|kordofan|el[- ]?fasher|port sudan|rsf|rapid support forces|burhan|hemedti|el[- ]?obeid|blue nile|gezira|abyei)\b|السودان|سوداني|الخرطوم|أم درمان|ام درمان|دارفور|كردفان|الفاشر|بورتسودان|بورت سودان|الدعم السريع|البرهان|حميدتي|الأبيض|النيل الأزرق|الجزيرة\s?السودانية|أبيي/i;
const SOUTH_ONLY = /south sudan|جنوب السودان/i;

export function isSudan(text) {
  if (!SUDAN.test(text)) return false;
  // Drop items that only mention South Sudan.
  const stripped = text.replace(/south sudan(?:ese)?/gi, "").replace(/جنوب السودان/g, "");
  return SOUTH_ONLY.test(text) ? SUDAN.test(stripped) : true;
}

const TEAMS = {
  hilal: /الهلال|هلال أم درمان|al[- ]?hilal/i,
  merrikh: /المريخ|al[- ]?merrikh|al[- ]?merreikh/i,
  nat: /منتخب السودان|المنتخب السوداني|المنتخب الوطني|صقور الجديان|sudan national team|falcons of jediane|قائمة المنتخب|مواجهة السودان|مباراة السودان|السودان و?ال(?:سنغال|[\u0600-\u06FF]+) في تصفيات|sudan v(?:s\.?)?\s|sudan face|afcon[^.]*sudan|sudan[^.]*afcon/i
};
const NOT_SUDAN_HILAL = /الهلال السعودي|al[- ]?hilal saudi|النصر|الاتحاد السعودي|روشن/i;

export function teamsOf(text) {
  const t = [];
  for (const [k, re] of Object.entries(TEAMS)) if (re.test(text)) t.push(k);
  if (t.includes("hilal") && NOT_SUDAN_HILAL.test(text) && !/السوداني|أم درمان|omdurman/i.test(text)) t.splice(t.indexOf("hilal"), 1);
  // In English, "Al-Hilal" usually means the Saudi club; require a Sudan reference.
  if (t.includes("hilal") && !/[\u0600-\u06FF]/.test(text) && !/omdurman|sudan/i.test(text)) t.splice(t.indexOf("hilal"), 1);
  return t;
}

const TOPICS = [
  ["hum", /aid|famine|hunger|displac|refugee|humanitarian|cholera|malaria|shelter|unicef|wfp|إغاث|مجاع|نازح|لاجئ|إنساني|انساني|المعونات|الكوليرا|الملاريا|مأوى|مشرد/i],
  ["war", /drone|attack|fighting|clash|strike|killed|offensive|army|militia|rsf|مسير|هجوم|معارك|قتال|اشتباك|قصف|مقتل|الجيش|الدعم السريع|ميليشي/i],
  ["eco", /econom|inflation|currency|pound|gold|fuel|price|factory|trade|bank|اقتصاد|التضخم|الجنيه|الذهب|الوقود|أسعار|الأسعار|مصانع|تجار|البنك/i],
  ["reg", /ethiopia|egypt|chad|uae|saudi|south sudan|eritrea|igad|african union|إثيوبيا|اثيوبيا|مصر|تشاد|الإمارات|السعودية|جنوب السودان|إريتريا|إيقاد|الاتحاد الأفريقي/i],
  ["cul", /drama|music|film|art|culture|heritage|الدراما|الفن|ثقاف|التراث|الشعر|رحيل/i],
  ["pol", /.*/]
];
export const topicOf = text => TOPICS.find(([, re]) => re.test(text))[0];

// ---- clustering ----
const STOP = new Set(("the a an of in on to for and or as at by with from after over amid says say said new sudan sudanese sudan's is are was be its it this that into about against than more"
  + " army military rsf war forces paramilitary الجيش الدعم السريع قوات الحرب ميليشيا في من على إلى الى عن مع بعد قبل حول بين هذا هذه التي الذي أن ان ما لا قد كان السودان السودانية السوداني وسط خلال بشأن").split(" "));
function norm(s) {
  return s.toLowerCase()
    .replace(/[ً-ْـ]/g, "")      // Arabic diacritics & tatweel
    .replace(/[إأآا]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}\s]/gu, " ");
}
export function tokens(title) {
  return new Set(norm(title).split(/\s+/).filter(w => w.length > 2 && !STOP.has(w)).map(w => w.replace(/^(وال|بال|فال|كال|ال|و)(?=..)/, "")));
}
function sim(a, b) {
  let inter = 0; for (const x of a) if (b.has(x)) inter++;
  return inter / Math.min(a.size, b.size || 1) * (inter >= 2 ? 1 : 0);
}

// Greedy single-link clustering within one language and a 48h window.
export function cluster(items, threshold = 0.5, { ignoreLang = false, rank = () => 0 } = {}) {
  const clusters = [];
  const sorted = [...items].sort((x, y) => y.ts - x.ts);
  for (const it of sorted) {
    const tk = tokens(it.title);
    let best = null, bestS = 0;
    for (const c of clusters) {
      if (!ignoreLang && c.lang !== it.lang) continue;
      if (Math.abs(c.ts - it.ts) > 48 * 3600e3) continue;
      for (const m of c.members) { const s = sim(tk, m._tk); if (s > bestS) { bestS = s; best = c; } }
    }
    it._tk = tk;
    if (best && bestS >= threshold) best.members.push(it);
    else clusters.push({ lang: it.lang, ts: it.ts, members: [it] });
  }
  for (const c of clusters) {
    // Lead story: preferred outlets first (rank, lower is better), then newest.
    c.members.sort((a, b) => rank(a) - rank(b) || b.ts - a.ts);
    // One entry per outlet per story.
    const seenSrc = new Set();
    c.members = c.members.filter(m => !seenSrc.has(m.src) && seenSrc.add(m.src));
    c.lead = c.members[0];
    c.ts = Math.max(...c.members.map(m => m.ts));
    c.topic = topicOf(c.members.map(m => m.title).join(" "));
    c.sources = new Set(c.members.map(m => m.src)).size;
    for (const m of c.members) delete m._tk;
  }
  return clusters.sort((a, b) => b.ts - a.ts);
}

// Which outlet leads a story when several covered it (lower = first).
// Sudanese outlets first, in this order: Sudan Tribune, Dabanga, Radio Tamazuj, then other Sudanese outlets;
// then international, regional, UN & aid, Israeli, Egyptian state media, Sudanese state media.
const TYPE_RANK = { sd: 0, intl: 1, reg: 2, un: 3, isr: 4, egy: 5, gov: 6 };
const SD_ORDER = { "st-en": 0, "st-ar": 0, "dabanga-en": 1, "dabanga-ar": 1, "tamazuj-en": 2, "tamazuj-ar": 2 };
export const makeRank = typeOf => i => (TYPE_RANK[typeOf(i.src)] ?? 3) * 10 + (SD_ORDER[i.src] ?? 3);
