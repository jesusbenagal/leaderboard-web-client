import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/test-utils";
import { ProfileStat } from "../ProfileStat";

describe("ProfileStat Component", () => {
  it("renders label and value correctly", () => {
    const label = "Test Label";
    const value = "Test Value";

    render(<ProfileStat label={label} value={value} />);

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(value)).toBeInTheDocument();
  });

  it("renders with number value", () => {
    const label = "Score";
    const value = 1234;

    render(<ProfileStat label={label} value={value} />);

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText("1234")).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    const label = "Test Label";
    const value = "Test Value";

    render(<ProfileStat label={label} value={value} />);

    const container = screen.getByText(label).closest("div");
    const labelElement = screen.getByText(label);
    const valueElement = screen.getByText(value);

    // Check container classes
    expect(container).toHaveClass(
      "rounded-lg",
      "border",
      "border-slate-800",
      "bg-slate-900/60",
      "p-3"
    );

    // Check label classes
    expect(labelElement).toHaveClass("text-slate-400", "text-xs");

    // Check value classes
    expect(valueElement).toHaveClass(
      "text-white",
      "font-semibold",
      "mt-1",
      "truncate"
    );
  });

  it("handles long text with truncate class", () => {
    const label = "Very Long Label That Should Be Truncated";
    const value = "Very Long Value That Should Also Be Truncated";

    render(<ProfileStat label={label} value={value} />);

    const valueElement = screen.getByText(value);
    expect(valueElement).toHaveClass("truncate");
  });

  it("renders with empty values", () => {
    const { container } = render(<ProfileStat label="" value="" />);

    // Check that the component renders without crashing
    expect(container.firstChild).toBeInTheDocument();

    // Check that both p elements are present
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
  });

  it("renders with zero value", () => {
    const label = "Count";
    const value = 0;

    render(<ProfileStat label={label} value={value} />);

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders with negative number value", () => {
    const label = "Balance";
    const value = -100;

    render(<ProfileStat label={label} value={value} />);

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText("-100")).toBeInTheDocument();
  });
});
