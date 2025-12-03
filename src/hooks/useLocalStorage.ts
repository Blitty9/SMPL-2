import { useEffect, useRef } from 'react';

/**
 * Debounced localStorage hook that saves data after a delay
 * and ensures data is flushed on unmount
 */
export function useDebouncedLocalStorage<T>(
  key: string,
  value: T | null,
  delay: number = 500
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastValueRef = useRef<T | null>(value);

  useEffect(() => {
    // Update ref with latest value
    lastValueRef.current = value;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (lastValueRef.current !== null) {
        try {
          localStorage.setItem(key, JSON.stringify(lastValueRef.current));
        } catch (error) {
          console.error(`Failed to save ${key} to localStorage:`, error);
        }
      } else {
        localStorage.removeItem(key);
      }
    }, delay);

    // Cleanup: flush on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Flush final value on unmount
      if (lastValueRef.current !== null) {
        try {
          localStorage.setItem(key, JSON.stringify(lastValueRef.current));
        } catch (error) {
          console.error(`Failed to flush ${key} to localStorage:`, error);
        }
      }
    };
  }, [key, value, delay]);
}

/**
 * Simple localStorage hook for non-debounced values (like mode, tool)
 */
export function useLocalStorage<T>(
  key: string,
  value: T | null
) {
  useEffect(() => {
    if (value !== null && value !== undefined) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Failed to save ${key} to localStorage:`, error);
      }
    } else {
      localStorage.removeItem(key);
    }
  }, [key, value]);
}

