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
    <>
      <span className="page-route-fields">
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
      <script
        dangerouslySetInnerHTML={{
          __html: `(() => {
  const script = document.currentScript;
  const fields = script?.previousElementSibling;
  if (!fields) return;

  const startInput = fields.querySelector("[data-page-route-start]");
  const endInput = fields.querySelector("[data-page-route-end]");
  const creditedInput = fields.querySelector("[data-page-route-credited]");

  if (!startInput || !endInput || !creditedInput) return;

  const updateCreditedPages = () => {
    const startValue = startInput.value.trim();
    const endValue = endInput.value.trim();
    const startPage = Number(startValue);
    const endPage = Number(endValue);

    if (!startValue || !endValue || !Number.isFinite(startPage) || !Number.isFinite(endPage)) {
      creditedInput.value = "";
      return;
    }

    const pagesRead = Math.max(0, Math.floor(endPage) - Math.floor(startPage) + 1);
    creditedInput.value = pagesRead > 0 ? String(pagesRead) : "";
  };

  startInput.addEventListener("input", updateCreditedPages);
  endInput.addEventListener("input", updateCreditedPages);
  updateCreditedPages();
})();`
        }}
      />
    </>
  );
}
