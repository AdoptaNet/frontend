"use client";

import { useEffect } from "react";
import { pauseLenis, resumeLenis } from "@/components/providers/smooth-scroll";

interface UseModalOptions {
  isOpen: boolean;
  onClose: () => void;
  preventClose?: boolean;
  modalRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Hook to manage modal behavior:
 * 1. Locks document body and root html scroll to prevent background scrolling.
 * 2. Pauses Lenis smooth-scroll while modal is active.
 * 3. Prevents layout shift from scrollbar disappearing.
 * 4. Automatically focuses the modal dialog for keyboard/wheel events.
 * 5. Listens for the 'Escape' key to close the modal smoothly.
 */
export function useModal({
  isOpen,
  onClose,
  preventClose = false,
  modalRef,
}: UseModalOptions) {
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Pause Lenis smooth scroll while modal is active
    pauseLenis();

    // Calculate scrollbar width to prevent layout jump
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Focus the modal container for keyboard & wheel accessibility
    const focusTimeout = setTimeout(() => {
      if (modalRef?.current) {
        modalRef.current.focus();
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !preventClose) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      resumeLenis();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, preventClose, modalRef]);
}
