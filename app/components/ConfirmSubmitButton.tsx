"use client";

import type { ReactNode } from "react";

export function ConfirmSubmitButton({
  confirmText,
  children,
  className,
}: {
  confirmText: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
