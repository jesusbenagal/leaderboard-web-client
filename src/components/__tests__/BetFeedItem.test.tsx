import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/test-utils";
import { BetFeedItem } from "../BetFeedItem";
import type { Bet } from "../../lib/types";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    li: ({
      children,
      layout,
      layoutId,
      initial,
      animate,
      exit,
      transition,
      className,
      role,
      ...props
    }: {
      children: React.ReactNode;
      layout?: boolean;
      layoutId?: string;
      initial?: Record<string, unknown>;
      animate?: Record<string, unknown>;
      exit?: Record<string, unknown>;
      transition?: Record<string, unknown>;
      className?: string;
      role?: string;
      [key: string]: unknown;
    }) => (
      <li
        data-testid="motion-li"
        {...(layout && { layout: "true" })}
        {...(layoutId && { "data-layout-id": layoutId })}
        {...(initial && { "data-initial": JSON.stringify(initial) })}
        {...(animate && { "data-animate": JSON.stringify(animate) })}
        {...(exit && { "data-exit": JSON.stringify(exit) })}
        {...(transition && { "data-transition": JSON.stringify(transition) })}
        className={className}
        role={role}
        {...props}
      >
        {children}
      </li>
    ),
    span: ({
      children,
      initial,
      animate,
      transition,
      className,
      ...props
    }: {
      children: React.ReactNode;
      initial?: Record<string, unknown>;
      animate?: Record<string, unknown>;
      transition?: Record<string, unknown>;
      className?: string;
      [key: string]: unknown;
    }) => (
      <span
        data-testid="motion-span"
        {...(initial && { "data-initial": JSON.stringify(initial) })}
        {...(animate && { "data-animate": JSON.stringify(animate) })}
        {...(transition && { "data-transition": JSON.stringify(transition) })}
        className={className}
        {...props}
      >
        {children}
      </span>
    ),
  },
}));

