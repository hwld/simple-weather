import { ComponentProps, ReactNode } from "react";
import { HStack } from "@/components/ui/stack";
import { tv, VariantProps } from "tailwind-variants";

const card = tv({
  base: "bg-base-50 border border-base-300 rounded-lg p-4 shadow-sm min-w-fit overflow-hidden",
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
  return (
    <HStack>
      <div className="leading-none text-xs">{label}</div>
    </HStack>
  );
}

export function CardContainer({ children }: { children: ReactNode }) {
  return (
    <div className="bg-base-200 p-4 sm:p-6 rounded-lg inset-shadow-[0_2px_5px_rgba(0_0_0_/_0.15)] border border-base-300 overflow-auto">
      {children}
    </div>
  );
}
