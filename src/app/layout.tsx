import Form from "next/form";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Form action="/">
          <input name="location" />
          <button type="submit">検索</button>
        </Form>
        {children}
      </body>
    </html>
  );
}
