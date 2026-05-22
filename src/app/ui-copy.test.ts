import { describe, expect, it } from "vitest";

import { UI_COPY } from "./ui-copy";

describe("UI copy", () => {
  it("uses Russian copy for the visible PageStrider interface", () => {
    expect(UI_COPY.hero.eyebrow).toBe("Читательский маршрут на сегодня");
    expect(UI_COPY.bookSetup.heading).toBe("Добавьте активную книгу");
    expect(UI_COPY.today.finishedPageLabel).toBe("Страница, на которой остановились");
    expect(UI_COPY.messages.entrySaved).toBe("Сегодняшнее чтение сохранено.");
  });

  it("keeps validation messages in Russian", () => {
    expect(Object.values(UI_COPY.errors).join(" ")).toContain("книг");
    expect(Object.values(UI_COPY.errors).join(" ")).toContain("страниц");
  });
});
