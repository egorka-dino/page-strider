import { describe, expect, it } from "vitest";

import { UI_COPY } from "./ui-copy";

describe("UI copy", () => {
  it("uses Russian copy for the visible PageStrider interface", () => {
    expect(UI_COPY.hero.eyebrow).toBe("Книжный квест дня");
    expect(UI_COPY.bookSetup.heading).toBe("Открыть новый книжный маршрут");
    expect(UI_COPY.books.pausedHeading).toBe("На паузе");
    expect(UI_COPY.today.finishedPageLabel).toBe("До какой страницы дошли?");
    expect(UI_COPY.messages.entrySaved).toBe("Квест дня сохранен. Отличный шаг!");
  });

  it("keeps validation messages in Russian", () => {
    expect(Object.values(UI_COPY.errors).join(" ")).toContain("книг");
    expect(Object.values(UI_COPY.errors).join(" ")).toContain("страниц");
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
