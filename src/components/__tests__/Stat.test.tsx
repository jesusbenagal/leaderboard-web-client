import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/test-utils";
import { Stat } from "../Stat";

describe("Stat Component", () => {
  it("renders label and value correctly", () => {
    const label = "Test Label";
    const value = "Test Value";

    render(<Stat label={label} value={value} />);

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(value)).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    const label = "Test Label";
    const value = "Test Value";

    render(<Stat label={label} value={value} />);

    const labelElement = screen.getByText(label);
    const valueElement = screen.getByText(value);

    expect(labelElement).toHaveClass("text-slate-400");
    expect(valueElement).toHaveClass("text-slate-100", "font-semibold");
  });

  it("renders with empty values", () => {
    const { container } = render(<Stat label="" value="" />);

    // Check that the component renders without crashing
    expect(container.firstChild).toBeInTheDocument();

    // Check that both p elements are present
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
  });
});
