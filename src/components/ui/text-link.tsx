import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

type Props = { children: ReactNode } & LinkProps;

export function TextLink({ children, ...props }: Props) {
  return (
    <Link
      className="transition-colors duration-100 hover:text-sky-600 text-sky-500 break-all"
      {...props}
    >
      {children}
    </Link>
  );
}
