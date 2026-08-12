import fs from 'fs';
import path from 'path';

const BOOKS_DIR = path.join(process.cwd(), 'public', 'books');
const MANIFEST_PATH = path.join(process.cwd(), 'public', 'books-manifest.json');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('❌ Manifest not found:', MANIFEST_PATH);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

/**
 * Replicate exact gameplay excerpt extraction logic from src/lib/excerptExtractor.ts
 */
function extractExcerpt(text, targetPositionRatio) {
  const charCount = text.length;
  const targetIndex = Math.floor(charCount * targetPositionRatio);

  const paragraphs = text.split(/\n+/);
  let currentIndex = 0;
  let chosenParaIndex = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const paraLen = paragraphs[i].length + 1;
    if (currentIndex + paraLen >= targetIndex) {
      chosenParaIndex = i;
      break;
    }
    currentIndex += paraLen;
  }

  let excerptParas = [paragraphs[chosenParaIndex]];
  let wordCount = excerptParas[0].trim().split(/\s+/).filter(Boolean).length;

  let next = chosenParaIndex + 1;
  let prev = chosenParaIndex - 1;

  while (wordCount < 250 && (next < paragraphs.length || prev >= 0)) {
    if (next < paragraphs.length) {
      const nextWords = paragraphs[next].trim().split(/\s+/).filter(Boolean).length;
      excerptParas.push(paragraphs[next]);
      wordCount += nextWords;
      next++;
    }
    if (wordCount >= 350) break;
    if (prev >= 0) {
      const prevWords = paragraphs[prev].trim().split(/\s+/).filter(Boolean).length;
      excerptParas.unshift(paragraphs[prev]);
      wordCount += prevWords;
      prev--;
    }
  }

  return excerptParas.join('\n\n').trim();
}

/**
 * Forbidden rules list for corpus validation
 */
const FORBIDDEN_RULES = [
  { name: 'HTML entity &nbsp;', regex: /&nbsp;/i },
  { name: 'HTML entity &amp;/&quot;', regex: /&(amp|quot|lt|gt|#\d+);/i },
  { name: 'HTML tag <...>', regex: /<\/?[a-z0-9]+[^>]*>/i },
  { name: 'Wikitext quotes \'\' or \'\'\'', regex: /''/ },
  { name: 'Wikitext template {{ or }}', regex: /\{\{|\}\}/ },
  { name: 'Wikitext link [[ or ]]', regex: /\[\[|\]\]/ },
  { name: 'Wikitext header ==', regex: /={2,6}/ },
  { name: 'Language label (франц.)', regex: /\(франц\.\)/i },
  { name: 'Language label (нем.)', regex: /\(нем\.\)/i },
  { name: 'Language label (лат.)', regex: /\(лат\.\)/i },
  { name: 'Language label (англ.)', regex: /\(англ\.\)/i },
  { name: 'Footnote marker [1]', regex: /\[\d+\]/ },
  { name: 'MediaWiki magic word NOTOC', regex: /__NOTOC__/ },
  { name: 'Glued Cyrillic onto Latin word (e.g. perlesСеро)', regex: /[a-zA-Z][а-яА-Я]/ },
  { name: 'Glued Cyrillic onto Latin word (e.g. perlesсеро)', regex: /[a-z][а-я]/ },
  { name: 'Metadata or URL', regex: /(https?:\/\/|Wikisource|Викитека|az\.lib\.ru|Gutenberg)/i }
];

let totalPassed = 0;
let totalFailed = 0;

console.log('🧪 VALIDATING BOOK CORPUS QUALITY (30 SAMPLES PER BOOK)...');

for (const book of manifest) {
  const filePath = path.join(BOOKS_DIR, book.file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing text file for ${book.title}: ${book.file}`);
    process.exit(1);
  }

  const text = fs.readFileSync(filePath, 'utf-8');
  console.log(`\n📖 Validating "${book.title}" (${text.length} chars, ${book.wordCount} words)...`);

  let bookErrors = 0;

  // Sample 30 random positions between 0.05 and 0.95
  for (let sampleIdx = 1; sampleIdx <= 30; sampleIdx++) {
    const ratio = 0.05 + (sampleIdx / 31) * 0.90;
    const excerpt = extractExcerpt(text, ratio);

    if (!excerpt || excerpt.length < 100) {
      console.error(`❌ SAMPLE #${sampleIdx} (ratio ${ratio.toFixed(2)}) is too short (${excerpt.length} chars)`);
      bookErrors++;
      continue;
    }

    for (const rule of FORBIDDEN_RULES) {
      if (rule.regex.test(excerpt)) {
        const match = excerpt.match(rule.regex);
        console.error(`❌ SAMPLE #${sampleIdx} FAILED RULE "${rule.name}"`);
        console.error(`   Found match: "${match[0]}"`);
        console.error(`   Excerpt snippet: "${excerpt.slice(0, 150).replace(/\n/g, ' ')}..."`);
        bookErrors++;
        break;
      }
    }
  }

  if (bookErrors === 0) {
    console.log(`✅ ALL 30 SAMPLES PASSED PERFECTLY FOR "${book.title}"`);
    totalPassed++;
  } else {
    console.error(`❌ "${book.title}" HAD ${bookErrors} FAILED SAMPLES`);
    totalFailed++;
  }
}

console.log(`\n--------------------------------------------------`);
console.log(`RESULTS: ${totalPassed} books passed, ${totalFailed} books failed.`);

if (totalFailed > 0) {
  console.error('❌ CORPUS VALIDATION FAILED!');
  process.exit(1);
} else {
  console.log('🎉 CORPUS VALIDATION PASSED 100% CLEAN!');
}
