import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, ms: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debouncedValue;
}
