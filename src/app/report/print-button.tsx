"use client";

import { UI_COPY } from "../ui-copy";

export function ReportPrintButton() {
  return (
    <button className="print-button" onClick={() => window.print()} type="button">
      {UI_COPY.report.printButton}
    </button>
  );
}
