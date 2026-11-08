import crypto from 'crypto';

/**
 * Normalizes text by converting to lowercase, removing punctuation, 
 * trimming and condensing whitespace for robust similarity & hash matching.
 */
export function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, '') // remove punctuation
    .replace(/\s+/g, ' ')     // collapse multiple spaces
    .trim();
}

/**
 * Generates an MD5 / SHA-256 hash of normalized text for exact duplicate detection.
 */
export function generateContentHash(text) {
  const normalized = normalizeText(text);
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Calculates Jaccard similarity coefficient between two texts based on word n-grams (1-grams & 2-grams).
 * Returns a value between 0.0 (completely distinct) and 1.0 (identical).
 */
export function calculateTextSimilarity(textA, textB) {
  const normA = normalizeText(textA);
  const normB = normalizeText(textB);

  if (normA === normB) return 1.0;
  if (!normA || !normB) return 0.0;

  const wordsA = new Set(normA.split(' '));
  const wordsB = new Set(normB.split(' '));

  const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);

  if (union.size === 0) return 0.0;
  return intersection.size / union.size;
}