// Mock time utility
vi.mock("../../lib/time", () => ({
  timeAgo: vi.fn((iso: string) => {
    // Mock implementation that returns a predictable value
    const date = new Date(iso);
    const now = new Date("2024-01-15T12:00:00Z");
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins}m`;
  }),
}));

// Mock format utility
vi.mock("../../lib/format", () => ({
  formatCurrency: vi.fn((amount: number) => `${amount} €`),
}));

// Mock data
const mockBet: Bet = {
  id: 123,
  playerId: 1,
  playerUsername: "testuser",
  playerAvatar: "https://example.com/avatar.jpg",
  amount: 1500.5,
  betType: "Football",
  timestamp: "2024-01-15T10:30:00Z",
  status: "won",
};

const mockBetMinimal: Bet = {
  id: 456,
  playerId: 2,
  playerUsername: "minimaluser",
  amount: 100,
  betType: "Basketball",
  timestamp: "2024-01-15T11:00:00Z",
};

describe("BetFeedItem Component", () => {
  it("renders bet information correctly", () => {
    render(<BetFeedItem bet={mockBet} />);

    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => {
        return element?.textContent === " • Football";
      })
    ).toBeInTheDocument();
    expect(screen.getByText("1500.5 €")).toBeInTheDocument();
  });

  it("renders with custom avatar", () => {
    render(<BetFeedItem bet={mockBet} />);

    const img = screen.getByAltText("testuser");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("renders with default avatar when playerAvatar is not provided", () => {
    render(<BetFeedItem bet={mockBetMinimal} />);

    const img = screen.getByAltText("minimaluser");
    expect(img).toHaveAttribute(
      "src",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=2"
    );
  });

  it("renders with undefined playerAvatar", () => {
    const betWithUndefinedAvatar: Bet = {
      ...mockBet,
      playerAvatar: undefined,
    };

    render(<BetFeedItem bet={betWithUndefinedAvatar} />);

    const img = screen.getByAltText("testuser");
    expect(img).toHaveAttribute(
      "src",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=1"
    );
  });

  it("renders time ago correctly", () => {
    render(<BetFeedItem bet={mockBet} />);

    expect(screen.getByText("90m ago")).toBeInTheDocument();
  });

  it("applies correct CSS classes to motion li", () => {
    render(<BetFeedItem bet={mockBet} />);

    const motionLi = screen.getByTestId("motion-li");
    expect(motionLi).toHaveClass(
      "relative",
      "flex",
      "items-center",
      "gap-3",
      "rounded-lg",
      "bg-slate-800/50",
      "px-3",
      "py-2",
      "border",
      "border-slate-700/60"
    );
  });

  it("applies correct CSS classes to avatar image", () => {
    render(<BetFeedItem bet={mockBet} />);

    const img = screen.getByAltText("testuser");
    expect(img).toHaveClass(
      "h-8",
      "w-8",
      "rounded-full",
      "border",
      "border-slate-700",
      "bg-slate-800"
    );
  });

  it("applies correct CSS classes to content div", () => {
    const { container } = render(<BetFeedItem bet={mockBet} />);

    const contentDiv = container.querySelector(".min-w-0.flex-1");
    expect(contentDiv).toHaveClass("min-w-0", "flex-1");
  });

  it("applies correct CSS classes to username and bet type", () => {
    render(<BetFeedItem bet={mockBet} />);

    const usernameSpan = screen.getByText("testuser");
    const betTypeSpan = screen.getByText((_, element) => {
      return element?.textContent === " • Football";
    });

    expect(usernameSpan).toHaveClass("font-medium");
    expect(betTypeSpan).toHaveClass("text-slate-400");
  });

  it("applies correct CSS classes to time text", () => {
    render(<BetFeedItem bet={mockBet} />);

    const timeText = screen.getByText("90m ago");
    expect(timeText).toHaveClass("text-xs", "text-slate-500");
  });

  it("applies correct CSS classes to amount", () => {
    render(<BetFeedItem bet={mockBet} />);

    const amountDiv = screen.getByText("1500.5 €");
    expect(amountDiv).toHaveClass(
      "text-right",
      "font-semibold",
      "text-green-400",
      "tabular-nums"
    );
  });

  it("applies correct CSS classes to motion span", () => {
    render(<BetFeedItem bet={mockBet} />);

    const motionSpan = screen.getByTestId("motion-span");
    expect(motionSpan).toHaveClass(
      "absolute",
      "left-0",
      "top-0",
      "bottom-0",
      "rounded-l-lg",
      "bg-green-500/60",
      "pointer-events-none"
    );
  });

  it("passes correct props to motion li", () => {
    render(<BetFeedItem bet={mockBet} />);

    const motionLi = screen.getByTestId("motion-li");
    expect(motionLi).toHaveAttribute("layout", "true");
    expect(motionLi).toHaveAttribute("data-layout-id", "bet-123");
    expect(motionLi).toHaveAttribute("role", "listitem");
  });

  it("passes correct animation props to motion li", () => {
    render(<BetFeedItem bet={mockBet} />);

    const motionLi = screen.getByTestId("motion-li");
    expect(motionLi).toHaveAttribute("data-initial");
    expect(motionLi).toHaveAttribute("data-animate");
    expect(motionLi).toHaveAttribute("data-exit");
    expect(motionLi).toHaveAttribute("data-transition");
  });

  it("passes correct animation props to motion span", () => {
    render(<BetFeedItem bet={mockBet} />);

    const motionSpan = screen.getByTestId("motion-span");
    expect(motionSpan).toHaveAttribute("data-initial");
    expect(motionSpan).toHaveAttribute("data-animate");
    expect(motionSpan).toHaveAttribute("data-transition");
  });

  it("handles long username with truncate", () => {
    const longUsername = "verylongusernamethatshouldbetruncated";
    const betWithLongUsername: Bet = {
      ...mockBet,
      playerUsername: longUsername,
    };

    render(<BetFeedItem bet={betWithLongUsername} />);

    expect(screen.getByText(longUsername)).toBeInTheDocument();
  });

  it("handles long bet type with truncate", () => {
    const longBetType = "Very Long Bet Type Name That Should Be Truncated";
    const betWithLongType: Bet = {
      ...mockBet,
      betType: longBetType,
    };

    render(<BetFeedItem bet={betWithLongType} />);

    expect(
      screen.getByText((_, element) => {
        return element?.textContent === ` • ${longBetType}`;
      })
    ).toBeInTheDocument();
  });

  it("renders with zero amount", () => {
    const betWithZeroAmount: Bet = {
      ...mockBet,
      amount: 0,
    };

    render(<BetFeedItem bet={betWithZeroAmount} />);

    expect(screen.getByText("0 €")).toBeInTheDocument();
  });

  it("renders with negative amount", () => {
    const betWithNegativeAmount: Bet = {
      ...mockBet,
      amount: -500,
    };

    render(<BetFeedItem bet={betWithNegativeAmount} />);

    expect(screen.getByText("-500 €")).toBeInTheDocument();
  });

  it("renders with large amount", () => {
    const betWithLargeAmount: Bet = {
      ...mockBet,
      amount: 999999.99,
    };

    render(<BetFeedItem bet={betWithLargeAmount} />);

    expect(screen.getByText("999999.99 €")).toBeInTheDocument();
  });

  it("renders without optional status", () => {
    const betWithoutStatus: Bet = {
      ...mockBet,
      status: undefined,
    };

    render(<BetFeedItem bet={betWithoutStatus} />);

    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => {
        return element?.textContent === " • Football";
      })
    ).toBeInTheDocument();
    expect(screen.getByText("1500.5 €")).toBeInTheDocument();
  });

  it("handles different bet types", () => {
    const betTypes = ["Football", "Basketball", "Tennis", "Baseball", "Soccer"];

    betTypes.forEach((betType) => {
      const bet: Bet = {
        ...mockBet,
        betType,
        id: Math.random(),
      };

      const { unmount } = render(<BetFeedItem bet={bet} />);
      expect(
        screen.getByText((_, element) => {
          return element?.textContent === ` • ${betType}`;
        })
      ).toBeInTheDocument();
      unmount();
    });
  });

  it("handles different player IDs for avatar generation", () => {
    const playerIds = [1, 2, 3, 100, 999];

    playerIds.forEach((playerId) => {
      const bet: Bet = {
        ...mockBet,
        playerId,
        id: Math.random(),
        playerAvatar: undefined, // Force use of generated avatar
      };

      const { unmount } = render(<BetFeedItem bet={bet} />);
      const img = screen.getByAltText("testuser");
      expect(img).toHaveAttribute(
        "src",
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${playerId}`
      );
      unmount();
    });
  });

  it("has correct image attributes", () => {
    render(<BetFeedItem bet={mockBet} />);

    const img = screen.getByAltText("testuser");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("has correct aria-hidden on motion span", () => {
    render(<BetFeedItem bet={mockBet} />);

    const motionSpan = screen.getByTestId("motion-span");
    expect(motionSpan).toHaveAttribute("aria-hidden", "true");
  });
});
