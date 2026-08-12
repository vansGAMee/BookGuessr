import http from 'http';

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('🧪 Running automated E2E static asset verification against http://localhost:4173 ...');

  // 1. Test HTML
  const html = await httpGet('http://localhost:4173/');
  if (html.status !== 200 || !html.body.includes('<div id="root">')) {
    throw new Error(`HTML check failed: status ${html.status}`);
  }
  console.log('✅ PASS: Index HTML loaded');

  // 2. Test Manifest
  const manifest = await httpGet('http://localhost:4173/books-manifest.json');
  if (manifest.status !== 200) {
    throw new Error(`Manifest check failed: status ${manifest.status}`);
  }
  const books = JSON.parse(manifest.body);
  if (!Array.isArray(books) || books.length < 5) {
    throw new Error(`Manifest must have >= 5 books, found ${books.length}`);
  }
  console.log(`✅ PASS: Manifest loaded with ${books.length} public domain books`);

  // 3. Test Book files
  for (const book of books) {
    const bookRes = await httpGet(`http://localhost:4173/books/${book.file}`);
    if (bookRes.status !== 200 || bookRes.body.length < 5000) {
      throw new Error(`Failed to load text for ${book.title} (status ${bookRes.status}, len ${bookRes.body.length})`);
    }
    console.log(`  • [PASS] "${book.title}" (${bookRes.body.length} chars)`);
  }

  console.log('\n🎉 ALL E2E STATIC CHECKS PASSED PERFECTLY!');
}

run().catch(err => {
  console.error('❌ E2E FAIL:', err);
  process.exit(1);
});
