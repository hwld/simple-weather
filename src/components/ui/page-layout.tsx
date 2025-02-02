import { css } from "../../../styled-system/css";
import { CardContainer } from "@/components/ui/card";
import { VStack } from "@/components/ui/stack";
import { ReactNode } from "react";

type Props = { title?: ReactNode; children: ReactNode };

export function PageLayout({ title, children }: Props) {
  return (
    <VStack
      className={css({
        height: "100%",
        gap: "var(--space-lg)",
        minWidth: "0px",
      })}
    >
      <div
        className={css({
          height: "28px",
          display: "flex",
          alignItems: "end",
        })}
      >
        {title}
      </div>
      <CardContainer>{children}</CardContainer>
    </VStack>
  );
}
