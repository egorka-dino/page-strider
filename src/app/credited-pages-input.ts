import { calculatePagesRead } from "@/domain";

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
