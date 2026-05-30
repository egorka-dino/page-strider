import type { Metadata } from "next";

import "./globals.css";
import { PAGE_ROUTE_FIELDS_SCRIPT } from "./page-route-fields-script";
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
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: PAGE_ROUTE_FIELDS_SCRIPT }} />
      </body>
    </html>
  );
}
