import fs from 'fs';
import path from 'path';
import https from 'https';

const BOOKS_DIR = path.join(process.cwd(), 'public', 'books');
const MANIFEST_PATH = path.join(process.cwd(), 'public', 'books-manifest.json');

if (!fs.existsSync(BOOKS_DIR)) {
  fs.mkdirSync(BOOKS_DIR, { recursive: true });
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const TARGET_BOOKS = [
  {
    id: 'crime-and-punishment',
    title: 'Преступление и наказание',
    author: 'Ф. М. Достоевский',
    year: '1866',
    file: 'crime-and-punishment.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Преступление_и_наказание_(Достоевский)',
    rootTitle: 'Преступление и наказание (Достоевский)'
  },
  {
    id: 'fathers-and-sons',
    title: 'Отцы и дети',
    author: 'И. С. Тургенев',
    year: '1862',
    file: 'fathers-and-sons.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Отцы_и_дети_(Тургенев)',
    rootTitle: 'Отцы и дети (Тургенев)'
  },
  {
    id: 'hero-of-our-time',
    title: 'Герой нашего времени',
    author: 'М. Ю. Лермонтов',
    year: '1840',
    file: 'hero-of-our-time.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Герой_нашего_времени_(Лермонтов)',
    rootTitle: 'Герой нашего времени (Лермонтов)'
  },
  {
    id: 'captains-daughter',
    title: 'Капитанская дочка',
    author: 'А. С. Пушкин',
    year: '1836',
    file: 'captains-daughter.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Капитанская_дочка_(Пушкин)',
    rootTitle: 'Капитанская дочка (Пушкин)'
  },
  {
    id: 'dead-souls',
    title: 'Мёртвые души',
    author: 'Н. В. Гоголь',
    year: '1842',
    file: 'dead-souls.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Мёртвые_души_(Гоголь)',
    rootTitle: 'Мёртвые души (Гоголь)'
  },
  {
    id: 'notes-from-underground',
    title: 'Записки из подполья',
    author: 'Ф. М. Достоевский',
    year: '1864',
    file: 'notes-from-underground.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Записки_из_подполья_(Достоевский)',
    rootTitle: 'Записки из подполья (Достоевский)'
  },
  {
    id: 'cherry-orchard',
    title: 'Вишнёвый сад',
    author: 'А. П. Чехов',
    year: '1903',
    file: 'cherry-orchard.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Вишнёвый_сад_(Чехов)',
    rootTitle: 'Вишнёвый сад (Чехов)'
  },
  {
    id: 'eugene-onegin',
    title: 'Евгений Онегин',
    author: 'А. С. Пушкин',
    year: '1833',
    file: 'eugene-onegin.txt',
    sourceName: 'Викитека / Общественное достояние',
    sourceUrl: 'https://ru.wikisource.org/wiki/Евгений_Онегин_(Пушкин)',
    rootTitle: 'Евгений Онегин (Пушкин)'
  }
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'BookGuessrFetcher/1.0 (contact@bookguessr.org)' }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function getSubpages(rootTitle) {
  const titles = [];
  const url = `https://ru.wikisource.org/w/api.php?action=query&list=prefixsearch&pssearch=${encodeURIComponent(rootTitle)}/&pslimit=100&format=json`;
  await delay(150);
  const json = await fetchJson(url);
  const results = json?.query?.prefixsearch || [];
  for (const r of results) {
    titles.push(r.title);
  }
  return titles;
}

async function getRawWikitext(pageTitle) {
  const url = `https://ru.wikisource.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=revisions&rvprop=content&format=json`;
  await delay(150);
  const json = await fetchJson(url);
  const pages = json?.query?.pages;
  if (!pages) return '';
  const pid = Object.keys(pages)[0];
  if (pid === '-1') return '';
  return pages[pid]?.revisions?.[0]?.['*'] || '';
}

function cleanWikitext(wikiText) {
  if (!wikiText) return '';
  let text = wikiText;
  
  // Remove templates like {{...}} recursively / nested
  while (/\{\{[^{}]*\}\}/.test(text)) {
    text = text.replace(/\{\{[^{}]*\}\}/g, '');
  }

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Remove category links
  text = text.replace(/\[\[Категория:[^\]]*\]\]/gi, '');
  text = text.replace(/\[\[Category:[^\]]*\]\]/gi, '');

  // Remove [[link|text]] -> text, [[link]] -> link
  text = text.replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, '$1');

  // Remove headers === Header ===
  text = text.replace(/={2,6}\s*(.*?)\s*={2,6}/g, '\n\n');

  // Normalize linebreaks
  text = text.replace(/\r\n/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

function parseRoman(str) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let num = 0;
  for (let i = 0; i < str.length; i++) {
    const curr = map[str[i].toUpperCase()] || 0;
    const next = map[str[i + 1]?.toUpperCase()] || 0;
    if (curr < next) num -= curr;
    else num += curr;
  }
  return num || 0;
}

function getSortKey(title) {
  const parts = title.split('/');
  let score = 0;
  parts.forEach((p, idx) => {
    const roman = p.match(/\b([IVXLCDM]+)\b/i);
    const num = p.match(/\b(\d+)\b/);
    let val = 0;
    if (roman) val = parseRoman(roman[1]);
    else if (num) val = parseInt(num[1], 10);
    score += val * Math.pow(100, 3 - idx);
  });
  return score;
}

async function run() {
  console.log('🚀 Downloading full public domain texts for 8 classic Russian books...');
  const manifest = [];

  for (const book of TARGET_BOOKS) {
    console.log(`\n📖 Fetching "${book.title}"...`);
    let subpages = await getSubpages(book.rootTitle);
    subpages = subpages.sort((a, b) => getSortKey(a) - getSortKey(b));

    let textChunks = [];

    if (subpages.length === 0) {
      const raw = await getRawWikitext(book.rootTitle);
      const cleaned = cleanWikitext(raw);
      if (cleaned) textChunks.push(cleaned);
    } else {
      console.log(`Processing ${subpages.length} subpages for ${book.title}...`);
      for (const sp of subpages) {
        if (sp.toLowerCase().includes('содержание') || sp.toLowerCase().includes('оглавление')) continue;
        const raw = await getRawWikitext(sp);
        const cleaned = cleanWikitext(raw);
        if (cleaned.length > 200) {
          textChunks.push(cleaned);
        }
      }
    }

    const fullText = textChunks.join('\n\n');
    if (fullText.length < 5000) {
      console.error(`⚠️ Failed to download full text for ${book.title} (${fullText.length} chars).`);
      continue;
    }

    const filePath = path.join(BOOKS_DIR, book.file);
    fs.writeFileSync(filePath, fullText, 'utf-8');
    const wordCount = fullText.split(/\s+/).length;

    console.log(`✨ Saved ${book.file}: ${fullText.length} chars (~${wordCount} words)`);

    manifest.push({
      id: book.id,
      title: book.title,
      author: book.author,
      year: book.year,
      file: book.file,
      sourceName: book.sourceName,
      sourceUrl: book.sourceUrl,
      charCount: fullText.length,
      wordCount: wordCount
    });
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n🎉 DONE! Manifest created with ${manifest.length} books.`);
}

run().catch(console.error);
