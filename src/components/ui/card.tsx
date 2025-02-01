import { ComponentProps } from "react";
import { css, cx } from "../../../styled-system/css";

type Props = { noPadding?: boolean } & ComponentProps<"div">;

export function Card({ className, noPadding, children, ...props }: Props) {
  return (
    <div
      {...props}
      className={cx(
        css({
          backgroundColor: "var(--color-gray-50)",
          border: "solid 1px var(--color-gray-200)",
          borderRadius: "8px",
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
