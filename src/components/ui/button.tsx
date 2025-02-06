import { Icon } from "@tabler/icons-react";
import { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from "react";
import Link, { LinkProps } from "next/link";
import { tv, VariantProps } from "tailwind-variants";

const buttonClass = tv({
  base: "flex gap-1 items-center rounded-sm h-7 min-w-[64px] px-2 leading-none cursor-pointer transition-colors duration-100 font-bold",
  variants: {
    type: {
      red: "bg-red-500 text-base-100 hover:bg-red-600",
      base: "bg-base-700 text-base-100 hover:base-800",
      subtile: "bg-transparent hover:bg-base-200",
    },
  },
  defaultVariants: { type: "base" },
});

type ButtonProps = {
  icon?: Icon;
  ref?: ForwardedRef<HTMLButtonElement>;
} & Omit<ComponentPropsWithoutRef<"button">, "className" | "type"> &
  VariantProps<typeof buttonClass>;

export function Button({ icon: Icon, children, type, ...props }: ButtonProps) {
  return (
    <button className={buttonClass({ type })} {...props}>
      {Icon ? <Icon size={18} /> : null}
      {children}
    </button>
  );
}

type ButtonLinkProps = { icon: Icon; children: ReactNode } & LinkProps &
  VariantProps<typeof buttonClass>;

export function ButtonLink({
  icon: Icon,
  children,
  type,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClass({ type })} {...props}>
      {Icon ? <Icon size={18} /> : null}
      {children}
    </Link>
  );
}
