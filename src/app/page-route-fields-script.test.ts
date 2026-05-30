import { describe, expect, it } from "vitest";

import { PAGE_ROUTE_FIELDS_SCRIPT } from "./page-route-fields-script";

describe("page route fields script", () => {
  it("uses document-level input delegation for current and future route fields", () => {
    expect(PAGE_ROUTE_FIELDS_SCRIPT).toContain('document.addEventListener("input"');
    expect(PAGE_ROUTE_FIELDS_SCRIPT).toContain("[data-page-route-fields]");
  });
});
