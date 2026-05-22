export const UI_COPY = {
  metadata: {
    description: "Небольшой читательский дневник для одного читателя."
  },
  hero: {
    eyebrow: "Книжный квест дня",
    title: "PageStrider",
    copy: "Каждый день открывает новый отрезок маршрута: прочитайте страницы, сохраните рывок и двигайтесь к финишу книги.",
    goalLabel: "цель квеста",
    pathLabel: "Маршрут чтения",
    pathSteps: ["Старт", "Рывок", "Награда"]
  },
  messages: {
    bookCreated: "Книга добавлена. Первый квест готов!",
    entrySaved: "Квест дня сохранен. Отличный рывок!"
  },
  errors: {
    bookDetailsRequired: "Добавьте название и автора, чтобы открыть книжный квест.",
    invalidBookPages: "Проверьте страницы книги: маршрут должен помещаться внутри книги.",
    missingActiveBook: "Сначала выберите активную книгу для квеста.",
    entryExists: "Квест за сегодня уже засчитан.",
    endBeforeStart: "Финиш рывка должен быть после последней уже прочитанной страницы.",
    endAfterTotal: "Финиш рывка не может быть дальше конца книги.",
    invalidBook: "Перед стартом нужны корректные данные книги."
  },
  today: {
    activeBookEyebrow: "Текущий маршрут",
    authorPrefix: "автор:",
    progressLabel: (progressPercent: number) => `Готово на ${progressPercent}%`,
    readStat: "Пройдено",
    leftStat: "До финиша",
    doneStat: "Прогресс",
    savedEyebrow: "Квест засчитан",
    pagesLogged: (pagesRead: number) => `+${pagesRead} стр. к маршруту`,
    pageRangeRecorded: (startPage: number, endPage: number) =>
      `Сегодня пройден отрезок ${startPage}-${endPage}.`,
    nextStepEyebrow: "Рывок дня",
    startOnPage: (nextPage: number) => `Стартуйте со страницы ${nextPage}`,
    finishedPageLabel: "До какой страницы дошли?",
    noteLabel: "Заметка к рывку",
    notePlaceholder: "Что было самым интересным?",
    formHint: (dailyGoalPages: number) =>
      `Цель квеста: ${dailyGoalPages} стр. Если дошли дальше - маршрут получит мощный бонус.`,
    saveButton: "Засчитать рывок"
  },
  bookSetup: {
    eyebrow: "Старт маршрута",
    heading: "Выберите книгу для первого квеста",
    titleLabel: "Название",
    authorLabel: "Автор",
    totalPagesLabel: "Сколько страниц в книге?",
    startPageLabel: "Где начинается маршрут?",
    currentPageLabel: "Где сейчас закладка?",
    startedDateLabel: "Дата начала",
    submitButton: "Открыть квест"
  }
} as const;
