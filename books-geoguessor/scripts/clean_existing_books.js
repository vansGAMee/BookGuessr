import fs from 'fs';
import path from 'path';

const BOOKS_DIR = path.join(process.cwd(), 'public', 'books');
const MANIFEST_PATH = path.join(process.cwd(), 'public', 'books-manifest.json');

function fixHomoglyphs(text) {
  return text.replace(/[a-zA-Zа-яА-ЯЁё]+/g, (word) => {
    // Distinctive Latin-only consonants/vowels
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

function cleanBookContent(rawText) {
  let text = rawText;

  // Fix mixed Cyrillic/Latin homoglyph typos
  text = fixHomoglyphs(text);

  // Remove any leftover HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Remove leftover &nbsp; or entity leftovers
  text = text.replace(/&nbsp;/gi, ' ');
  text = text.replace(/&#160;/g, ' ');
  text = text.replace(/&amp;/gi, '&');

  // Fix punctuation spacing
  text = text.replace(/\s+([,.:;!?»])/g, '$1');
  text = text.replace(/([«])\s+/g, '$1');

  // Normalize spaces
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\r\n/g, '\n');
  text = text.replace(/\n[ \t]+/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

function run() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  console.log('🧹 CLEANING HOMOGLYPHS IN ALL BOOK FILES WITH ADVANCED SCRIPT DETECTOR...\n');

  for (const book of manifest) {
    const filePath = path.join(BOOKS_DIR, book.file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const cleaned = cleanBookContent(raw);

    fs.writeFileSync(filePath, cleaned, 'utf-8');
    book.charCount = cleaned.length;
    book.wordCount = cleaned.split(/\s+/).filter(Boolean).length;

    console.log(`✅ CLEANED ${book.file}: ${cleaned.length} chars (~${book.wordCount} words)`);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('\n🎉 ALL BOOKS CLEANED SUCCESSFULLY!');
}

run();
