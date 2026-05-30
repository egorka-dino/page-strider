export const PAGE_ROUTE_FIELDS_SCRIPT = `(() => {
  const updateRouteFields = (fields) => {
    const startInput = fields.querySelector("[data-page-route-start]");
    const endInput = fields.querySelector("[data-page-route-end]");
    const creditedInput = fields.querySelector("[data-page-route-credited]");

    if (!startInput || !endInput || !creditedInput) return;

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

  document.addEventListener("input", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) return;
    if (!target.matches("[data-page-route-start], [data-page-route-end]")) return;

    const fields = target.closest("[data-page-route-fields]");
    if (!fields) return;

    updateRouteFields(fields);
  });

  document.querySelectorAll("[data-page-route-fields]").forEach(updateRouteFields);
})();`;
