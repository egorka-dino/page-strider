export const UI_COPY = {
  metadata: {
    description: "Небольшой читательский дневник для одного читателя."
  },
  hero: {
    eyebrow: "Читательский маршрут на сегодня",
    title: "PageStrider",
    copy: "Ведите одну активную книгу вперед, по одному понятному шагу за раз.",
    goalLabel: "цель в страницах"
  },
  messages: {
    bookCreated: "Книга сохранена. Следующая страница уже ждет.",
    entrySaved: "Сегодняшнее чтение сохранено."
  },
  errors: {
    bookDetailsRequired: "Добавьте название и автора, чтобы начать маршрут.",
    invalidBookPages: "Проверьте страницы книги. Текущая страница должна быть внутри книги.",
    missingActiveBook: "Сначала добавьте активную книгу.",
    entryExists: "Чтение за сегодня уже записано.",
    endBeforeStart: "Страница остановки должна быть после последней уже прочитанной страницы.",
    endAfterTotal: "Страница остановки не может быть дальше конца книги.",
    invalidBook: "Перед записью чтения нужны корректные данные книги."
  },
  today: {
    activeBookEyebrow: "Активная книга",
    authorPrefix: "автор:",
    progressLabel: (progressPercent: number) => `Готово на ${progressPercent}%`,
    readStat: "Прочитано",
    leftStat: "Осталось",
    doneStat: "Готово",
    savedEyebrow: "Сегодня записано",
    pagesLogged: (pagesRead: number) => `${pagesRead} стр. записано`,
    pageRangeRecorded: (startPage: number, endPage: number) =>
      `Страницы ${startPage}-${endPage} записаны за сегодня.`,
    nextStepEyebrow: "Следующий шаг",
    startOnPage: (nextPage: number) => `Начните со страницы ${nextPage}`,
    finishedPageLabel: "Страница, на которой остановились",
    noteLabel: "Заметка",
    notePlaceholder: "Необязательно",
    formHint: (dailyGoalPages: number) =>
      `Цель на сегодня: ${dailyGoalPages} стр. Запись будет сохранена за эту дату.`,
    saveButton: "Сохранить сегодня"
  },
  bookSetup: {
    eyebrow: "Первая книга",
    heading: "Добавьте активную книгу",
    titleLabel: "Название",
    authorLabel: "Автор",
    totalPagesLabel: "Всего страниц",
    startPageLabel: "Первая читаемая страница",
    currentPageLabel: "Последняя уже прочитанная страница",
    startedDateLabel: "Дата начала",
    submitButton: "Начать книгу"
  }
} as const;
