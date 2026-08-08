"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Client-only localStorage-backed state. The stored value can only be read
 * after mount (the server has no access to it), so the first render always
 * returns `initialValue` and hydrates one tick later.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setValue(JSON.parse(saved));
    } catch {
      // ignore malformed storage
    }
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  function clear() {
    window.localStorage.removeItem(key);
  }

  return [value, setValue, clear] as const;
}
