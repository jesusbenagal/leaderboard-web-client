import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../test/test-utils";
import { LeaderboardRow } from "../LeaderboardRow";
import type { LeaderboardEntry } from "../../lib/types";

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
      className,
      role,
      tabIndex,
      onClick,
      onKeyDown,
      ...props
    }: {
      children: React.ReactNode;
      layout?: boolean;
      layoutId?: string;
      initial?: Record<string, unknown>;
      animate?: Record<string, unknown>;
      exit?: Record<string, unknown>;
      className?: string;
      role?: string;
      tabIndex?: number;
      onClick?: () => void;
      onKeyDown?: (e: React.KeyboardEvent) => void;
      [key: string]: unknown;
    }) => (
      <li
        data-testid="motion-li"
        {...(layout && { layout: "true" })}
        {...(layoutId && { "data-layout-id": layoutId })}
        {...(initial && { "data-initial": JSON.stringify(initial) })}
        {...(animate && { "data-animate": JSON.stringify(animate) })}
        {...(exit && { "data-exit": JSON.stringify(exit) })}
        className={className}
        role={role}
        tabIndex={tabIndex}
        onClick={onClick}
        onKeyDown={onKeyDown}
        {...props}
      >
        {children}
      </li>
    ),
  },
}));

// Mock clsx
vi.mock("clsx", () => ({
  clsx: (...args: unknown[]) => args.filter(Boolean).join(" "),
}));

// Mock format utility
vi.mock("../../lib/format", () => ({
  formatCurrency: vi.fn((amount: number) => `${amount} €`),
}));

// Mock data
const mockLeaderboardEntry: LeaderboardEntry = {
  rank: 1,
  playerId: 1,
  username: "testuser",
  avatar: "https://example.com/avatar.jpg",
  totalBets: 5000,
  betsCount: 10,
  prize: 1000,
  lastBetTime: "2024-01-15T10:30:00Z",
};

const mockLeaderboardEntryMinimal: LeaderboardEntry = {
  rank: 5,
  playerId: 2,
  username: "minimaluser",
  avatar: "https://example.com/minimal.jpg",
  totalBets: 2000,
};

