import fs from 'fs';
import path from 'path';
import https from 'https';

const BOOKS_DIR = path.join(process.cwd(), 'public', 'books');
const MANIFEST_PATH = path.join(process.cwd(), 'public', 'books-manifest.json');

if (!fs.existsSync(BOOKS_DIR)) {
  fs.mkdirSync(BOOKS_DIR, { recursive: true });
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'BookGuessrSanitizer/6.0 (contact@bookguessr.app)'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function fetchJson(url) {
  return fetchUrl(url).then(text => JSON.parse(text));
}

async function getWikisourceWikitext(pageTitle) {
  const url = `https://ru.wikisource.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=revisions&rvprop=content&format=json`;
  await delay(100);
  const json = await fetchJson(url);
  const pages = json?.query?.pages;
  if (!pages) return '';
  const pid = Object.keys(pages)[0];
  if (pid === '-1') return '';
  return pages[pid]?.revisions?.[0]?.['*'] || '';
}

function fixHomoglyphs(text) {
  return text.replace(/[a-zA-Zа-яА-ЯЁё]+/g, (word) => {
    // Distinctive Latin-only consonants
    const hasLatinOnly = /[bdfghijklmnpqrstvwxyzBDFGHIJKLMNPQRSTVWXYZ]/.test(word);
    // Distinctive Cyrillic-only letters
    const hasCyrillicOnly = /[бвгджззийклмнптфцчшщъыьэюяБВГДЖЗЗИЙКЛМНПТФЦЧШЩЪЫЬЭЮЯ]/.test(word);

    if (hasLatinOnly && !hasCyrillicOnly) {
      return word
        .replace(/а/g, 'a').replace(/А/g, 'A')
        .replace(/с/g, 'c').replace(/С/g, 'C')
        .replace(/е/g, 'e').replace(/Е/g, 'E')
        .replace(/о/g, 'o').replace(/О/g, 'O')
        .replace(/р/g, 'p').replace(/Р/g, 'P')
        .replace(/х/g, 'x').replace(/Х/g, 'X')
        .replace(/у/g, 'y');
    }

    if (hasCyrillicOnly && !hasLatinOnly) {
      return word
        .replace(/a/g, 'а').replace(/A/g, 'А')
        .replace(/c/g, 'с').replace(/C/g, 'С')
        .replace(/e/g, 'е').replace(/E/g, 'Е')
        .replace(/o/g, 'о').replace(/O/g, 'О')
        .replace(/p/g, 'р').replace(/P/g, 'Р')
        .replace(/x/g, 'х').replace(/X/g, 'Х')
        .replace(/y/g, 'у');
    }

    return word;
  });
}

function cleanWikitext(rawWikitext) {
  if (!rawWikitext) return '';
  let text = rawWikitext;

  // 1. Remove <ref ...>...</ref> AND <ref .../> COMPLETELY (including inner translation/footnote content)
  text = text.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '');
  text = text.replace(/<ref[^>]*\/>/gi, '');

  // 2. Remove <sup>...</sup> and <sub>...</sub> completely (footnote markers)
  text = text.replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, '');
  text = text.replace(/<sub[^>]*>[\s\S]*?<\/sub>/gi, '');

  // 3. Remove all wikitext templates {{...}} recursively
  while (/\{\{[^{}]*\}\}/.test(text)) {
    text = text.replace(/\{\{[^{}]*\}\}/g, '');
  }

  // 4. Remove category links [[Категория:...]] and interwiki links [[en:...]]
  text = text.replace(/\[\[Категория:[^\]]*\]\]/gi, '');
  text = text.replace(/\[\[Category:[^\]]*\]\]/gi, '');
  text = text.replace(/\[\[[a-z]{2,3}:[^\]]*\]\]/gi, '');
  text = text.replace(/^[a-z]{2,3}:.*$/gm, '');

  // 5. Remove [[link|text]] -> text, [[link]] -> link
  text = text.replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, '$1');

  // 6. Decode HTML entities (&nbsp;, &amp;, &quot;, &lt;, &gt;, &#160;, etc.)
  text = text.replace(/&nbsp;/gi, ' ');
  text = text.replace(/&#160;/g, ' ');
  text = text.replace(/&amp;/gi, '&');
  text = text.replace(/&quot;/gi, '"');
  text = text.replace(/&lt;/gi, '<');
  text = text.replace(/&gt;/gi, '>');
  text = text.replace(/&#\d+;/g, ' ');

  // 7. Remove remaining HTML tags <...>
  text = text.replace(/<[^>]+>/g, '');

  // 8. Remove wikitext formatting quotes: '''' -> '', ''' -> '', '' -> ''
  text = text.replace(/'''+/g, '');
  text = text.replace(/''/g, '');

  // 9. Remove section headers == Header ==
  text = text.replace(/={2,6}\s*(.*?)\s*={2,6}/g, '\n\n$1\n\n');

  // 10. Remove MediaWiki magic words & tags
  text = text.replace(/__NOTOC__/g, '');
  text = text.replace(/__NOEDITSECTION__/g, '');

  // 11. Remove footnote bracket markers like [1], [2], [a], [б]
  text = text.replace(/\[\d+\]/g, '');
  text = text.replace(/\[[a-zA-Zа-яА-Я]\]/g, '');

  // 12. Remove residual language annotation labels like (франц.), (нем.), (лат.), (англ.)
  text = text.replace(/\s*\((?:франц|нем|лат|англ|итал|греч|исп)\.\)/gi, '');

  // 13. Remove residual 'Примечания', 'Footnotes', 'Sources' tail sections
  text = text.replace(/\n\s*Примечания[\s\S]*$/gi, '');
  text = text.replace(/\n\s*Источники[\s\S]*$/gi, '');

  // 14. Normalize non-breaking space unicode characters (\u00A0) to standard spaces
  text = text.replace(/\u00A0/g, ' ');
  text = text.replace(/[\u2000-\u200B]/g, ' ');

  // 15. Fix mixed Cyrillic/Latin OCR homoglyph typos (e.g. cени -> сени, vulgаr -> vulgar)
  text = fixHomoglyphs(text);

  // 16. Fix space anomalies before punctuation where incorrect (e.g. "слово ," -> "слово,")
  text = text.replace(/\s+([,.:;!?»])/g, '$1');
  text = text.replace(/([«])\s+/g, '$1');

  // 17. Normalize spaces & newlines
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\r\n/g, '\n');
  text = text.replace(/\n[ \t]+/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

function toRoman(num) {
  const map = [
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  let res = '';
  for (const [val, letter] of map) {
    while (num >= val) {
      res += letter;
      num -= val;
    }
  }
  return res;
}

function getCrimeAndPunishmentChapters() {
  const root = 'Преступление и наказание (Достоевский)';
  const parts = [
    { part: 'Часть I', count: 7 },
    { part: 'Часть II', count: 7 },
    { part: 'Часть III', count: 6 },
    { part: 'Часть IV', count: 6 },
    { part: 'Часть V', count: 5 },
    { part: 'Часть VI', count: 8 }
  ];
  const titles = [];
  for (const p of parts) {
    for (let i = 1; i <= p.count; i++) {
      titles.push(`${root}/${p.part}/Глава ${toRoman(i)}`);
    }
  }
  titles.push(`${root}/Эпилог/I`);
  titles.push(`${root}/Эпилог/II`);
  return titles;
}

const BOOK_SPECS = [
  {
    id: 'crime-and-punishment',
    title: 'Преступление и наказание',
    author: 'Ф. М. Достоевский',
    year: '1866',
    file: 'crime-and-punishment.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Преступление_и_наказание_(Достоевский)',
    chapters: getCrimeAndPunishmentChapters(),
    startAnchor: 'В начале июля',
    endAnchor: 'настоящий рассказ окончен'
  },
  {
    id: 'fathers-and-sons',
    title: 'Отцы и дети',
    author: 'И. С. Тургенев',
    year: '1862',
    file: 'fathers-and-sons.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Отцы_и_дети_(Тургенев)',
    chapters: Array.from({ length: 28 }, (_, i) => `Отцы и дети (Тургенев)/Глава ${i + 1}`),
    startAnchor: 'не видать еще',
    endAnchor: 'жизни бесконечной'
  },
  {
    id: 'hero-of-our-time',
    title: 'Герой нашего времени',
    author: 'М. Ю. Лермонтов',
    year: '1840',
    file: 'hero-of-our-time.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Герой_нашего_времени_(Лермонтов)',
    chapters: [
      'Герой нашего времени (Лермонтов)/СО/Предисловие',
      'Герой нашего времени (Лермонтов)/СО/Бэла',
      'Герой нашего времени (Лермонтов)/СО/Максим Максимыч',
      'Герой нашего времени (Лермонтов)/СО/Журнал Печорина',
      'Герой нашего времени (Лермонтов)/СО/Тамань',
      'Герой нашего времени (Лермонтов)/СО/Княжна Мери',
      'Герой нашего времени (Лермонтов)/СО/Фаталист'
    ],
    startAnchor: 'предисловие есть первая',
    endAnchor: 'рассказал все Максиму Максимычу'
  },
  {
    id: 'captains-daughter',
    title: 'Капитанская дочка',
    author: 'А. С. Пушкин',
    year: '1836',
    file: 'captains-daughter.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Капитанская_дочка_(Пушкин)',
    chapters: Array.from({ length: 14 }, (_, i) => `Капитанская дочка (Пушкин)/1960 (СО)/Глава ${toRoman(i + 1)}`),
    startAnchor: 'Отец мой Андрей Петрович',
    endAnchor: 'некоторые имена'
  },
  {
    id: 'dead-souls',
    title: 'Мёртвые души',
    author: 'Н. В. Гоголь',
    year: '1842',
    file: 'dead-souls.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Мёртвые_души_(Гоголь)',
    chapters: Array.from({ length: 11 }, (_, i) => `Мёртвые души (Гоголь)/Том I/Глава ${toRoman(i + 1)}`),
    startAnchor: 'В ворота гостиницы',
    endAnchor: 'дорогу другие народы и государства'
  },
  {
    id: 'notes-from-underground',
    title: 'Записки из подполья',
    author: 'Ф. М. Достоевский',
    year: '1864',
    file: 'notes-from-underground.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Записки_из_подполья_(Достоевский)',
    chapters: [
      ...Array.from({ length: 11 }, (_, i) => `Записки из подполья (Достоевский)/Часть 1/Глава ${i + 1}`),
      ...Array.from({ length: 10 }, (_, i) => `Записки из подполья (Достоевский)/Часть 2/Глава ${i + 1}`)
    ],
    startAnchor: 'Я человек больной',
    endAnchor: 'здесь можно и остановиться'
  },
  {
    id: 'cherry-orchard',
    title: 'Вишнёвый сад',
    author: 'А. П. Чехов',
    year: '1903',
    file: 'cherry-orchard.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Вишнёвый_сад_(Чехов)',
    chapters: [
      'Вишнёвый сад (Чехов)/Действие первое',
      'Вишнёвый сад (Чехов)/Действие второе',
      'Вишнёвый сад (Чехов)/Действие третье',
      'Вишнёвый сад (Чехов)/Действие четвёртое'
    ],
    startAnchor: 'детскою',
    endAnchor: 'Занавес'
  },
  {
    id: 'eugene-onegin',
    title: 'Евгений Онегин',
    author: 'А. С. Пушкин',
    year: '1833',
    file: 'eugene-onegin.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Евгений_Онегин_(Пушкин)/СС_1959_(СО)',
    chapters: [
      'Евгений Онегин (Пушкин)/СС 1959 (СО)'
    ],
    startAnchor: 'Не мысля гордый свет забавить',
    endAnchor: 'Как я с Онегиным моим'
  }
];

function sanitizeText(rawText, spec) {
  let text = rawText;

  // Trim anything before startAnchor if specified
  if (spec.startAnchor) {
    const idx = text.indexOf(spec.startAnchor);
    if (idx !== -1) {
      const paraStart = text.lastIndexOf('\n', idx);
      text = text.slice(paraStart !== -1 ? paraStart + 1 : idx);
    }
  }

  // Trim anything after endAnchor if specified
  if (spec.endAnchor) {
    const idx = text.lastIndexOf(spec.endAnchor);
    if (idx !== -1) {
      const lineEnd = text.indexOf('\n', idx);
      text = text.slice(0, lineEnd !== -1 ? lineEnd : idx + spec.endAnchor.length);
    }
  }

  // Remove residual interwiki lines at tail
  text = text.replace(/(?:\s*[a-z]{2,3}:[^\n]+)+$/gi, '');
  text = text.replace(/\n\s*Примечания\s*$/gi, '');

  return text.trim();
}

async function run() {
  console.log('🧹 SANITIZING CORPUS WITH ADVANCED MARKUP & HOMOGLYPH STRIPPER\n');
  const manifest = [];

  for (const spec of BOOK_SPECS) {
    console.log(`📖 Fetching ${spec.chapters.length} chapters for "${spec.title}" by ${spec.author}...`);
    const parts = [];
    for (const chTitle of spec.chapters) {
      const raw = await getWikisourceWikitext(chTitle);
      const cleaned = cleanWikitext(raw);
      if (cleaned.length > 50) {
        parts.push(cleaned);
      } else {
        console.warn(`⚠️ Chapter "${chTitle}" returned <50 chars!`);
      }
    }

    const fullRawText = parts.join('\n\n');
    const sanitized = sanitizeText(fullRawText, spec);

    if (sanitized.length < 5000) {
      throw new Error(`CRITICAL: Sanitized text for "${spec.title}" is too short (${sanitized.length} chars). Aborting.`);
    }

    const filePath = path.join(BOOKS_DIR, spec.file);
    fs.writeFileSync(filePath, sanitized, 'utf-8');
    const wordCount = sanitized.split(/\s+/).length;

    console.log(`✅ SAVED PURE AUTHOR TEXT: ${spec.file} (${sanitized.length} chars, ~${wordCount} words)`);
    console.log(`   Start: "${sanitized.slice(0, 90).replace(/\n/g, ' ')}..."`);
    console.log(`   End:   "...${sanitized.slice(-90).replace(/\n/g, ' ')}"`);

    manifest.push({
      id: spec.id,
      title: spec.title,
      author: spec.author,
      year: spec.year,
      file: spec.file,
      sourceName: spec.sourceName,
      sourceUrl: spec.sourceUrl,
      charCount: sanitized.length,
      wordCount: wordCount
    });
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n🎉 SANITIZATION COMPLETE: ${manifest.length} books successfully cleaned.`);
}

run().catch(err => {
  console.error('❌ FATAL:', err);
  process.exit(1);
});
