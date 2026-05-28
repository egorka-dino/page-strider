export const UI_COPY = {
  metadata: {
    description: "Небольшой читательский дневник для одного читателя."
  },
  navigation: {
    ariaLabel: "Основные разделы читательского маршрута",
    today: "Сегодня",
    books: "Полка",
    journey: "Путь",
    report: "Отчет"
  },
  hero: {
    eyebrow: "Книжный квест дня",
    logoLabel: "Знак PageStrider",
    title: "PageStrider",
    copy: "Каждый день открывает новый отрезок маршрута: прочитайте страницы, сохраните шаг и двигайтесь к финишу книги.",
    goalLabel: "Цель на день",
    pathLabel: "Маршрут чтения",
    pathSteps: ["Старт", "Шаг", "Награда"],
    reportLink: "Отчет для учителя"
  },
  messages: {
    bookCreated: "Книга добавлена. Первый квест готов!",
    entrySaved: "Квест дня сохранен. Отличный шаг!",
    entryUpdated: "Шаг в истории исправлен. Маршрут снова ровный!",
    entryDeleted: "Ошибочная отметка удалена из маршрута.",
    bookUpdated: "Детали книги обновлены.",
    bookPaused: "Книга ждет на паузе. Можно выбрать следующий маршрут.",
    bookActivated: "Книга снова активна. Маршрут продолжен!",
    bookFinished: "Книжный маршрут завершен!",
    goalSaved: "Цель на день сохранена. Новые шаги будут считаться по датам."
  },
  errors: {
    bookDetailsRequired: "Добавьте название и автора, чтобы открыть книжный квест.",
    invalidBookPages: "Проверьте страницы книги: маршрут должен помещаться внутри книги.",
    missingActiveBook: "Сначала выберите активную книгу для квеста.",
    entryExists: "Квест за сегодня уже засчитан.",
    invalidCreditedPages: "Укажите, сколько страниц засчитать: нужно число больше нуля.",
    endBeforeStart: "Финиш шага должен быть после последней уже прочитанной страницы.",
    endAfterTotal: "Финиш шага не может быть дальше конца книги.",
    invalidBook: "Перед стартом нужны корректные данные книги.",
    invalidEntry: "Не удалось найти эту отметку истории.",
    invalidEntryDate: "Выберите корректную дату для отметки истории.",
    bookFinished: "Завершенную книгу нельзя снова сделать активной.",
    invalidGoalPages: "Укажите целое число страниц больше нуля.",
    invalidGoalDate: "Выберите корректную дату начала цели.",
    invalidGoal: "Не удалось найти эту цель на день."
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
    pagesLogged: (creditedPages: number) => `+${creditedPages} стр. к маршруту`,
    bookmarkRecorded: (startPage: number, endPage: number) =>
      `Закладка: ${startPage} → ${endPage}.`,
    creditedOnlyRecorded: "Закладка осталась без изменения.",
    nextStepEyebrow: "Шаг дня",
    startOnPage: (nextPage: number) => `Стартуйте со страницы ${nextPage}`,
    startPageLabel: "Страница начала",
    endPageLabel: "Где остановились",
    creditedPagesLabel: "Засчитать страниц",
    creditedPagesHelp:
      "Можно изменить, если были страницы с картинками или чтение не совпадает с движением закладки.",
    noteLabel: "Заметка",
    notePlaceholder: "Что было самым интересным?",
    formHint: (dailyGoalPages: number) =>
      `Цель на день: ${dailyGoalPages} стр. Если дошли дальше - маршрут получит мощный бонус.`,
    saveButton: "Засчитать шаг"
  },
  dailyGoal: {
    eyebrow: "Настройка маршрута",
    heading: "Цель на день",
    copy: "Можно запланировать новую цель с нужной даты, а прошлые дни останутся посчитаны по своей цели.",
    currentHeading: "Текущая цель",
    changeHeading: "Изменить цель",
    historyHeading: "История целей",
    effectiveFromLabel: "Действует с",
    pagesLabel: "Страниц в день",
    noteLabel: "Комментарий",
    notePlaceholder: "Например: новый этап маршрута",
    saveButton: "Сохранить",
    emptyHistory: "История целей пока пуста, используется цель на день 17 стр.",
    pagesValue: (pages: number) => `${formatNumber(pages)} стр. в день`,
    effectiveFromValue: (date: string) => `Действует с ${formatFullDate(date)}`
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
    creditedPages: (creditedPages: number) => `${creditedPages} стр.`,
    pageRange: (startPage: number, endPage: number) => `${startPage} → ${endPage}`,
    emptyPageRange: "-",
    goalStatus: {
      no_reading: "пока без чтения",
      partial: "часть цели",
      goal: "цель взята",
      good: "сильный шаг",
      great: "большой рывок",
      legendary: "легендарный день"
    },
    emptyDayDetail: "В этот день маршрут отдыхал. Следующая отметка может стать новой главой.",
    noteLabel: "Заметка",
    correctionHeading: "Исправить шаг",
    correctionDateLabel: "Дата",
    correctionStartPageLabel: "Страница начала",
    correctionEndPageLabel: "Где остановились",
    correctionCreditedPagesLabel: "Засчитать страниц",
    correctionNoteLabel: "Заметка",
    correctionSaveButton: "Сохранить исправление",
    correctionDeleteButton: "Удалить отметку",
    correctionDeleteHint: "Если шаг попал в историю случайно, его можно убрать."
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
      averagePagesPerCalendarDay: "Среднее за день",
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
    copy: "Полка помогает быстро увидеть главный маршрут, отложенные книги и уже пройденные финалы.",
    activeHeading: "Активная книга",
    pausedHeading: "На паузе",
    finishedHeading: "Завершенные книги",
    detailEyebrow: "Страница книги",
    activeTrailLabel: "главный маршрут",
    pausedTrailLabel: "ждут продолжения",
    finishedTrailLabel: "финалы полки",
    sectionCount: (count: number) => `${formatNumber(count)} шт.`,
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
    progressLabel: (percent: number) => `Пройдено ${formatNumber(percent)}% маршрута`,
    startedDate: (date: string) => `Старт: ${formatDate(date)}`,
    finishedDate: (date: string) => `Финиш: ${formatDate(date)}`,
    editHeading: "Детали книги",
    saveDetails: "Сохранить детали",
    pauseAction: "Поставить на паузу",
    activateAction: "Сделать активной",
    finishAction: "Завершить книгу",
    openArchiveCard: "Открыть книгу",
    backToShelf: "Вернуться на полку",
    historyHeading: "История книги",
    noBookHistory: "У этой книги пока нет сохраненных шагов.",
    historyEntryWithBookmark: (
      date: string,
      startPage: number,
      endPage: number,
      creditedPages: number
    ) => `${formatDate(date)}: Закладка ${startPage} → ${endPage}, засчитано ${creditedPages} стр.`,
    historyEntryCreditedOnly: (date: string, creditedPages: number) =>
      `${formatDate(date)}: засчитано ${creditedPages} стр.`,
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
    dailyGoalLabel: "Цель на день",
    historicalGoalValue: "учитывается по датам",
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
      pages: "Закладка",
      creditedPages: "Прочитано",
      dailyGoal: "Цель на день",
      goalStatus: "Цель",
      note: "Заметка"
    },
    pageRange: (startPage: number, endPage: number) => `${startPage} → ${endPage}`,
    emptyPageRange: "-",
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
