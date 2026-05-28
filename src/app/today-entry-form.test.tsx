import { describe, expect, it } from "vitest";

import { calculateCreditedPagesInputValue } from "./today-entry-form";

describe("today entry form helpers", () => {
  it("calculates credited pages from the entered start and end pages", () => {
    expect(calculateCreditedPagesInputValue("7", "48")).toBe("42");
  });

  it("keeps the credited pages empty until a valid page route exists", () => {
    expect(calculateCreditedPagesInputValue("7", "")).toBe("");
    expect(calculateCreditedPagesInputValue("48", "7")).toBe("");
  });
});
