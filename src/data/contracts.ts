import type { Book, ReadingEntry, ReaderProfile, Settings } from "@/domain";

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
  getEntryByDate(date: string): Promise<ReadingEntry | null>;
  upsertEntry(entry: Omit<ReadingEntry, "id">): Promise<ReadingEntry>;
}

export interface PageStriderDataAccess {
  settings: SettingsRepository;
  reader: ReaderRepository;
  books: BookRepository;
  entries: ReadingEntryRepository;
}

export interface DateRange {
  from: string;
  to: string;
}
