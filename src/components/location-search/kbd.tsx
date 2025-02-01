import { HStack } from "@/components/ui/stack";
import { ReactNode } from "react";
import { css } from "../../../styled-system/css";

export function KbdGuide({
  keys,
  description,
}: {
  keys: ReactNode;
  description: string;
}) {
  return (
    <HStack
      className={css({
        gap: "var(--space-xs)",
        display: "none",
        sm: { display: "flex" },
      })}
    >
      {keys}
      <p className={css({ fontSize: "12px" })}>{description}</p>
    </HStack>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd
      className={css({
        borderRadius: "var(--rounded-sm)",
        fontSize: "12px",
        border: "1px solid var(--color-gray-300)",
        bg: "var(--color-gray-200)",
        display: "grid",
        width: "fit",
        height: "20px",
        paddingInline: "var(--space-xs)",
      })}
    >
      {children}
    </kbd>
  );
}
