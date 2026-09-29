"use client";

import * as React from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let globalLenis: Lenis | null = null;

export function pauseLenis() {
  globalLenis?.stop();
}

export function resumeLenis() {
  globalLenis?.start();
}

export function getLenis(): Lenis | null {
  return globalLenis;
}

export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  if (globalLenis) {
    globalLenis.scrollTo(target, { duration: 1.2, offset: -60 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      allowNestedScroll: true,
      prevent: (node) => {
        if (!(node instanceof HTMLElement)) return false;
        return (
          node.hasAttribute("data-lenis-prevent") ||
          Boolean(node.closest?.("[data-lenis-prevent]")) ||
          Boolean(node.closest?.("[role='dialog']")) ||
          Boolean(node.closest?.(".modal-scrollable"))
        );
      },
    });

    globalLenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      globalLenis = null;
    };
  }, []);

  return <>{children}</>;
}
