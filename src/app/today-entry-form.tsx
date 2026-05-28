"use client";

import { useState } from "react";

import { calculatePagesRead } from "@/domain";

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
  const [startPage, setStartPage] = useState(String(defaultStartPage));
  const [endPage, setEndPage] = useState("");
  const creditedPages = calculateCreditedPagesInputValue(startPage, endPage);

  return (
    <form action={action} className="stacked-form">
      <label>
        {UI_COPY.today.startPageLabel}
        <input
          name="startPage"
          type="number"
          min="1"
          max={maxPage}
          value={startPage}
          onChange={(event) => {
            setStartPage(event.target.value);
          }}
        />
      </label>
      <label>
        {UI_COPY.today.endPageLabel}
        <input
          name="endPage"
          type="number"
          min="1"
          max={maxPage}
          value={endPage}
          onChange={(event) => {
            setEndPage(event.target.value);
          }}
        />
      </label>
      <label>
        {UI_COPY.today.creditedPagesLabel}
        <input
          name="creditedPages"
          type="number"
          min="1"
          value={creditedPages}
          readOnly
          required
        />
      </label>
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

export function calculateCreditedPagesInputValue(startPage: string, endPage: string): string {
  if (startPage.trim() === "" || endPage.trim() === "") {
    return "";
  }

  const parsedStartPage = Number(startPage);
  const parsedEndPage = Number(endPage);

  if (!Number.isFinite(parsedStartPage) || !Number.isFinite(parsedEndPage)) {
    return "";
  }

  const pagesRead = calculatePagesRead(parsedStartPage, parsedEndPage);

  return pagesRead > 0 ? String(pagesRead) : "";
}
