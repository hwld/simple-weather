import { Icon } from "@tabler/icons-react";
import { ComponentPropsWithoutRef } from "react";
import { css, cx } from "../../../styled-system/css";

type Props = {
  icon: Icon;
} & ComponentPropsWithoutRef<"button">;

export function Button({ icon: Icon, children, className, ...props }: Props) {
  return (
    <button
      className={cx(
        css({
          display: "flex",
          gap: "4px",
          alignItems: "center",
          borderRadius: "4px",
          height: "28px",
          minWidth: "64px",
          paddingInline: "8px",
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
      <Icon size={18} />
      {children}
    </button>
  );
}
