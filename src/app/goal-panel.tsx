import { sortDailyGoalsDescending, type DailyGoal } from "@/domain";

import { createDailyGoalAction, updateDailyGoalAction } from "./actions";
import { UI_COPY } from "./ui-copy";

export function DailyGoalPanel({
  currentGoal,
  goals,
  today
}: {
  currentGoal: DailyGoal;
  goals: DailyGoal[];
  today: string;
}) {
  const sortedGoals = sortDailyGoalsDescending(goals);

  return (
    <section className="daily-goal-panel">
      <div className="daily-goal-heading">
        <div>
          <p className="eyebrow">{UI_COPY.dailyGoal.eyebrow}</p>
          <h2>{UI_COPY.dailyGoal.heading}</h2>
        </div>
        <p className="muted">{UI_COPY.dailyGoal.copy}</p>
      </div>

      <div className="daily-goal-grid">
        <article className="current-goal-card">
          <span>{UI_COPY.dailyGoal.currentHeading}</span>
          <strong>{UI_COPY.dailyGoal.pagesValue(currentGoal.pagesPerDay)}</strong>
          <p>{UI_COPY.dailyGoal.effectiveFromValue(currentGoal.effectiveFrom)}</p>
        </article>

        <form action={createDailyGoalAction} className="goal-form">
          <h3>{UI_COPY.dailyGoal.changeHeading}</h3>
          <label>
            {UI_COPY.dailyGoal.pagesLabel}
            <input name="pagesPerDay" type="number" min={1} defaultValue={currentGoal.pagesPerDay} required />
          </label>
          <label>
            {UI_COPY.dailyGoal.effectiveFromLabel}
            <input name="effectiveFrom" type="date" defaultValue={today} required />
          </label>
          <label>
            {UI_COPY.dailyGoal.noteLabel}
            <textarea name="note" rows={2} placeholder={UI_COPY.dailyGoal.notePlaceholder} />
          </label>
          <button type="submit">{UI_COPY.dailyGoal.saveButton}</button>
        </form>
      </div>

      <details className="goal-history" open>
        <summary>{UI_COPY.dailyGoal.historyHeading}</summary>
        {sortedGoals.length > 0 ? (
          <div className="goal-history-list">
            {sortedGoals.map((goal) => (
              <form action={updateDailyGoalAction} className="goal-history-row" key={goal.id}>
                <input name="goalId" type="hidden" value={goal.id} />
                <label>
                  {UI_COPY.dailyGoal.pagesLabel}
                  <input name="pagesPerDay" type="number" min={1} defaultValue={goal.pagesPerDay} required />
                </label>
                <label>
                  {UI_COPY.dailyGoal.effectiveFromLabel}
                  <input name="effectiveFrom" type="date" defaultValue={goal.effectiveFrom} required />
                </label>
                <label>
                  {UI_COPY.dailyGoal.noteLabel}
                  <input name="note" defaultValue={goal.note ?? ""} placeholder={UI_COPY.dailyGoal.notePlaceholder} />
                </label>
                <button type="submit" className="secondary-button">
                  {UI_COPY.dailyGoal.saveButton}
                </button>
              </form>
            ))}
          </div>
        ) : (
          <p className="shelf-empty">{UI_COPY.dailyGoal.emptyHistory}</p>
        )}
      </details>
    </section>
  );
}
