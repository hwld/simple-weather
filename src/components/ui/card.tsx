import { ComponentProps, ReactNode } from "react";
import { css, cx } from "../../../styled-system/css";
import { HStack } from "@/components/ui/stack";

type Props = { noPadding?: boolean } & ComponentProps<"div">;

export function Card({ className, noPadding, children, ...props }: Props) {
  return (
    <div
      {...props}
      className={cx(
        css({
          backgroundColor: "var(--color-gray-50)",
          border: "solid 1px var(--color-gray-300)",
          borderRadius: "var(--rounded-md)",
          padding: noPadding ? "0px" : "var(--space-md)",
          boxShadow: "var(--shadow-sm)",
        }),
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardLabel({ label }: { label: string }) {
  return (
    <HStack>
      <div
        className={css({
          lineHeight: 1,
          fontSize: "12px",
          color: "var(--color-gray-700)",
        })}
      >
        {label}
      </div>
    </HStack>
  );
}

export function CardContainer({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        height: "100%",
        padding: { base: "var(--space-md)", sm: "var(--space-lg)" },
        backgroundColor: "var(--color-gray-200)",
        boxShadow: "inset 0 2px 5px rgba(0 0 0 / 0.15)",
        borderRadius: "var(--rounded-md)",
        border: "1px solid var(--color-gray-300)",
        overflow: "auto",
      })}
    >
      {children}
    </div>
  );
}
