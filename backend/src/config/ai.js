import dotenv from 'dotenv';
dotenv.config();

export const aiConfig = {
  provider: process.env.AI_PROVIDER || 'mock',
  apiKey: process.env.AI_API_KEY || '',
  model: process.env.AI_MODEL || 'gemini-1.5-flash',
  geminiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
  openaiEndpoint: 'https://api.openai.com/v1/chat/completions'
};

