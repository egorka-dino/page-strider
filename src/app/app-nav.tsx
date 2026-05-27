import Link from "next/link";

import { UI_COPY } from "./ui-copy";

type AppSection = "today" | "books" | "journey" | "report";

const navItems: Array<{ section: AppSection; href: string; label: string }> = [
  { section: "today", href: "/", label: UI_COPY.navigation.today },
  { section: "books", href: "/books", label: UI_COPY.navigation.books },
  { section: "journey", href: "/journey", label: UI_COPY.navigation.journey },
  { section: "report", href: "/report", label: UI_COPY.navigation.report }
];

export function AppNav({ active }: { active: AppSection }) {
  return (
    <nav className="app-nav print-hidden" aria-label={UI_COPY.navigation.ariaLabel}>
      {navItems.map((item) => (
        <Link
          aria-current={item.section === active ? "page" : undefined}
          className={item.section === active ? "app-nav-link active" : "app-nav-link"}
          href={item.href}
          key={item.section}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
