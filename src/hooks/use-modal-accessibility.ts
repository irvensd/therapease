import { useEffect, useRef, useCallback } from "react";

interface UseModalAccessibilityProps {
  isOpen: boolean;
  onClose: () => void;
  trapFocus?: boolean;
  closeOnEscape?: boolean;
  restoreFocus?: boolean;
}

export const useModalAccessibility = ({
  isOpen,
  onClose,
  trapFocus = true,
  closeOnEscape = true,
  restoreFocus = true,
}: UseModalAccessibilityProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Store the previously focused element when modal opens
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Focus management when modal opens/closes
  useEffect(() => {
    if (!modalRef.current) return;

    if (isOpen) {
      // Focus the first focusable element in the modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstFocusableElement = focusableElements[0] as HTMLElement;

      if (firstFocusableElement) {
        // Small delay to ensure the modal is fully rendered
        setTimeout(() => {
          firstFocusableElement.focus();
        }, 100);
      }
    } else if (restoreFocus && previousActiveElementRef.current) {
      // Restore focus to the previously focused element
      previousActiveElementRef.current.focus();
    }
  }, [isOpen, restoreFocus]);

  // Escape key handler
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    },
    [closeOnEscape, onClose],
  );

  // Focus trap handler
  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      if (!trapFocus || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      const firstFocusableElement = focusableElements[0] as HTMLElement;
      const lastFocusableElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (event.key === "Tab") {
        if (event.shiftKey) {
          // Shift + Tab - moving backwards
          if (document.activeElement === firstFocusableElement) {
            event.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          // Tab - moving forwards
          if (document.activeElement === lastFocusableElement) {
            event.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    },
    [trapFocus],
  );

  // Keyboard event listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      handleEscapeKey(event);
      handleTabKey(event);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleEscapeKey, handleTabKey]);

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  return {
    modalRef,
    // Additional utility functions
    focusFirstElement: () => {
      if (!modalRef.current) return;
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) firstElement.focus();
    },
    focusLastElement: () => {
      if (!modalRef.current) return;
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;
      if (lastElement) lastElement.focus();
    },
  };
};

// Hook for announcements to screen readers
export const useScreenReaderAnnouncement = () => {
  const announce = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", priority);
      announcement.setAttribute("aria-atomic", "true");
      announcement.setAttribute("class", "sr-only");
      announcement.textContent = message;

      document.body.appendChild(announcement);

      // Remove the announcement after a delay
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    },
    [],
  );

  return { announce };
};
