import { BookMeta } from '../types';

const bookCache = new Map<string, string>();
let cachedManifest: BookMeta[] | null = null;

export async function fetchManifest(): Promise<BookMeta[]> {
  if (cachedManifest) return cachedManifest;
  try {
    const res = await fetch('/books-manifest.json');
    if (!res.ok) {
      throw new Error(`Failed to load books manifest (${res.status})`);
    }
    const data: BookMeta[] = await res.json();
    cachedManifest = data;
    return data;
  } catch (err) {
    console.error('Error fetching manifest:', err);
    throw err;
  }
}

export async function fetchBookText(book: BookMeta): Promise<string> {
  if (bookCache.has(book.id)) {
    return bookCache.get(book.id)!;
  }
  try {
    const res = await fetch(`/books/${book.file}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch book ${book.title} (${res.status})`);
    }
    const text = await res.text();
    bookCache.set(book.id, text);
    return text;
  } catch (err) {
    console.error(`Error loading book text for ${book.id}:`, err);
    throw err;
  }
}
