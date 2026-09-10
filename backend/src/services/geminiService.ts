import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let geminiClient: GoogleGenAI | null = null;
let geminiImageClient: GoogleGenAI | null = null;

const DEDICATED_IMAGE_GEMINI_KEY = 'AQ.Ab8RN6LxO86oeYAVELm3M2x5XYI7xFZpLwPwTrrd91AQ-NUrSg';

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'viroai-agent',
        },
      },
    });
  }
  return geminiClient;
}

export function getImageGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_IMAGE_API_KEY || DEDICATED_IMAGE_GEMINI_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!geminiImageClient) {
    geminiImageClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'viroai-agent',
        },
      },
    });
  }
  return geminiImageClient;
}
