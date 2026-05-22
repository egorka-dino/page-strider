import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Book, BookStatus, ReadingEntry, ReaderProfile, Settings } from "@/domain";
import type {
  BookRepository,
  DateRange,
  PageStriderDataAccess,
  ReaderRepository,
  ReadingEntryRepository,
  SettingsRepository
} from "./contracts";

type SupabaseDatabase = SupabaseClient<any>;

export function createSupabaseDataAccess(): PageStriderDataAccess {
  const supabase = createServerSupabaseClient();

  return {
    settings: new SupabaseSettingsRepository(supabase),
    reader: new SupabaseReaderRepository(supabase),
    books: new SupabaseBookRepository(supabase),
    entries: new SupabaseReadingEntryRepository(supabase)
  };
}

function createServerSupabaseClient(): SupabaseDatabase {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createClient<any>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

class SupabaseSettingsRepository implements SettingsRepository {
  constructor(private readonly supabase: SupabaseDatabase) {}

  async getSettings(): Promise<Settings> {
    const { data, error } = await this.supabase
      .from("settings")
      .select("daily_goal_pages")
      .eq("id", true)
      .single();

    if (error) {
      throw error;
    }

    return {
      dailyGoalPages: Number(data.daily_goal_pages)
    };
  }

  async updateSettings(settings: Settings): Promise<Settings> {
    const { data, error } = await this.supabase
      .from("settings")
      .upsert({
        id: true,
        daily_goal_pages: settings.dailyGoalPages,
        updated_at: new Date().toISOString()
      })
      .select("daily_goal_pages")
      .single();

    if (error) {
      throw error;
    }

    return {
      dailyGoalPages: Number(data.daily_goal_pages)
    };
  }
}

class SupabaseReaderRepository implements ReaderRepository {
  constructor(private readonly supabase: SupabaseDatabase) {}

  async getReader(): Promise<ReaderProfile | null> {
    const { data, error } = await this.supabase
      .from("reader_profiles")
      .select("name")
      .eq("id", true)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? { name: String(data.name) } : null;
  }

  async updateReader(reader: ReaderProfile): Promise<ReaderProfile> {
    const { data, error } = await this.supabase
      .from("reader_profiles")
      .upsert({
        id: true,
        name: reader.name,
        updated_at: new Date().toISOString()
      })
      .select("name")
      .single();

    if (error) {
      throw error;
    }

    return { name: String(data.name) };
  }
}

class SupabaseBookRepository implements BookRepository {
  constructor(private readonly supabase: SupabaseDatabase) {}

  async getActiveBook(): Promise<Book | null> {
    const { data, error } = await this.supabase
      .from("books")
      .select("*")
      .eq("status", "reading")
      .order("started_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? mapBook(data) : null;
  }

  async createBook(book: Omit<Book, "id">): Promise<Book> {
    const { error: pauseError } = await this.supabase
      .from("books")
      .update({ status: "paused", updated_at: new Date().toISOString() })
      .eq("status", "reading");

    if (pauseError) {
      throw pauseError;
    }

    const { data, error } = await this.supabase
      .from("books")
      .insert(mapBookInsert(book))
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapBook(data);
  }

  async updateBook(book: Book): Promise<Book> {
    const { data, error } = await this.supabase
      .from("books")
      .update({
        ...mapBookInsert(book),
        updated_at: new Date().toISOString()
      })
      .eq("id", book.id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapBook(data);
  }

  async finishActiveBook(finishedDate: string): Promise<Book> {
    const activeBook = await this.getActiveBook();

    if (!activeBook) {
      throw new Error("No active book to finish.");
    }

    return this.updateBook({
      ...activeBook,
      status: "finished",
      currentPage: activeBook.totalPages,
      finishedDate
    });
  }
}

class SupabaseReadingEntryRepository implements ReadingEntryRepository {
  constructor(private readonly supabase: SupabaseDatabase) {}

  async listEntries(range?: DateRange): Promise<ReadingEntry[]> {
    let query = this.supabase
      .from("reading_entries")
      .select("*")
      .order("date", { ascending: false });

    if (range) {
      query = query.gte("date", range.from).lte("date", range.to);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data.map(mapReadingEntry);
  }

  async getEntryByDate(date: string): Promise<ReadingEntry | null> {
    const { data, error } = await this.supabase
      .from("reading_entries")
      .select("*")
      .eq("date", date)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? mapReadingEntry(data) : null;
  }

  async upsertEntry(entry: Omit<ReadingEntry, "id">): Promise<ReadingEntry> {
    const { data, error } = await this.supabase
      .from("reading_entries")
      .upsert(
        {
          date: entry.date,
          book_id: entry.bookId,
          book_title: entry.bookTitle,
          start_page: entry.startPage,
          end_page: entry.endPage,
          pages_read: entry.pagesRead,
          daily_goal_pages: entry.dailyGoalPages,
          note: entry.note ?? null,
          updated_at: new Date().toISOString()
        },
        { onConflict: "date" }
      )
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapReadingEntry(data);
  }
}

function mapBook(row: Record<string, unknown>): Book {
  return {
    id: String(row.id),
    title: String(row.title),
    author: String(row.author),
    totalPages: Number(row.total_pages),
    startPage: Number(row.start_page),
    currentPage: Number(row.current_page),
    status: String(row.status) as BookStatus,
    startedDate: String(row.started_date),
    finishedDate: row.finished_date ? String(row.finished_date) : null
  };
}

function mapBookInsert(book: Omit<Book, "id">) {
  return {
    title: book.title,
    author: book.author,
    total_pages: book.totalPages,
    start_page: book.startPage,
    current_page: book.currentPage,
    status: book.status,
    started_date: book.startedDate,
    finished_date: book.finishedDate
  };
}

function mapReadingEntry(row: Record<string, unknown>): ReadingEntry {
  const note = row.note ? { note: String(row.note) } : {};

  return {
    id: String(row.id),
    date: String(row.date),
    bookId: String(row.book_id),
    bookTitle: String(row.book_title),
    startPage: Number(row.start_page),
    endPage: Number(row.end_page),
    pagesRead: Number(row.pages_read),
    dailyGoalPages: Number(row.daily_goal_pages),
    ...note
  };
}
