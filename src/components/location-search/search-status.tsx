import { ReactNode } from "react";
import {
  IconInfoCircle,
  IconExclamationCircle,
  IconCircleDashed,
} from "@tabler/icons-react";
import { tv } from "tailwind-variants";

const searchStatus = tv({
  slots: {
    root: "grid grid-cols-[auto_1fr] items-center gap-1",
    icon: "size-[14px] mb-[1px]",
    text: "text-xs leading-none",
  },
  variants: {
    status: {
      empty: { root: "text-base-700" },
      error: { root: "text-red-500" },
      nodata: { root: "text-base-500" },
    },
  },
});

type Props = {
  children: ReactNode;
  status: "error" | "empty" | "nodata";
};

export function SearchStatus({ children, status }: Props) {
  const classes = searchStatus({ status });

  const Icon = {
    empty: IconInfoCircle,
    error: IconExclamationCircle,
    nodata: IconCircleDashed,
  }[status];

  return (
    <div className={classes.root()}>
      <Icon className={classes.icon()} />
      <p className={classes.text()}>{children}</p>
    </div>
  );
}
