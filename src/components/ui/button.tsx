import { Icon } from "@tabler/icons-react";
import { ComponentPropsWithoutRef, ForwardedRef } from "react";
import { css, cx } from "../../../styled-system/css";

type Props = {
  icon?: Icon;
  ref?: ForwardedRef<HTMLButtonElement>;
} & ComponentPropsWithoutRef<"button">;

export function Button({ icon: Icon, children, className, ...props }: Props) {
  return (
    <button
      className={cx(
        css({
          display: "flex",
          gap: "var(--space-xs)",
          alignItems: "center",
          borderRadius: "4px",
          height: "28px",
          minWidth: "64px",
          paddingInline: "var(--space-sm)",
          lineHeight: 1,
          cursor: "pointer",

          transition: "all",
          transitionDuration: "0.1s",
          fontWeight: "bold",
        }),
        className
      )}
      {...props}
    >
      {Icon ? <Icon size={18} /> : null}
      {children}
    </button>
  );
}
