import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("should handle conditional classes", () => {
    expect(cn("base-class", true && "conditional-class")).toBe(
      "base-class conditional-class",
    );
    expect(cn("base-class", false && "conditional-class")).toBe("base-class");
  });

  it("should merge Tailwind conflicting classes correctly", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("should handle undefined and null values", () => {
    expect(cn("base-class", undefined, null)).toBe("base-class");
  });

  it("should handle arrays of class names", () => {
    expect(cn(["class1", "class2"], "class3")).toBe("class1 class2 class3");
  });

  it("should handle objects with conditional classes", () => {
    expect(
      cn({
        class1: true,
        class2: false,
        class3: true,
      }),
    ).toBe("class1 class3");
  });
});
