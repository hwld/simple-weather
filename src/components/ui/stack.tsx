import { ComponentProps } from "react";
import { css, cx } from "../../../styled-system/css";

export function VStack({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
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
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cx(
        css({ display: "flex", flexDir: "row", alignItems: "center" }),
        className
      )}
    >
      {children}
    </div>
  );
}
