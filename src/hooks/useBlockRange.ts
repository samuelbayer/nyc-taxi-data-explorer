import { useEffect } from "react";
import { BLOCK_SIZE } from "../lib/blockSize";

type Params = {
  visibleCount: number;
  setIndexRange: React.Dispatch<React.SetStateAction<number[]>>;
  pageStart: number;
  firstIndex: number;
  lastIndex: number;
};

export function useBlockRange({
  visibleCount,
  setIndexRange,
  pageStart,
  firstIndex,
  lastIndex,
}: Params) {
  useEffect(() => {
    if (visibleCount === 0) return;

    const start = Math.floor(firstIndex / BLOCK_SIZE) * BLOCK_SIZE + pageStart;
    const end =
      Math.ceil((lastIndex + 1) / BLOCK_SIZE) * BLOCK_SIZE - 1 + pageStart;

    const handler = setTimeout(() => {
      setIndexRange((prev) => {
        const [prevMin, prevMax] = prev;
        if (prevMin === start && prevMax === end) return prev;
        return [start, end];
      });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [lastIndex, firstIndex, visibleCount, setIndexRange, pageStart]);
}
