'use client';

import { useState, useEffect, useRef } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Only read from localStorage on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setIsLoaded(false);
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
        setIsLoaded(true);
      } catch (error) {
        console.log(`Error reading localStorage key "${key}":`, error);
        setIsLoaded(true);
      }
    }
  }, [key]);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.log(`Error removing localStorage key "${key}":`, error);
    }
  };

  return { value: storedValue, setValue, removeValue, isLoaded };
}