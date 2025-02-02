import { Icon } from "@tabler/icons-react";
import { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from "react";
import { css, cx } from "../../../styled-system/css";
import Link, { LinkProps } from "next/link";

const buttonClass = css({
  display: "flex",
  gap: "var(--space-xs)",
  alignItems: "center",
  borderRadius: "var(--rounded-sm)",
  height: "28px",
  minWidth: "64px",
  paddingInline: "var(--space-sm)",
  lineHeight: 1,
  cursor: "pointer",

  transition: "all",
  transitionDuration: "0.1s",
  fontWeight: "bold",
});

type Props = {
  icon?: Icon;
  ref?: ForwardedRef<HTMLButtonElement>;
} & ComponentPropsWithoutRef<"button">;

export function Button({ icon: Icon, children, className, ...props }: Props) {
  return (
    <button className={cx(buttonClass, className)} {...props}>
      {Icon ? <Icon size={18} /> : null}
      {children}
    </button>
  );
}

export function ButtonLink({
  className,
  icon: Icon,
  children,
  ...props
}: { className?: string; icon: Icon; children: ReactNode } & LinkProps) {
  return (
    <Link className={cx(buttonClass, className)} {...props}>
      {Icon ? <Icon size={18} /> : null}
      {children}
    </Link>
  );
}
