import { calculateCreditedPagesInputValue } from "./credited-pages-input";

interface PageRouteFieldsProps {
  creditedPagesLabel: string;
  defaultEndPage?: number | null;
  defaultStartPage?: number | null;
  endPageLabel: string;
  maxPage?: number;
  startPageLabel: string;
}

export function PageRouteFields({
  creditedPagesLabel,
  defaultEndPage = null,
  defaultStartPage = null,
  endPageLabel,
  maxPage,
  startPageLabel
}: PageRouteFieldsProps) {
  const initialStartPage = defaultStartPage?.toString() ?? "";
  const initialEndPage = defaultEndPage?.toString() ?? "";
  const initialCreditedPages = calculateCreditedPagesInputValue(
    initialStartPage,
    initialEndPage
  );

  return (
    <span className="page-route-fields" data-page-route-fields>
      <label>
        {startPageLabel}
        <input
          data-page-route-start
          name="startPage"
          type="number"
          min="1"
          max={maxPage}
          defaultValue={initialStartPage}
        />
      </label>
      <label>
        {endPageLabel}
        <input
          data-page-route-end
          name="endPage"
          type="number"
          min="1"
          max={maxPage}
          defaultValue={initialEndPage}
        />
      </label>
      <label>
        {creditedPagesLabel}
        <input
          data-page-route-credited
          name="creditedPages"
          type="number"
          min="1"
          defaultValue={initialCreditedPages}
          readOnly
          required
        />
      </label>
    </span>
  );
}
