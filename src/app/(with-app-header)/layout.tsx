import { css } from "../../../styled-system/css";
import { AppHeader } from "@/components/app-header";
import { ReactNode } from "react";

type Props = { children: ReactNode };

/**
 *  エラーページを表示するときにAppHeaderを表示したくないため、ルートグループを使ってレイアウトをネストさせる
 */
export default function WithHeaderLayout({ children }: Props) {
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateRows: "auto 1fr",
        minHeight: "100dvh",
        margin: "0 auto",
        maxWidth: "700px",
        paddingInline: "var(--space-md)",
      })}
    >
      <AppHeader />
      <div
        className={css({
          paddingBlock: "var(--space-xl) var(--space-md)",
          minWidth: "0px",
        })}
      >
        {children}
      </div>
    </div>
  );
}
