import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/test-utils";
import { BetRow } from "../BetRow";
import type { Bet } from "../../lib/types";

// Mock data for testing
const mockBet: Bet = {
  id: 123,
  playerId: 1,
  playerUsername: "testuser",
  playerAvatar: "https://example.com/avatar.jpg",
  amount: 1500.5,
  betType: "Football",
  timestamp: "2024-01-15T10:30:00Z",
  status: "active",
};

const mockBetMinimal: Bet = {
  id: 456,
  playerId: 2,
  playerUsername: "minimaluser",
  amount: 100,
  betType: "Basketball",
  timestamp: "2024-01-15T11:00:00Z",
};

describe("BetRow Component", () => {
  it("renders bet information correctly", () => {
    render(<BetRow bet={mockBet} />);

    // Use getByText with a function to handle text split across elements
    expect(
      screen.getByText((content, element) => {
        return element?.textContent === "Football — #123";
      })
    ).toBeInTheDocument();

    expect(screen.getByText("1501 €")).toBeInTheDocument(); // formatCurrency result
  });

  it("renders timestamp correctly", () => {
    render(<BetRow bet={mockBet} />);

    // Check that timestamp is rendered (exact format may vary by locale)
    const timestampElement = screen.getByText((content, element) => {
      return (
        element?.tagName === "P" &&
        element?.textContent?.includes("2024") === true
      );
    });
    expect(timestampElement).toBeInTheDocument();
  });

  it("renders with minimal bet data", () => {
    render(<BetRow bet={mockBetMinimal} />);

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === "Basketball — #456";
      })
    ).toBeInTheDocument();

    expect(screen.getByText("100 €")).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    const { container } = render(<BetRow bet={mockBet} />);

    const listItem = container.querySelector("li");
    const betTypeElement = screen.getByText((content, element) => {
      return element?.textContent === "Football — #123";
    });
    const timestampElement = screen.getByText((content, element) => {
      return (
        element?.tagName === "P" &&
        element?.textContent?.includes("2024") === true
      );
    });
    const amountElement = screen.getByText("1501 €");

    // Check list item classes
    expect(listItem).toHaveClass(
      "flex",
      "items-center",
      "justify-between",
      "gap-3",
      "rounded-lg",
      "border",
      "border-slate-800",
      "bg-slate-900/50",
      "px-3",
      "py-2"
    );

    // Check bet type classes
    expect(betTypeElement).toHaveClass("text-sm", "text-slate-200", "truncate");

    // Check timestamp classes
    expect(timestampElement).toHaveClass(
      "text-xs",
      "text-slate-500",
      "truncate"
    );

    // Check amount classes
    expect(amountElement).toHaveClass("text-green-400", "font-semibold");
  });

  it("handles long bet type with truncate", () => {
    const longBetType = "Very Long Bet Type Name That Should Be Truncated";
    const betWithLongType: Bet = {
      ...mockBet,
      betType: longBetType,
    };

    render(<BetRow bet={betWithLongType} />);

    // Find the specific p element that contains the bet type
    const betTypeElement = screen.getByText((content, element) => {
      return (
        element?.tagName === "P" &&
        element?.textContent?.includes(longBetType) === true
      );
    });
    expect(betTypeElement).toHaveClass("truncate");
  });

  it("handles long username with truncate", () => {
    const longUsername = "verylongusernamethatshouldbetruncated";
    const betWithLongUsername: Bet = {
      ...mockBet,
      playerUsername: longUsername,
    };

    render(<BetRow bet={betWithLongUsername} />);

    // The username is not directly rendered, but the bet type should have truncate
    const betTypeElement = screen.getByText((content, element) => {
      return element?.textContent === "Football — #123";
    });
    expect(betTypeElement).toHaveClass("truncate");
  });

  it("renders with zero amount", () => {
    const betWithZeroAmount: Bet = {
      ...mockBet,
      amount: 0,
    };

    render(<BetRow bet={betWithZeroAmount} />);

    expect(screen.getByText("0 €")).toBeInTheDocument();
  });

  it("renders with negative amount", () => {
    const betWithNegativeAmount: Bet = {
      ...mockBet,
      amount: -500,
    };

    render(<BetRow bet={betWithNegativeAmount} />);

    expect(screen.getByText("-500 €")).toBeInTheDocument();
  });

  it("renders with large amount", () => {
    const betWithLargeAmount: Bet = {
      ...mockBet,
      amount: 999999.99,
    };

    render(<BetRow bet={betWithLargeAmount} />);

    expect(screen.getByText("1.000.000 €")).toBeInTheDocument();
  });

  it("renders without optional avatar", () => {
    const betWithoutAvatar: Bet = {
      ...mockBetMinimal,
      playerAvatar: undefined,
    };

    render(<BetRow bet={betWithoutAvatar} />);

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === "Basketball — #456";
      })
    ).toBeInTheDocument();
  });

  it("renders without optional status", () => {
    const betWithoutStatus: Bet = {
      ...mockBet,
      status: undefined,
    };

    render(<BetRow bet={betWithoutStatus} />);

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === "Football — #123";
      })
    ).toBeInTheDocument();
    expect(screen.getByText("1501 €")).toBeInTheDocument();
  });
});
