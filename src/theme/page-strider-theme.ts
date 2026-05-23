export const pageStriderTheme = {
  color: {
    page: "var(--ps-page)",
    paper: "var(--ps-paper)",
    ink: "var(--ps-ink)",
    mutedInk: "var(--ps-muted-ink)",
    accent: "var(--ps-accent)",
    accentInk: "var(--ps-accent-ink)",
    success: "var(--ps-success)",
    warning: "var(--ps-warning)",
    badge: "var(--ps-badge)",
    dayNoReading: "var(--ps-day-no-reading)",
    dayPartial: "var(--ps-day-partial)",
    dayGoal: "var(--ps-day-goal)",
    dayGood: "var(--ps-day-good)",
    dayGreat: "var(--ps-day-great)",
    dayLegendary: "var(--ps-day-legendary)"
  },
  radius: {
    panel: "0.5rem",
    control: "0.375rem"
  },
  shadow: {
    panel: "0 14px 40px color-mix(in srgb, var(--ps-ink) 12%, transparent)"
  }
} as const;

export type PageStriderTheme = typeof pageStriderTheme;