describe("LeaderboardRow Component", () => {
  it("renders rank correctly", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders username correctly", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("renders total bets correctly", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    expect(screen.getByText("5000 €")).toBeInTheDocument();
  });

  it("renders with custom avatar", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    const img = screen.getByAltText("testuser");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("renders with default avatar when avatar is not provided", () => {
    const entryWithoutAvatar: LeaderboardEntry = {
      ...mockLeaderboardEntryMinimal,
      avatar: undefined as unknown as string,
    };

    render(<LeaderboardRow row={entryWithoutAvatar} />);

    const img = screen.getByAltText("minimaluser");
    expect(img).toHaveAttribute(
      "src",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=2"
    );
  });

  it("renders with undefined avatar", () => {
    const entryWithUndefinedAvatar: LeaderboardEntry = {
      ...mockLeaderboardEntry,
      avatar: undefined as unknown as string,
    };

    render(<LeaderboardRow row={entryWithUndefinedAvatar} />);

    const img = screen.getByAltText("testuser");
    expect(img).toHaveAttribute(
      "src",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=1"
    );
  });

  it("applies correct CSS classes for top 5 rank", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    const wagersDiv = screen.getByText("5000 €");
    expect(wagersDiv).toHaveClass("text-green-400");
  });

  it("applies correct CSS classes for rank 6+", () => {
    const entryRank6: LeaderboardEntry = {
      ...mockLeaderboardEntry,
      rank: 6,
    };

    render(<LeaderboardRow row={entryRank6} />);

    const wagersDiv = screen.getByText("5000 €");
    expect(wagersDiv).toHaveClass("text-slate-300");
  });

  it("applies correct CSS classes for top 3 rank badge", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    const rankBadge = screen.getByText("1");
    expect(rankBadge).toHaveClass(
      "bg-amber-500/25",
      "border",
      "border-amber-300/40",
      "text-amber-200"
    );
  });

  it("applies correct CSS classes for rank 4+ badge", () => {
    const entryRank4: LeaderboardEntry = {
      ...mockLeaderboardEntry,
      rank: 4,
    };

    render(<LeaderboardRow row={entryRank4} />);

    const rankBadge = screen.getByText("4");
    expect(rankBadge).toHaveClass(
      "bg-slate-700/40",
      "border",
      "border-slate-600",
      "text-slate-300"
    );
  });

  it("applies correct CSS classes for even rank", () => {
    const entryRank2: LeaderboardEntry = {
      ...mockLeaderboardEntry,
      rank: 2,
    };

    render(<LeaderboardRow row={entryRank2} />);

    const motionLi = screen.getByTestId("motion-li");
    expect(motionLi).toHaveClass("bg-slate-800/60");
  });

  it("applies correct CSS classes for odd rank", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    const motionLi = screen.getByTestId("motion-li");
    expect(motionLi).toHaveClass("bg-slate-800/40");
  });

  it("applies correct CSS classes to motion li", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    const motionLi = screen.getByTestId("motion-li");
    expect(motionLi).toHaveClass(
      "lb-grid",
      "items-center",
      "px-2",
      "py-3",
      "rounded-lg",
      "cursor-pointer",
      "select-none",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-emerald-500/40"
    );
  });

  it("applies correct CSS classes to avatar image", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    const img = screen.getByAltText("testuser");
    expect(img).toHaveClass(
      "h-8",
      "w-8",
      "shrink-0",
      "rounded-full",
      "border",
      "border-slate-700",
      "bg-slate-800"
    );
  });

  it("applies correct CSS classes to username", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    const username = screen.getByText("testuser");
    expect(username).toHaveClass("truncate", "font-medium");
  });

  it("applies correct CSS classes to wagers div", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    const wagersDiv = screen.getByText("5000 €");
    expect(wagersDiv).toHaveClass(
      "text-right",
      "font-semibold",
      "tabular-nums",
      "whitespace-nowrap",
      "pr-3",
      "sm:pr-0"
    );
  });

  it("passes correct props to motion li", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    const motionLi = screen.getByTestId("motion-li");
    expect(motionLi).toHaveAttribute("layout", "true");
    expect(motionLi).toHaveAttribute("data-layout-id", "row-1");
    expect(motionLi).toHaveAttribute("role", "button");
    expect(motionLi).toHaveAttribute("tabIndex", "0");
  });

  it("passes correct animation props to motion li", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    const motionLi = screen.getByTestId("motion-li");
    expect(motionLi).toHaveAttribute("data-initial");
    expect(motionLi).toHaveAttribute("data-animate");
    expect(motionLi).toHaveAttribute("data-exit");
  });

  it("calls onSelect when clicked", () => {
    const mockOnSelect = vi.fn();
    render(
      <LeaderboardRow row={mockLeaderboardEntry} onSelect={mockOnSelect} />
    );

    const motionLi = screen.getByTestId("motion-li");
    fireEvent.click(motionLi);

    expect(mockOnSelect).toHaveBeenCalledWith(mockLeaderboardEntry);
  });

  it("calls onSelect when Enter key is pressed", () => {
    const mockOnSelect = vi.fn();
    render(
      <LeaderboardRow row={mockLeaderboardEntry} onSelect={mockOnSelect} />
    );

    const motionLi = screen.getByTestId("motion-li");
    fireEvent.keyDown(motionLi, { key: "Enter" });

    expect(mockOnSelect).toHaveBeenCalledWith(mockLeaderboardEntry);
  });

  it("calls onSelect when Space key is pressed", () => {
    const mockOnSelect = vi.fn();
    render(
      <LeaderboardRow row={mockLeaderboardEntry} onSelect={mockOnSelect} />
    );

    const motionLi = screen.getByTestId("motion-li");
    fireEvent.keyDown(motionLi, { key: " " });

    expect(mockOnSelect).toHaveBeenCalledWith(mockLeaderboardEntry);
  });

  it("does not call onSelect when other keys are pressed", () => {
    const mockOnSelect = vi.fn();
    render(
      <LeaderboardRow row={mockLeaderboardEntry} onSelect={mockOnSelect} />
    );

    const motionLi = screen.getByTestId("motion-li");
    fireEvent.keyDown(motionLi, { key: "Escape" });

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it("handles click when onSelect is not provided", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    const motionLi = screen.getByTestId("motion-li");
    expect(() => fireEvent.click(motionLi)).not.toThrow();
  });

  it("handles keyDown when onSelect is not provided", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    const motionLi = screen.getByTestId("motion-li");
    expect(() => fireEvent.keyDown(motionLi, { key: "Enter" })).not.toThrow();
  });

  it("handles different rank values", () => {
    const ranks = [1, 2, 3, 4, 5, 6, 10, 100];

    ranks.forEach((rank) => {
      const entry: LeaderboardEntry = {
        ...mockLeaderboardEntry,
        rank,
        playerId: rank,
      };

      const { unmount } = render(<LeaderboardRow row={entry} />);
      expect(screen.getByText(rank.toString())).toBeInTheDocument();
      unmount();
    });
  });

  it("handles different player IDs for avatar generation", () => {
    const playerIds = [1, 2, 3, 100, 999];

    playerIds.forEach((playerId) => {
      const entry: LeaderboardEntry = {
        ...mockLeaderboardEntry,
        playerId,
        avatar: undefined as unknown as string,
      };

      const { unmount } = render(<LeaderboardRow row={entry} />);
      const img = screen.getByAltText("testuser");
      expect(img).toHaveAttribute(
        "src",
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${playerId}`
      );
      unmount();
    });
  });

  it("handles long usernames with truncate", () => {
    const longUsername = "verylongusernamethatshouldbetruncated";
    const entryWithLongUsername: LeaderboardEntry = {
      ...mockLeaderboardEntry,
      username: longUsername,
    };

    render(<LeaderboardRow row={entryWithLongUsername} />);

    expect(screen.getByText(longUsername)).toBeInTheDocument();
    const username = screen.getByText(longUsername);
    expect(username).toHaveClass("truncate");
  });

  it("handles zero total bets", () => {
    const entryWithZeroBets: LeaderboardEntry = {
      ...mockLeaderboardEntry,
      totalBets: 0,
    };

    render(<LeaderboardRow row={entryWithZeroBets} />);

    expect(screen.getByText("0 €")).toBeInTheDocument();
  });

  it("handles large total bets", () => {
    const entryWithLargeBets: LeaderboardEntry = {
      ...mockLeaderboardEntry,
      totalBets: 999999999,
    };

    render(<LeaderboardRow row={entryWithLargeBets} />);

    expect(screen.getByText("999999999 €")).toBeInTheDocument();
  });

  it("handles negative total bets", () => {
    const entryWithNegativeBets: LeaderboardEntry = {
      ...mockLeaderboardEntry,
      totalBets: -1000,
    };

    render(<LeaderboardRow row={entryWithNegativeBets} />);

    expect(screen.getByText("-1000 €")).toBeInTheDocument();
  });

  it("has correct image attributes", () => {
    render(<LeaderboardRow row={mockLeaderboardEntry} />);

    const img = screen.getByAltText("testuser");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("handles edge case: rank 0", () => {
    const entryRank0: LeaderboardEntry = {
      ...mockLeaderboardEntry,
      rank: 0,
    };

    render(<LeaderboardRow row={entryRank0} />);

    expect(screen.getByText("0")).toBeInTheDocument();
    const wagersDiv = screen.getByText("5000 €");
    expect(wagersDiv).toHaveClass("text-green-400");
  });

  it("handles edge case: rank exactly 5", () => {
    const entryRank5: LeaderboardEntry = {
      ...mockLeaderboardEntry,
      rank: 5,
    };

    render(<LeaderboardRow row={entryRank5} />);

    const wagersDiv = screen.getByText("5000 €");
    expect(wagersDiv).toHaveClass("text-green-400");
  });

  it("handles edge case: rank exactly 3", () => {
    const entryRank3: LeaderboardEntry = {
      ...mockLeaderboardEntry,
      rank: 3,
    };

    render(<LeaderboardRow row={entryRank3} />);

    const rankBadge = screen.getByText("3");
    expect(rankBadge).toHaveClass("bg-amber-500/25");
  });

  it("handles edge case: rank exactly 4", () => {
    const entryRank4: LeaderboardEntry = {
      ...mockLeaderboardEntry,
      rank: 4,
    };

    render(<LeaderboardRow row={entryRank4} />);

    const rankBadge = screen.getByText("4");
    expect(rankBadge).toHaveClass("bg-slate-700/40");
  });
});
