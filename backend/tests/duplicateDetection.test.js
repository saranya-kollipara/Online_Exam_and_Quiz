import { normalizeText, generateContentHash, calculateTextSimilarity } from '../src/utils/textHasher.js';

describe('Duplicate Question Detection & Normalization Engine', () => {
  test('should normalize text by stripping punctuation and collapsing whitespace', () => {
    const raw = '  What is a   Binary   Tree?!  ';
    const norm = normalizeText(raw);
    expect(norm).toBe('what is a binary tree');
  });

  test('should generate identical SHA-256 hash for cosmetically different but semantically identical text', () => {
    const text1 = 'What is an AVL Tree?';
    const text2 = 'what   is an avl tree?!';
    const hash1 = generateContentHash(text1);
    const hash2 = generateContentHash(text2);
    expect(hash1).toBe(hash2);
  });

  test('should compute 1.0 similarity for identical texts', () => {
    const text = 'Explain Bankers algorithm for deadlock avoidance';
    const sim = calculateTextSimilarity(text, text);
    expect(sim).toBe(1.0);
  });

  test('should detect high similarity for minor word reordering or additions', () => {
    const textA = 'What is the time complexity to access an element at index in an array';
    const textB = 'What is time complexity of accessing an element at index in array';
    const sim = calculateTextSimilarity(textA, textB);
    expect(sim).toBeGreaterThan(0.6);
  });

  test('should compute low similarity for completely unrelated questions', () => {
    const textA = 'Thermodynamic Carnot cycle efficiency formula';
    const textB = 'Binary search tree inorder traversal recursion';
    const sim = calculateTextSimilarity(textA, textB);
    expect(sim).toBeLessThan(0.15);
  });
});
