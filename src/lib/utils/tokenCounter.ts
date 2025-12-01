import { Tiktoken } from 'js-tiktoken/lite';
import cl100k_base from 'js-tiktoken/ranks/cl100k_base';
import type { AITool } from '../../components/editor/ModeToggle';

// Tools that use OpenAI GPT models (can use tiktoken)
const OPENAI_BASED_TOOLS: AITool[] = ['cursor', 'bolt', 'v0', 'replit', 'openai'];

// Tools that use different tokenizers (need approximation)
const APPROXIMATE_TOOLS: AITool[] = ['claude', 'anthropic'];

// Cache for the encoding to avoid re-initializing
let cachedEncoding: Tiktoken | null = null;

/**
 * Gets the tiktoken encoding for OpenAI models
 */
function getEncoding(): Tiktoken {
  if (cachedEncoding) {
    return cachedEncoding;
  }
  
  try {
    // Use cl100k_base encoding (used by GPT-3.5, GPT-4, GPT-4o-mini)
    cachedEncoding = new Tiktoken(cl100k_base);
    return cachedEncoding;
  } catch (error) {
    console.error('Failed to initialize tiktoken encoding:', error);
    throw error;
  }
}

/**
 * Counts tokens using tiktoken for OpenAI models (accurate)
 * Falls back to approximation for other models
 */
export function countTokens(text: string, tool: AITool): { count: number; isExact: boolean } {
  if (APPROXIMATE_TOOLS.includes(tool)) {
    // Use approximation for Claude/Anthropic
    // Claude uses a different tokenizer, so we approximate
    const approximateCount = Math.ceil(text.length / 4);
    return { count: approximateCount, isExact: false };
  }

  if (OPENAI_BASED_TOOLS.includes(tool)) {
    try {
      const encoding = getEncoding();
      const tokens = encoding.encode(text);
      return { count: tokens.length, isExact: true };
    } catch (error) {
      console.warn('tiktoken failed, falling back to approximation:', error);
      // Fallback to approximation if tiktoken fails
      const approximateCount = Math.ceil(text.length / 4);
      return { count: approximateCount, isExact: false };
    }
  }

  // Default fallback
  const approximateCount = Math.ceil(text.length / 4);
  return { count: approximateCount, isExact: false };
}

/**
 * Counts tokens for input text (word-based approximation)
 */
export function countInputTokens(text: string, tool: AITool): { count: number; isExact: boolean } {
  if (APPROXIMATE_TOOLS.includes(tool)) {
    // For Claude, use word-based approximation
    const wordCount = text.split(/\s+/).length;
    const approximateCount = Math.ceil(wordCount * 1.3);
    return { count: approximateCount, isExact: false };
  }

  if (OPENAI_BASED_TOOLS.includes(tool)) {
    try {
      const encoding = getEncoding();
      const tokens = encoding.encode(text);
      return { count: tokens.length, isExact: true };
    } catch (error) {
      console.warn('tiktoken failed for input, falling back to approximation:', error);
      const wordCount = text.split(/\s+/).length;
      const approximateCount = Math.ceil(wordCount * 1.3);
      return { count: approximateCount, isExact: false };
    }
  }

  // Default fallback
  const wordCount = text.split(/\s+/).length;
  const approximateCount = Math.ceil(wordCount * 1.3);
  return { count: approximateCount, isExact: false };
}

