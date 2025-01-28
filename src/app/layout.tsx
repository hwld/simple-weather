import "./global.css";
import { AppHeader } from "./app-header";
import { css } from "../../styled-system/css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div
          className={css({
            display: "grid",
            gridTemplateRows: "auto 1fr",
            minHeight: "100dvh",
            margin: "0 auto",
            maxWidth: "700px",
            paddingInline: "8px",
          })}
        >
          <AppHeader />
          <div className={css({ paddingBlock: "16px" })}>{children}</div>
        </div>
      </body>
    </html>
  );
}
