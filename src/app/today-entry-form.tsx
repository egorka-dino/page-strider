import { PageRouteFields } from "./page-route-fields";
import { UI_COPY } from "./ui-copy";

interface TodayEntryFormProps {
  action: (formData: FormData) => void | Promise<void>;
  dailyGoalPages: number;
  defaultStartPage: number;
  maxPage: number;
}

export function TodayEntryForm({
  action,
  dailyGoalPages,
  defaultStartPage,
  maxPage
}: TodayEntryFormProps) {
  return (
    <form action={action} className="stacked-form">
      <PageRouteFields
        creditedPagesLabel={UI_COPY.today.creditedPagesLabel}
        defaultStartPage={defaultStartPage}
        endPageLabel={UI_COPY.today.endPageLabel}
        maxPage={maxPage}
        startPageLabel={UI_COPY.today.startPageLabel}
      />
      <p className="form-hint">{UI_COPY.today.creditedPagesHelp}</p>
      <label>
        {UI_COPY.today.noteLabel}
        <textarea name="note" rows={3} placeholder={UI_COPY.today.notePlaceholder} />
      </label>
      <p className="form-hint">{UI_COPY.today.formHint(dailyGoalPages)}</p>
      <button type="submit">{UI_COPY.today.saveButton}</button>
    </form>
  );
}
