import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "PageStrider",
  description: "A small reading journal for one reader."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
