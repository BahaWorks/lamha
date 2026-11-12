# لمحة · Lamha

مجمّع أخبار السودان المستقل بالعربية والإنجليزية. موقع ثابت (Static) سريع، بدون قاعدة بيانات وبدون مكتبات خارجية، يُعاد بناؤه تلقائياً على مدار اليوم ويُنشر مجاناً على Cloudflare Pages.

---

## ما الموجود في المشروع

| المجلد / الملف | ماذا يفعل |
|---|---|
| `config/site.json` | إعدادات الموقع: **النطاق** (`siteUrl`)، بريد التواصل، إعدادات الذكاء الاصطناعي |
| `config/sources.json` | كل المصادر (الإخبارية، الرسمية، الرياضية) وروابط خلاصاتها |
| `data/hotels.json` | الفنادق في صفحة الإقامة. عدّلها مباشرة |
| `data/official-pinned.json` | بيانات رسمية مثبتة تظهر دائماً في صفحة البيانات الرسمية |
| `src/` | كود البناء: جلب الأخبار، الفلترة، تجميع الخبر الواحد من عدة مصادر، توليد الصفحات |
| `static/` | التصميم (CSS)، السكربت الصغير، الشعار، صور المشاركة |
| `.github/workflows/update.yml` | التحديث التلقائي والنشر |
| `dist/` | الموقع النهائي بعد البناء (لا تعدّله يدوياً) |

## الصفحات

`/ar/` و`/en/` لكل قسم: الأخبار، البيانات الرسمية، الرياضة، الإقامة، المصادر، عن لمحة.
الصفحة الرئيسية `/` توجّه الزائر للغته تلقائياً.

---

## خطوات الإطلاق (مرة واحدة)

### 1. النطاق
- اشترِ النطاق (`lamha-sd.com`). **تنبيه:** `lamha.com` محجوز ويعمل لشركة أخرى.
- افتح `config/site.json` وغيّر `siteUrl` إلى نطاقك، و`contactEmail` إلى بريدك.

### 2. GitHub
المستودع: `github.com/BahaWorks/lamha`. سير العمل **Update headlines** يجلب الأخبار كل 3 ساعات ويحفظها في مجلد `data/`.

### 3. Cloudflare Pages
- **Workers & Pages → Create → Pages → Connect to Git**، واختر `BahaWorks/lamha`.
- **Build command:** `node src/build.mjs --render`
- **Build output directory:** `dist`
- **Environment variable:** `NODE_VERSION` = `22`
- بعد أول نشر: **Custom domains → Set up a custom domain** وأضف `lamha-sd.com` و`www.lamha-sd.com`.

كل تحديث للأخبار أو تعديل في الكود يُنشر تلقائياً.

### 4. الترجمة وموجز اليوم (اختياري)
- بدون هذه الخطوة يعمل الموقع كاملاً، لكن البيانات الرسمية والأخبار الرياضية تظهر بلغتها الأصلية فقط، ولا يظهر «موجز اليوم».
- لتفعيلهما: أنشئ مفتاح API من console.anthropic.com، ثم في GitHub: **Settings → Secrets and variables → Actions → New repository secret** باسم `ANTHROPIC_API_KEY`.
- التكلفة بسيطة لأن الترجمات تُحفظ ولا تُعاد.

---

## الظهور في محركات البحث (SEO)

**ما هو جاهز في الكود:**
- صفحة مستقلة لكل قسم بكل لغة، مع عنوان ووصف مكتوبين لكل صفحة.
- روابط `hreflang` بين النسختين العربية والإنجليزية، ورابط `canonical`.
- بيانات منظمة (Schema.org) للموقع والمؤسسة وقوائم الأخبار والفنادق.
- `sitemap.xml` و`robots.txt` وخلاصة RSS لكل لغة.
- صور مشاركة لفيسبوك وواتساب وX، وموقع سريع جداً لأنه ثابت.

**ما عليك فعله بعد الإطلاق:**
1. سجّل الموقع في **Google Search Console** (search.google.com/search-console) وأضف `https://نطاقك/sitemap.xml`.
2. افعل الشيء نفسه في **Bing Webmaster Tools** (يغطي Bing وDuckDuckGo وYahoo).
3. شارك الرابط في صفحاتك ومجموعاتك. الروابط الخارجية تسرّع الفهرسة.
4. **الأهم للترتيب:** جوجل يرتّب منخفضاً المواقع التي تعرض عناوين الآخرين فقط. «موجز اليوم» وأي محتوى أصلي تضيفه (صفحات موضوعات، شروحات) هو ما يرفع ترتيب لمحة.

---

## الصيانة اليومية

- **التحديث تلقائي** ولا يحتاج تدخلاً.
- **إضافة مصدر:** أضف سطراً في `config/sources.json` بنفس شكل الأسطر الموجودة.
- **فحص المصادر:** على جهازك نفّذ `npm run check-feeds` لترى أي المصادر تعمل.
- **تعديل الفنادق:** عدّل `data/hotels.json`، ويُعاد النشر تلقائياً.

### ملاحظة عن المصادر
- بعض المواقع ليس لها خلاصة RSS عامة، فيستخدم الموقع بحث Google News كبديل لجلب عناوينها.
- بعض المواقع تمنع القراءة الآلية، مثل **كفر ووتر**. لهذه يُفضَّل التواصل معها لطلب خلاصة RSS أو إذن.
- لمحة تعرض العنوان والرابط فقط ولا تنسخ المقالات.

---

## For developers

Zero-dependency Node ≥ 20 static site generator.

```bash
npm run build:offline   # build dist/ from fixtures (no network)
npm run build           # fetch all feeds and build dist/
npm run check-feeds     # report which feeds return items
npm run preview         # serve dist/ at http://localhost:8080
```

Pipeline: `src/feeds.mjs` (fetch + RSS/Atom parse, Google News fallback) → `src/classify.mjs` (Sudan/teams relevance, topics, title-similarity clustering) → optional `src/ai.mjs` (translations, neutral daily brief; needs `ANTHROPIC_API_KEY`) → `src/render.mjs` (bilingual HTML, sitemap, RSS) → `dist/`. Headline history is kept in `data/items.json` (7 days) and committed back by the workflow.
