import type {
  Book,
  DailyGoal,
  DailyGoalInput,
  ReadingEntry,
  ReaderProfile,
  Settings
} from "@/domain";

export interface SettingsRepository {
  getSettings(): Promise<Settings>;
  updateSettings(settings: Settings): Promise<Settings>;
}

export interface ReaderRepository {
  getReader(): Promise<ReaderProfile | null>;
  updateReader(reader: ReaderProfile): Promise<ReaderProfile>;
}

export interface BookRepository {
  getActiveBook(): Promise<Book | null>;
  getBookById(id: string): Promise<Book | null>;
  listBooks(): Promise<Book[]>;
  createBook(book: Omit<Book, "id">): Promise<Book>;
  updateBook(book: Book): Promise<Book>;
  finishActiveBook(finishedDate: string): Promise<Book>;
}

export interface ReadingEntryRepository {
  listEntries(range?: DateRange): Promise<ReadingEntry[]>;
  getEntryById(id: string): Promise<ReadingEntry | null>;
  getEntryByDate(date: string): Promise<ReadingEntry | null>;
  upsertEntry(entry: Omit<ReadingEntry, "id">): Promise<ReadingEntry>;
  updateEntry(entry: ReadingEntry): Promise<ReadingEntry>;
  deleteEntry(id: string): Promise<void>;
}

export interface DailyGoalRepository {
  getDailyGoals(): Promise<DailyGoal[]>;
  getCurrentDailyGoal(date?: string): Promise<DailyGoal>;
  getDailyGoalForDate(date: string): Promise<DailyGoal>;
  createDailyGoal(input: DailyGoalInput): Promise<DailyGoal>;
  updateDailyGoal(id: string, input: DailyGoalInput): Promise<DailyGoal>;
}

export interface PageStriderDataAccess {
  settings: SettingsRepository;
  reader: ReaderRepository;
  books: BookRepository;
  entries: ReadingEntryRepository;
  goals: DailyGoalRepository;
}

export interface DateRange {
  from: string;
  to: string;
}
