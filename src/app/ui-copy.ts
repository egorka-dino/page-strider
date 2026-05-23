export const UI_COPY = {
  metadata: {
    description: "Небольшой читательский дневник для одного читателя."
  },
  hero: {
    eyebrow: "Книжный квест дня",
    logoLabel: "Знак PageStrider",
    title: "PageStrider",
    copy: "Каждый день открывает новый отрезок маршрута: прочитайте страницы, сохраните шаг и двигайтесь к финишу книги.",
    goalLabel: "цель квеста",
    pathLabel: "Маршрут чтения",
    pathSteps: ["Старт", "Шаг", "Награда"],
    reportLink: "Отчет для учителя"
  },
  messages: {
    bookCreated: "Книга добавлена. Первый квест готов!",
    entrySaved: "Квест дня сохранен. Отличный шаг!",
    bookUpdated: "Детали книги обновлены.",
    bookPaused: "Книга ждет на паузе. Можно выбрать следующий маршрут.",
    bookActivated: "Книга снова активна. Маршрут продолжен!",
    bookFinished: "Книжный маршрут завершен!"
  },
  errors: {
    bookDetailsRequired: "Добавьте название и автора, чтобы открыть книжный квест.",
    invalidBookPages: "Проверьте страницы книги: маршрут должен помещаться внутри книги.",
    missingActiveBook: "Сначала выберите активную книгу для квеста.",
    entryExists: "Квест за сегодня уже засчитан.",
    endBeforeStart: "Финиш шага должен быть после последней уже прочитанной страницы.",
    endAfterTotal: "Финиш шага не может быть дальше конца книги.",
    invalidBook: "Перед стартом нужны корректные данные книги.",
    bookFinished: "Завершенную книгу нельзя снова сделать активной."
  },
  today: {
    activeBookEyebrow: "Текущий маршрут",
    authorPrefix: "автор:",
    unknownAuthor: "Автор не указан",
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
    heading: "Открыть новый книжный маршрут",
    titleLabel: "Название",
    authorLabel: "Автор",
    totalPagesLabel: "Сколько страниц в книге?",
    startPageLabel: "Где начинается маршрут?",
    currentPageLabel: "Где сейчас закладка?",
    startedDateLabel: "Дата начала",
    submitButton: "Открыть квест"
  },
  books: {
    eyebrow: "Книжная полка",
    heading: "Маршруты книг",
    copy: "Здесь можно поставить книгу на паузу, вернуться к отложенной или закрыть завершенный путь.",
    activeHeading: "Активная книга",
    pausedHeading: "На паузе",
    finishedHeading: "Завершенные книги",
    noActive: "Сейчас нет активной книги. Откройте новый маршрут или вернитесь к книге на паузе.",
    noPaused: "Отложенных книг пока нет.",
    noFinished: "Завершенные книги появятся после первых финалов.",
    status: {
      reading: "активна",
      paused: "на паузе",
      finished: "завершена"
    },
    pageProgress: (currentPage: number, totalPages: number) =>
      `Закладка: ${currentPage} из ${totalPages}`,
    startedDate: (date: string) => `Старт: ${formatDate(date)}`,
    finishedDate: (date: string) => `Финиш: ${formatDate(date)}`,
    editHeading: "Детали книги",
    saveDetails: "Сохранить детали",
    pauseAction: "Поставить на паузу",
    activateAction: "Сделать активной",
    finishAction: "Завершить книгу",
    historyHeading: "История книги",
    noBookHistory: "У этой книги пока нет сохраненных шагов.",
    historyEntry: (date: string, startPage: number, endPage: number, pagesRead: number) =>
      `${formatDate(date)}: ${startPage}-${endPage}, ${pagesRead} стр.`,
    switchLocked:
      "Сегодня уже есть запись чтения, поэтому сменить активную книгу можно будет завтра."
  },
  report: {
    toolbarEyebrow: "Печатный маршрут",
    toolbarHeading: "Отчет для учителя",
    backLink: "Вернуться к дневнику",
    printButton: "Печать",
    fromLabel: "Начало периода",
    toLabel: "Конец периода",
    applyRangeButton: "Показать период",
    reportEyebrow: "Читательский отчет",
    reportHeading: "Маршрут чтения за период",
    readerLabel: "Читатель",
    readerFallback: "Читатель",
    periodLabel: "Период",
    periodValue: (from: string, to: string) => `${formatFullDate(from)} - ${formatFullDate(to)}`,
    dailyGoalLabel: "Цель дня",
    summaryLabel: "Итоги периода",
    summary: {
      totalPagesRead: "Всего страниц",
      readingDaysCount: "Дней с чтением",
      goalCompletedDaysCount: "Цель выполнена",
      averagePagesPerReadingDay: "Средний шаг",
      bestDayPages: "Лучший день",
      periodDaysCount: "Дней в периоде"
    },
    pagesValue: (pages: number) => `${formatNumber(pages)} стр.`,
    daysValue: (days: number) => `${formatNumber(days)} дн.`,
    noAverage: "пока нет",
    tableHeading: "Дни чтения",
    table: {
      date: "Дата",
      book: "Книга",
      pages: "Страницы",
      pagesRead: "Прочитано",
      goalStatus: "Цель",
      note: "Заметка"
    },
    pageRange: (startPage: number, endPage: number) => `${startPage}-${endPage}`,
    goalDone: "выполнена",
    goalPartial: "частично",
    emptyNote: "-",
    emptyRange: "В выбранном периоде пока нет сохраненных читательских шагов."
  }
} as const;

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 1
  }).format(value);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long"
  }).format(new Date(`${value}T00:00:00.000Z`));
}

function formatFullDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00.000Z`));
}
