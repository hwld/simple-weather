import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";
import { css, cx } from "../../../styled-system/css";

type Props = { className?: string; children: ReactNode } & LinkProps;

export function Anchor({ children, className, ...props }: Props) {
  return (
    <Link
      className={cx(
        css({
          transition: "color",
          transitionDuration: "0.1s",
          color: "var(--color-link)",
          _hover: {
            color: "var(--color-link-hover)",
          },
        }),
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
