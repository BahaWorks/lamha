export const PAGES = ["news", "official", "sports", "stays", "sources", "about"];
export const pagePath = (lang, page) => `/${lang}/${page === "news" ? "" : page + "/"}`;

export const T = {
  en: {
    dir: "ltr", locale: "en-GB", ogLocale: "en_US", other: "ar", otherLabel: "عربي",
    brandWm: 'Lamha <span>· لمحة</span>', tagline: "Sudan news at a glance",
    nav: { news: "News", official: "Official", sports: "Sports", stays: "Stays", sources: "Sources", about: "About" },
    eyebrow: { news: "Sudan news aggregator", official: "Statements & communiqués", sports: "Sudanese football", stays: "Where to stay", sources: "Transparency", about: "About Lamha" },
    title: { news: "Sudan, at a glance", official: "Official statements on Sudan", sports: "Al-Hilal, Al-Merrikh & the national team", stays: "Hotels in Khartoum and Port Sudan", sources: "Every source we read", about: "Independent. Unaffiliated. Linked to the source." },
    lede: {
      news: "Headlines from Sudanese, regional and international outlets in one place. Every story links to the publisher that reported it.",
      official: "Statements from governments, regional bodies and Sudanese institutions, shown in English and Arabic. Translated titles are marked.",
      sports: "Club and national team news from Sudanese and Arab sports media.",
      stays: "Hotels in Sudan's main cities, with direct links to each hotel. Check current conditions before you travel.",
      sources: "Lamha shows you who reported each story. These are the publishers and institutions we follow.",
      about: "What Lamha is, and what it is not."
    },
    docTitle: {
      news: "Lamha · Sudan news today from local and international sources",
      official: "Official statements on Sudan: US, UK, EU, AU, IGAD, Sudan government · Lamha",
      sports: "Al-Hilal, Al-Merrikh & Sudan national team news · Lamha",
      stays: "Hotels in Khartoum & Port Sudan · Lamha",
      sources: "Our sources: Sudanese, regional and international news · Lamha",
      about: "About Lamha, an independent Sudan news aggregator"
    },
    metaDesc: {
      news: "Latest Sudan news in English from Sudanese, regional and international outlets, grouped by story so you can compare coverage. Updated throughout the day.",
      official: "Official statements on Sudan from the US State Department, UK FCDO, France, the EU, African Union, IGAD and the Sudanese government, in English and Arabic.",
      sports: "Latest news on Al-Hilal Omdurman, Al-Merrikh and Sudan's national football team, the Falcons of Jediane.",
      stays: "Hotels in Khartoum and Port Sudan with addresses, contacts and links, plus official travel advisories for Sudan.",
      sources: "The full list of Sudanese, regional, international and official sources Lamha aggregates, with labels for state-affiliated media.",
      about: "Lamha is an independent, unaffiliated news aggregator for Sudan. Every headline links to its original publisher."
    },
    lastUp: "Last updated", gmt: "GMT", stat: (n, s) => `<b>${n}</b> headlines · <b>${s}</b> sources`,
    briefH: "Today in brief", briefNote: "Compiled from the headlines below. Each point links to the source coverage.",
    topStory: "Most covered story", topStoryNote: "How different outlets reported it", sourcesN: n => `${n} sources`,
    allHeadlines: "All headlines", countNote: n => `${n} stories`, today: "Today", yesterday: "Yesterday", earlier: "Earlier",
    all: "All", allSrc: "All sources", search: "Search headlines…",
    also: n => `${n} more ${n === 1 ? "report" : "reports"} on this story`, none: "No headlines match these filters.",
    trFromAr: "Translated from Arabic", trFromEn: "Translated from English", via: "via",
    types: { sd: "Sudanese", intl: "International", reg: "Regional", un: "UN & aid", gov: "State media", egy: "Egyptian state media", off: "Official", sport: "Sports" },
    topics: { pol: "Politics", war: "Conflict", hum: "Humanitarian", eco: "Economy", reg: "Region", cul: "Culture" },
    issuers: "All issuers",
    teams: { hilal: ["Al-Hilal", "Omdurman · Blue"], merrikh: ["Al-Merrikh", "Omdurman · Red"], nat: ["National team", "Falcons of Jediane"] },
    stayNotice: '<b>Before you travel.</b> <span>Sudan is in active conflict and several governments advise against all travel. Hotels in Khartoum may have limited or suspended service. Contact the hotel directly to confirm it is open.</span><span>Advisories: <a href="https://travel.state.gov/en/international-travel/travel-advisories/sudan.html" target="_blank" rel="noopener">US State Department</a> · <a href="https://www.gov.uk/foreign-travel-advice/sudan" target="_blank" rel="noopener">UK FCDO</a></span>',
    cities: { khartoum: ["Khartoum", "On the Nile"], port: ["Port Sudan", "Red Sea coast"] },
    site: "Website", copied: "Phone number copied", toConfirm: "Details to be confirmed with the hotel",
    colName: "Source", colType: "Type", colLang: "Language", colStatus: "In this edition", live: "No recent items", paywall: "Paywalled",
    tbl: { en: "English news sources", ar: "Arabic news sources", off: "Official sources (English & Arabic)", sport: "Sports sources" },
    aboutP: [
      "Lamha is an independent news aggregator for Sudan. It gathers headlines from Sudanese, regional and international news outlets, together with official statements from governments and international organisations, in English and Arabic. The feed is updated throughout the day.",
      "Lamha does not write the news and does not take sides. It is not owned by, funded by or affiliated with any government, political party, armed group or foreign state. Every headline carries the name of its publisher and links to the original article, so readers can compare how different outlets cover the same event and decide for themselves.",
      "Where an outlet is state-owned or state-affiliated, Lamha labels it. When several outlets report the same story, Lamha groups them together so the range of coverage is visible in one place."
    ],
    princ: [["Source on every headline", "Each item names its publisher and opens the original article."], ["Many voices, side by side", "Stories covered by several outlets are grouped for comparison."], ["Clear labels", "State media and official sources are marked as such."], ["No commentary", "Lamha selects and organises. It does not rewrite, editorialise or rank sides."]],
    contact: "Corrections and feedback",
    foot: "Lamha links to original publishers and does not host their articles. Headlines remain the property of their publishers.",
    chooser: "Choose your language"
  },
  ar: {
    dir: "rtl", locale: "ar-SD-u-nu-latn", ogLocale: "ar_SD", other: "en", otherLabel: "EN",
    brandWm: 'لمحة <span>· Lamha</span>', tagline: "أخبار السودان في لمحة",
    nav: { news: "الأخبار", official: "بيانات رسمية", sports: "الرياضة", stays: "الإقامة", sources: "المصادر", about: "عن لمحة" },
    eyebrow: { news: "مجمّع أخبار السودان", official: "بيانات وتصريحات رسمية", sports: "الكرة السودانية", stays: "أماكن الإقامة", sources: "الشفافية", about: "عن لمحة" },
    title: { news: "السودان في لمحة", official: "البيانات الرسمية بشأن السودان", sports: "الهلال والمريخ والمنتخب الوطني", stays: "فنادق الخرطوم وبورتسودان", sources: "كل المصادر التي نتابعها", about: "مستقل. غير منحاز. مرتبط بالمصدر." },
    lede: {
      news: "عناوين من المنافذ السودانية والإقليمية والدولية في مكان واحد، وكل خبر مرتبط بالناشر الذي أورده.",
      official: "بيانات الحكومات والمنظمات الإقليمية والمؤسسات السودانية بالعربية والإنجليزية، مع توضيح العناوين المترجمة.",
      sports: "أخبار الأندية والمنتخب من الإعلام الرياضي السوداني والعربي.",
      stays: "فنادق في أهم مدن السودان مع روابط مباشرة لكل فندق. تحقق من الأوضاع الحالية قبل السفر.",
      sources: "تُظهر لمحة مصدر كل خبر. هذه هي المنافذ والمؤسسات التي نتابعها.",
      about: "ما هي لمحة، وما ليست هي."
    },
    docTitle: {
      news: "لمحة · أخبار السودان اليوم من مصادر محلية ودولية",
      official: "البيانات الرسمية بشأن السودان: الخارجية الأمريكية والبريطانية والاتحاد الأوروبي والأفريقي وإيقاد · لمحة",
      sports: "أخبار الهلال والمريخ ومنتخب السودان · لمحة",
      stays: "فنادق الخرطوم وبورتسودان · لمحة",
      sources: "مصادرنا: الإعلام السوداني والإقليمي والدولي · لمحة",
      about: "عن لمحة، مجمّع أخبار السودان المستقل"
    },
    metaDesc: {
      news: "آخر أخبار السودان بالعربية من المنافذ السودانية والإقليمية والدولية، مجمّعة حسب الخبر لمقارنة التغطيات. تُحدَّث على مدار اليوم.",
      official: "البيانات الرسمية بشأن السودان من الخارجية الأمريكية والبريطانية والفرنسية والاتحاد الأوروبي والاتحاد الأفريقي وإيقاد والحكومة السودانية.",
      sports: "آخر أخبار الهلال أم درمان والمريخ ومنتخب السودان لكرة القدم صقور الجديان.",
      stays: "فنادق الخرطوم وبورتسودان مع العناوين وأرقام التواصل والروابط، وتحذيرات السفر الرسمية.",
      sources: "القائمة الكاملة للمصادر السودانية والإقليمية والدولية والرسمية التي تجمعها لمحة، مع وسم الإعلام الرسمي.",
      about: "لمحة مجمّع أخبار مستقل وغير تابع لأي جهة، وكل عنوان فيه مرتبط بناشره الأصلي."
    },
    lastUp: "آخر تحديث", gmt: "بتوقيت غرينتش", stat: (n, s) => `<b>${n}</b> عنواناً · <b>${s}</b> مصدراً`,
    briefH: "موجز اليوم", briefNote: "مُستخلص من العناوين أدناه، وكل نقطة مرتبطة بتغطية مصادرها.",
    topStory: "الخبر الأكثر تغطية", topStoryNote: "كيف تناولته المنافذ المختلفة", sourcesN: n => `${n} مصادر`,
    allHeadlines: "كل العناوين", countNote: n => `${n} خبراً`, today: "اليوم", yesterday: "أمس", earlier: "في وقت سابق",
    all: "الكل", allSrc: "كل المصادر", search: "ابحث في العناوين…",
    also: n => `${n} ${n === 1 ? "تغطية أخرى" : "تغطيات أخرى"} لهذا الخبر`, none: "لا توجد عناوين تطابق هذا الاختيار.",
    trFromAr: "مترجم من العربية", trFromEn: "مترجم من الإنجليزية", via: "عبر",
    types: { sd: "سوداني", intl: "دولي", reg: "إقليمي", un: "أممي وإنساني", gov: "إعلام رسمي", egy: "إعلام مصري رسمي", off: "جهة رسمية", sport: "رياضي" },
    topics: { pol: "سياسة", war: "النزاع", hum: "إنساني", eco: "اقتصاد", reg: "إقليمي", cul: "ثقافة" },
    issuers: "كل الجهات",
    teams: { hilal: ["الهلال", "أم درمان · الأزرق"], merrikh: ["المريخ", "أم درمان · الأحمر"], nat: ["المنتخب الوطني", "صقور الجديان"] },
    stayNotice: '<b>قبل السفر.</b> <span>يشهد السودان نزاعاً مسلحاً، وتنصح عدة حكومات بعدم السفر إليه. قد تكون خدمات فنادق الخرطوم محدودة أو متوقفة، لذا تواصل مع الفندق مباشرة للتأكد من أنه يعمل.</span><span>تحذيرات السفر: <a href="https://travel.state.gov/en/international-travel/travel-advisories/sudan.html" target="_blank" rel="noopener">الخارجية الأمريكية</a> · <a href="https://www.gov.uk/foreign-travel-advice/sudan" target="_blank" rel="noopener">الخارجية البريطانية</a></span>',
    cities: { khartoum: ["الخرطوم", "على ضفاف النيل"], port: ["بورتسودان", "ساحل البحر الأحمر"] },
    site: "الموقع", copied: "تم نسخ رقم الهاتف", toConfirm: "التفاصيل تُؤكَّد مع الفندق",
    colName: "المصدر", colType: "النوع", colLang: "اللغة", colStatus: "في هذه النشرة", live: "لا جديد حالياً", paywall: "باشتراك",
    tbl: { en: "المصادر الإخبارية الإنجليزية", ar: "المصادر الإخبارية العربية", off: "المصادر الرسمية (عربي وإنجليزي)", sport: "المصادر الرياضية" },
    aboutP: [
      "لمحة مُجمِّع أخبار مستقل للسودان. يجمع العناوين من المنافذ الإخبارية السودانية والإقليمية والدولية، إلى جانب البيانات الرسمية للحكومات والمنظمات الدولية، باللغتين العربية والإنجليزية، ويُحدَّث على مدار اليوم.",
      "لا تكتب لمحة الأخبار ولا تنحاز لأي طرف، وليست مملوكة أو ممولة أو تابعة لأي حكومة أو حزب سياسي أو جماعة مسلحة أو دولة أجنبية. يحمل كل عنوان اسم ناشره ويرتبط بالمقال الأصلي، ليقارن القارئ كيف تناولت المنافذ المختلفة الحدث نفسه ويحكم بنفسه.",
      "تُوسم المنافذ المملوكة للدولة أو المرتبطة بها بوضوح، وعندما تتناول عدة منافذ الخبر نفسه تجمعها لمحة معاً لتظهر تعددية التغطية في مكان واحد."
    ],
    princ: [["المصدر مع كل عنوان", "كل خبر يحمل اسم ناشره ويفتح المقال الأصلي."], ["أصوات متعددة جنباً إلى جنب", "تُجمع تغطيات المنافذ المختلفة للخبر الواحد للمقارنة."], ["وسوم واضحة", "يُميَّز الإعلام الرسمي والجهات الرسمية بوسوم صريحة."], ["بلا تعليق", "لمحة تختار وتنظّم، ولا تعيد الصياغة أو تعلّق أو تفاضل بين الأطراف."]],
    contact: "للتصحيحات والملاحظات",
    foot: "تربط لمحة بالناشرين الأصليين ولا تستضيف مقالاتهم، وتبقى العناوين ملكاً لناشريها.",
    chooser: "اختر اللغة"
  }
};
