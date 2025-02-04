import { AppHeader } from "@/components/app-header";
import { ReactNode } from "react";

type Props = { children: ReactNode };

/**
 *  エラーページを表示するときにAppHeaderを表示したくないため、ルートグループを使ってレイアウトをネストさせる
 */
export default function WithHeaderLayout({ children }: Props) {
  return (
    <div className="grid grid-rows-[auto_1fr] min-h-dvh mx-auto max-w-[700px] px-4">
      <AppHeader />
      <div className="pt-8 pb-4 min-w-0">{children}</div>
    </div>
  );
}
