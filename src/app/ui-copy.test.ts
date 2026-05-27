import { describe, expect, it } from "vitest";

import { UI_COPY } from "./ui-copy";

describe("UI copy", () => {
  it("uses Russian copy for the visible PageStrider interface", () => {
    expect(UI_COPY.hero.eyebrow).toBe("Книжный квест дня");
    expect(UI_COPY.hero.logoLabel).toBe("Знак PageStrider");
    expect(UI_COPY.bookSetup.heading).toBe("Открыть новый книжный маршрут");
    expect(UI_COPY.books.pausedHeading).toBe("На паузе");
    expect(UI_COPY.today.endPageLabel).toBe("Где остановились");
    expect(UI_COPY.messages.entrySaved).toBe("Квест дня сохранен. Отличный шаг!");
  });

  it("keeps validation messages in Russian", () => {
    expect(Object.values(UI_COPY.errors).join(" ")).toContain("книг");
    expect(Object.values(UI_COPY.errors).join(" ")).toContain("страниц");
  });

  it("defines Russian navigation labels for the four app sections", () => {
    expect(UI_COPY.navigation.today).toBe("Сегодня");
    expect(UI_COPY.navigation.books).toBe("Полка");
    expect(UI_COPY.navigation.journey).toBe("Путь");
    expect(UI_COPY.navigation.report).toBe("Отчет");
    expect(UI_COPY.navigation.ariaLabel).toContain("раздел");
  });

  it("uses motivating game-like language without adding later-phase features", () => {
    const visibleCopy = [
      UI_COPY.hero.copy,
      UI_COPY.hero.pathLabel,
      UI_COPY.today.nextStepEyebrow,
      UI_COPY.today.saveButton,
      UI_COPY.history.heading,
      UI_COPY.history.emptyHeading,
      UI_COPY.books.copy,
      UI_COPY.bookSetup.submitButton
    ].join(" ");

    expect(visibleCopy).toContain("квест");
    expect(visibleCopy).toContain("маршрут");
    expect(visibleCopy).toContain("шаг");
  });
});
