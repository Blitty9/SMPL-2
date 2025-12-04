/**
 * Simple hash function for creating cache keys
 * Uses a simple string hash algorithm (djb2-like)
 */
export function simpleHash(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Creates a cache key from prompt and enhancement types
 */
export function createEnhancementCacheKey(prompt: string, enhancementTypes: string[]): string {
  const promptHash = simpleHash(prompt);
  const enhancementsKey = enhancementTypes.sort().join(',');
  return `enhance_${promptHash}_${simpleHash(enhancementsKey)}`;
}

