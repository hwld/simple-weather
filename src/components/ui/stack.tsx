import { ReactNode } from "react";
import { css, cx } from "../../../styled-system/css";

export function VStack({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        css({ display: "flex", flexDir: "column", width: "100%" }),
        className
      )}
    >
      {children}
    </div>
  );
}

export function HStack({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        css({ display: "flex", flexDir: "row", alignItems: "center" }),
        className
      )}
    >
      {children}
    </div>
  );
}
