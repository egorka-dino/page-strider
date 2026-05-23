import Link from "next/link";

import {
  buildTeacherReportSummary,
  resolveDailyGoalsForEntries,
  type ReadingEntry
} from "@/domain";
import { createSupabaseDataAccess } from "@/data";

import { UI_COPY } from "../ui-copy";
import { ReportPrintButton } from "./print-button";

export const dynamic = "force-dynamic";

export default async function TeacherReportPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const data = createSupabaseDataAccess();
  const today = getTodayIsoDate();
  const range = normalizeReportRange({
    from: firstValue(params.from),
    to: firstValue(params.to),
    today
  });
  const [currentGoal, goals, reader, rawEntries] = await Promise.all([
    data.goals.getCurrentDailyGoal(today),
    data.goals.getDailyGoals(),
    data.reader.getReader(),
    data.entries.listEntries(range)
  ]);
  const sortedEntries = sortEntriesAscending(
    resolveDailyGoalsForEntries({
      entries: rawEntries,
      goals
    })
  );
  const summary = buildTeacherReportSummary({
    entries: sortedEntries,
    from: range.from,
    to: range.to,
    dailyGoalPages: currentGoal.pagesPerDay
  });

  return (
    <main className="report-shell">
      <section className="report-toolbar print-hidden">
        <div>
          <p className="eyebrow">{UI_COPY.report.toolbarEyebrow}</p>
          <h1>{UI_COPY.report.toolbarHeading}</h1>
        </div>
        <div className="report-actions">
          <Link className="text-link" href="/">
            {UI_COPY.report.backLink}
          </Link>
          <ReportPrintButton />
        </div>
      </section>

      <form action="/report" className="report-range-form print-hidden">
        <label>
          {UI_COPY.report.fromLabel}
          <input name="from" type="date" defaultValue={range.from} required />
        </label>
        <label>
          {UI_COPY.report.toLabel}
          <input name="to" type="date" defaultValue={range.to} required />
        </label>
        <button type="submit">{UI_COPY.report.applyRangeButton}</button>
      </form>

      <article className="teacher-report">
        <header className="report-header">
          <div>
            <p className="eyebrow">{UI_COPY.report.reportEyebrow}</p>
            <h2>{UI_COPY.report.reportHeading}</h2>
          </div>
          <dl>
            <div>
              <dt>{UI_COPY.report.readerLabel}</dt>
              <dd>{reader?.name || UI_COPY.report.readerFallback}</dd>
            </div>
            <div>
              <dt>{UI_COPY.report.periodLabel}</dt>
              <dd>{UI_COPY.report.periodValue(range.from, range.to)}</dd>
            </div>
            <div>
              <dt>{UI_COPY.report.dailyGoalLabel}</dt>
              <dd>{UI_COPY.report.historicalGoalValue}</dd>
            </div>
          </dl>
        </header>

        <dl className="report-summary" aria-label={UI_COPY.report.summaryLabel}>
          {[
            {
              label: UI_COPY.report.summary.totalPagesRead,
              value: UI_COPY.report.pagesValue(summary.totalPagesRead)
            },
            {
              label: UI_COPY.report.summary.readingDaysCount,
              value: UI_COPY.report.daysValue(summary.readingDaysCount)
            },
            {
              label: UI_COPY.report.summary.goalCompletedDaysCount,
              value: UI_COPY.report.daysValue(summary.goalCompletedDaysCount)
            },
            {
              label: UI_COPY.report.summary.averagePagesPerReadingDay,
              value:
                summary.averagePagesPerReadingDay === null
                  ? UI_COPY.report.noAverage
                  : UI_COPY.report.pagesValue(summary.averagePagesPerReadingDay)
            },
            {
              label: UI_COPY.report.summary.bestDayPages,
              value: UI_COPY.report.pagesValue(summary.bestDayPages)
            },
            {
              label: UI_COPY.report.summary.periodDaysCount,
              value: UI_COPY.report.daysValue(summary.periodDaysCount)
            }
          ].map((item) => (
            <div className="report-summary-item" key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        <section className="report-table-section">
          <h3>{UI_COPY.report.tableHeading}</h3>
          {sortedEntries.length > 0 ? (
            <table className="report-table">
              <thead>
                <tr>
                  <th>{UI_COPY.report.table.date}</th>
                  <th>{UI_COPY.report.table.book}</th>
                  <th>{UI_COPY.report.table.pages}</th>
                  <th>{UI_COPY.report.table.pagesRead}</th>
                  <th>{UI_COPY.report.table.dailyGoal}</th>
                  <th>{UI_COPY.report.table.goalStatus}</th>
                  <th>{UI_COPY.report.table.note}</th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      <time dateTime={entry.date}>{formatReportDate(entry.date)}</time>
                    </td>
                    <td>{entry.bookTitle}</td>
                    <td>{UI_COPY.report.pageRange(entry.startPage, entry.endPage)}</td>
                    <td>{UI_COPY.report.pagesValue(entry.pagesRead)}</td>
                    <td>{UI_COPY.report.pagesValue(entry.dailyGoalPages)}</td>
                    <td>{formatGoalStatus(entry)}</td>
                    <td>{entry.note || UI_COPY.report.emptyNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="report-empty">{UI_COPY.report.emptyRange}</p>
          )}
        </section>
      </article>
    </main>
  );
}

function normalizeReportRange(input: {
  from: string | undefined;
  to: string | undefined;
  today: string;
}) {
  const defaultFrom = addDays(input.today, -29);
  const from = isIsoDate(input.from) ? input.from : defaultFrom;
  const to = isIsoDate(input.to) ? input.to : input.today;

  return from <= to ? { from, to } : { from: to, to: from };
}

function formatGoalStatus(entry: ReadingEntry): string {
  return entry.pagesRead >= entry.dailyGoalPages
    ? UI_COPY.report.goalDone
    : UI_COPY.report.goalPartial;
}

function sortEntriesAscending(entries: ReadingEntry[]): ReadingEntry[] {
  return [...entries].sort((left, right) => left.date.localeCompare(right.date));
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isIsoDate(value: string | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function addDays(date: string, days: number): string {
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  parsedDate.setUTCDate(parsedDate.getUTCDate() + days);

  return parsedDate.toISOString().slice(0, 10);
}

function formatReportDate(date: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00.000Z`));
}

function getTodayIsoDate(): string {
  const timeZone = process.env.PAGESTRIDER_TIME_ZONE ?? "Europe/Minsk";
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return new Date().toISOString().slice(0, 10);
  }

  return `${year}-${month}-${day}`;
}
