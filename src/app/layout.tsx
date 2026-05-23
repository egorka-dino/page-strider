import type { Metadata } from "next";

import "./globals.css";
import { UI_COPY } from "./ui-copy";

export const metadata: Metadata = {
  title: "PageStrider",
  description: UI_COPY.metadata.description
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
