import { ComponentProps, ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";

const card = tv({
  base: "bg-base-50 rounded-lg p-4 shadow-sm min-w-fit overflow-hidden",
  variants: {
    p: { none: "p-0", md: "p-4" },
  },
  defaultVariants: { p: "md", fullHeight: false },
});

type Props = VariantProps<typeof card> &
  Omit<ComponentProps<"div">, "className">;

export function Card({ p, children, ...props }: Props) {
  return (
    <div {...props} className={card({ p })}>
      {children}
    </div>
  );
}

export function CardLabel({ label }: { label: string }) {
  return <div className="leading-none text-xs">{label}</div>;
}

export function CardContainer({ children }: { children: ReactNode }) {
  return (
    <div className="bg-base-200 p-4 sm:p-6 rounded-lg inset-shadow-[0_4px_6px_rgb(0_0_0_/_0.07)] border border-base-300 overflow-auto">
      {children}
    </div>
  );
}
