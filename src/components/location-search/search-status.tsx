import { ReactNode } from "react";
import { sva } from "../../../styled-system/css/sva";
import {
  IconInfoCircle,
  IconExclamationCircle,
  IconCircleDashed,
} from "@tabler/icons-react";

const statusClass = sva({
  slots: ["root", "icon", "text"],
  base: {
    root: {
      display: "flex",
      flexDir: "row",
      alignItems: "center",
      gap: "var(--space-xs)",
    },
    icon: { flexShrink: 0, marginBottom: "1px" },
    text: { fontSize: "12px", lineHeight: 1 },
  },
  variants: {
    status: {
      empty: { root: { color: "var(--color-gray-700)" } },
      error: { root: { color: "var(--color-error)" } },
      nodata: { root: { color: "var(--color-gray-500)" } },
    },
  },
});

type Props = {
  children: ReactNode;
  status: "error" | "empty" | "nodata";
};

export function SearchStatus({ children, status }: Props) {
  const classes = statusClass({ status });

  const Icon = {
    empty: IconInfoCircle,
    error: IconExclamationCircle,
    nodata: IconCircleDashed,
  }[status];

  return (
    <div className={classes.root}>
      <Icon size={14} className={classes.icon} />
      <p className={classes.text}>{children}</p>
    </div>
  );
}
