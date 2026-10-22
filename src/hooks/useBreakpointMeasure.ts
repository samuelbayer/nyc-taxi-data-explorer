import { useEffect } from "react";

import type { Virtualizer } from "@tanstack/react-virtual";
import { MOBILE_BREAKPOINT } from "../lib/breakpoints";

export function useBreakpointMeasure(virtualizer: Virtualizer<HTMLDivElement, Element>) {
  useEffect(() => {
    let isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const handleResize = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT === isMobile) {
        return;
      }
      isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      return virtualizer.measure();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [virtualizer]);
}