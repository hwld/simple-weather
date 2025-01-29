import "../style/global.css";
import { css } from "../../styled-system/css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={css({ scrollbarGutter: "stable" })}>
      <body>{children}</body>
    </html>
  );
}
