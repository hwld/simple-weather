import { CardContainer } from "@/components/ui/card";
import { ReactNode } from "react";

type Props = { title?: ReactNode; children: ReactNode };

export function PageLayout({ title, children }: Props) {
  return (
    <div className="space-y-6 h-full grid grid-rows-[auto_1fr]">
      <div>{title}</div>
      <CardContainer>{children}</CardContainer>
    </div>
  );
}
