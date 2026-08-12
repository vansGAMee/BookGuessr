import { BookExcerpt } from '../types';

/**
 * Extracts a clean reading excerpt (~250-400 words / 1400-2400 chars) from a full book text.
 * Ensures boundaries align with paragraph or sentence endings and avoids the first 3% and last 3% of text.
 */
export function extractRandomExcerpt(fullText: string, targetWordCount: number = 320): BookExcerpt {
  const totalLen = fullText.length;
  if (totalLen < 1000) {
    throw new Error('Book text is too short to extract a valid excerpt.');
  }

  // Avoid the first 3% and last 3%
  const minIndex = Math.floor(totalLen * 0.03);
  const maxIndex = Math.floor(totalLen * 0.97);

  const approxCharLength = targetWordCount * 6.5; // ~2000 chars

  let attempts = 0;
  let bestExcerpt: BookExcerpt | null = null;

  while (attempts < 30) {
    attempts++;

    // Pick a random starting anchor in valid range
    const rawStart = minIndex + Math.floor(Math.random() * (maxIndex - minIndex - approxCharLength));

    // Search forward for a paragraph start (\n\n) or sentence start (. ! ?)
    let startIndex = fullText.indexOf('\n\n', rawStart);
    if (startIndex === -1 || startIndex > rawStart + 400) {
      // Fallback: search for sentence boundary
      const sentenceMatch = fullText.slice(rawStart, rawStart + 300).match(/[.!?]\s+[А-ЯA-ZЁ]/);
      if (sentenceMatch && sentenceMatch.index !== undefined) {
        startIndex = rawStart + sentenceMatch.index + sentenceMatch[0].length - 1;
      } else {
        startIndex = rawStart;
      }
    } else {
      startIndex += 2; // Skip \n\n
    }

    // Determine target end offset
    const rawEndTarget = startIndex + approxCharLength;
    if (rawEndTarget >= maxIndex) continue;

    // Find clean end at paragraph or sentence
    let endIndex = fullText.indexOf('\n\n', rawEndTarget - 200);
    if (endIndex === -1 || endIndex > rawEndTarget + 500) {
      // Fallback: find sentence ending
      const periodIndex = fullText.slice(rawEndTarget - 100, rawEndTarget + 300).search(/[.!?](\s+|$)/);
      if (periodIndex !== -1) {
        endIndex = rawEndTarget - 100 + periodIndex + 1;
      } else {
        endIndex = rawEndTarget;
      }
    }

    // Ensure we don't cut off in the middle of a word
    while (endIndex < fullText.length && /[а-яА-Яa-zA-Z0-9ёЁ]/.test(fullText[endIndex])) {
      endIndex++;
    }

    const excerptText = fullText.slice(startIndex, endIndex).trim();
    const wordCount = excerptText.split(/\s+/).length;

    // Check if excerpt is valid length and not junk/TOC
    if (wordCount >= 180 && wordCount <= 500) {
      // Check for bad excerpts (too many uppercase headers or TOC lines)
      const lines = excerptText.split('\n').filter(l => l.trim().length > 0);
      const shortLines = lines.filter(l => l.trim().length < 25);
      
      // If majority of lines are tiny headers, reject attempt
      if (lines.length > 3 && shortLines.length / lines.length > 0.6) {
        continue;
      }

      const centerIndex = (startIndex + endIndex) / 2;
      const actualPosition = Math.max(0.01, Math.min(0.99, centerIndex / totalLen));

      bestExcerpt = {
        text: excerptText,
        startIndex,
        endIndex,
        actualPosition,
        totalTextLength: totalLen
      };
      break;
    }
  }

  // Safe fallback if loop failed to find perfect paragraph boundary
  if (!bestExcerpt) {
    const fallbackStart = Math.floor(totalLen * 0.2);
    const fallbackEnd = fallbackStart + 1800;
    const fallbackText = fullText.slice(fallbackStart, fallbackEnd).trim();
    const centerIndex = (fallbackStart + fallbackEnd) / 2;
    bestExcerpt = {
      text: fallbackText,
      startIndex: fallbackStart,
      endIndex: fallbackEnd,
      actualPosition: centerIndex / totalLen,
      totalTextLength: totalLen
    };
  }

  return bestExcerpt;
}
