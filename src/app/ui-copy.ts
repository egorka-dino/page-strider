export const UI_COPY = {
  metadata: {
    description: "Небольшой читательский дневник для одного читателя."
  },
  hero: {
    eyebrow: "Книжный квест дня",
    title: "PageStrider",
    copy: "Каждый день открывает новый отрезок маршрута: прочитайте страницы, сохраните шаг и двигайтесь к финишу книги.",
    goalLabel: "цель квеста",
    pathLabel: "Маршрут чтения",
    pathSteps: ["Старт", "Шаг", "Награда"]
  },
  messages: {
    bookCreated: "Книга добавлена. Первый квест готов!",
    entrySaved: "Квест дня сохранен. Отличный шаг!"
  },
  errors: {
    bookDetailsRequired: "Добавьте название и автора, чтобы открыть книжный квест.",
    invalidBookPages: "Проверьте страницы книги: маршрут должен помещаться внутри книги.",
    missingActiveBook: "Сначала выберите активную книгу для квеста.",
    entryExists: "Квест за сегодня уже засчитан.",
    endBeforeStart: "Финиш шага должен быть после последней уже прочитанной страницы.",
    endAfterTotal: "Финиш шага не может быть дальше конца книги.",
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
    nextStepEyebrow: "Шаг дня",
    startOnPage: (nextPage: number) => `Стартуйте со страницы ${nextPage}`,
    finishedPageLabel: "До какой страницы дошли?",
    noteLabel: "Заметка к шагу",
    notePlaceholder: "Что было самым интересным?",
    formHint: (dailyGoalPages: number) =>
      `Цель квеста: ${dailyGoalPages} стр. Если дошли дальше - маршрут получит мощный бонус.`,
    saveButton: "Засчитать шаг"
  },
  history: {
    eyebrow: "Лента маршрута",
    heading: "История чтения",
    copy: "Последние дни показывают, где маршрут уже сияет, а где можно открыть новый шаг.",
    emptyHeading: "Маршрут еще ждет первых отметок",
    emptyCopy: "Когда появятся сохраненные квесты, здесь будет видно путь по дням.",
    calendarLabel: "Календарь читательских дней",
    noReading: "День без отметки",
    detailsHeading: "Детали дней",
    bookLabel: "Книга",
    pagesLabel: "Страницы",
    pagesRead: (pagesRead: number) => `${pagesRead} стр.`,
    pageRange: (startPage: number, endPage: number) => `${startPage}-${endPage}`,
    goalStatus: {
      no_reading: "пока без чтения",
      partial: "часть цели",
      goal: "цель взята",
      good: "сильный шаг",
      great: "большой рывок",
      legendary: "легендарный день"
    },
    emptyDayDetail: "В этот день маршрут отдыхал. Следующая отметка может стать новой главой.",
    noteLabel: "Заметка"
  },
  progress: {
    eyebrow: "Сила маршрута",
    heading: "Ритм чтения",
    copy: "Здесь видно, как растет путь: серии дней, страницы недели и новые награды.",
    streakHeading: "Огонек серии",
    currentStreak: "Текущая серия",
    bestStreak: "Лучшая серия",
    streakUnit: (days: number) => `${days} дн.`,
    streakEncouragement:
      "Даже если маршрут сделал паузу, следующий шаг снова зажигает серию.",
    metricsHeading: "Следы на карте",
    metrics: {
      totalPagesRead: "Всего страниц",
      booksFinished: "Книг завершено",
      readingDaysCount: "Дней с чтением",
      goalCompletedDaysCount: "Цель взята",
      averagePagesPerReadingDay: "Средний шаг",
      averagePagesPerCalendarDay: "Темп календаря",
      bestDayPages: "Лучший день",
      pagesReadThisWeek: "Страниц за неделю",
      readingDaysThisWeek: "Дней недели"
    },
    metricPages: (pages: number) => `${formatNumber(pages)} стр.`,
    metricDays: (days: number) => `${formatNumber(days)} дн.`,
    metricBooks: (books: number) => `${formatNumber(books)} шт.`,
    noAverage: "пока рано",
    badgesHeading: "Награды маршрута",
    earnedBadge: "получено",
    lockedBadge: "еще в пути",
    emptyBadges: "Первые награды появятся после сохраненных читательских квестов."
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

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 1
  }).format(value);
}
