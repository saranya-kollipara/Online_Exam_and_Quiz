import dotenv from 'dotenv';
dotenv.config();

export const judge0Config = {
  apiUrl: process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com',
  apiKey: process.env.JUDGE0_API_KEY || '',
  apiHost: 'judge0-ce.p.rapidapi.com',
  timeoutSeconds: Number(process.env.JUDGE0_TIMEOUT_SECONDS) || 5,
  
  // Standard Judge0 language IDs
  languageMap: {
    c: 50,          // C (GCC 9.2.0)
    cpp: 54,        // C++ (GCC 9.2.0)
    java: 62,       // Java (OpenJDK 13.0.1)
    python: 71,     // Python (3.8.1)
    javascript: 63  // JavaScript (Node.js 12.14.0)
  }
};

