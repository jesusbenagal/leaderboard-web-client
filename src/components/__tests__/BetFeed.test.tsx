import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/test-utils";
import { BetFeed } from "../BetFeed";
import type { Bet } from "../../lib/types";

// Mock framer-motion components
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animate-presence">{children}</div>
  ),
  motion: {
    ul: ({
      children,
      layout,
      ...props
    }: {
      children: React.ReactNode;
      layout?: boolean;
      [key: string]: unknown;
    }) => (
      <ul
        data-testid="motion-ul"
        {...(layout && { layout: "true" })}
        {...props}
      >
        {children}
      </ul>
    ),
  },
}));

// Mock BetFeedItem component
vi.mock("../BetFeedItem", () => ({
  BetFeedItem: ({ bet }: { bet: Bet }) => (
    <li data-testid={`bet-feed-item-${bet.id}`}>
      {bet.playerUsername} - {bet.betType} - {bet.amount}
    </li>
  ),
}));

// Mock data
const mockBets: Bet[] = [
  {
    id: 1,
    playerId: 1,
    playerUsername: "player1",
    playerAvatar: "https://example.com/avatar1.jpg",
    amount: 1000,
    betType: "Football",
    timestamp: "2024-01-15T10:30:00Z",
    status: "won",
  },
  {
    id: 2,
    playerId: 2,
    playerUsername: "player2",
    playerAvatar: "https://example.com/avatar2.jpg",
    amount: 500,
    betType: "Basketball",
    timestamp: "2024-01-15T11:00:00Z",
    status: "lost",
  },
  {
    id: 3,
    playerId: 3,
    playerUsername: "player3",
    playerAvatar: "https://example.com/avatar3.jpg",
    amount: 750,
    betType: "Tennis",
    timestamp: "2024-01-15T11:30:00Z",
  },
];

describe("BetFeed Component", () => {
  it("renders header correctly", () => {
    render(<BetFeed bets={mockBets} />);

    expect(screen.getByText("Live bets")).toBeInTheDocument();
  });

  it("renders bets correctly", () => {
    render(<BetFeed bets={mockBets} />);

    expect(screen.getByTestId("bet-feed-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("bet-feed-item-2")).toBeInTheDocument();
    expect(screen.getByTestId("bet-feed-item-3")).toBeInTheDocument();
  });

  it("renders with undefined bets", () => {
    render(<BetFeed bets={undefined} />);

    // Should not crash and should render header
    expect(screen.getByText("Live bets")).toBeInTheDocument();
    expect(screen.queryByTestId("bet-feed-item-1")).not.toBeInTheDocument();
  });

  it("renders with empty bets array", () => {
    render(<BetFeed bets={[]} />);

    // Should not crash and should render header
    expect(screen.getByText("Live bets")).toBeInTheDocument();
    expect(screen.queryByTestId("bet-feed-item-1")).not.toBeInTheDocument();
  });

  it("applies correct CSS classes to section", () => {
    const { container } = render(<BetFeed bets={mockBets} />);

    const section = container.querySelector("section");
    expect(section).toHaveClass(
      "rounded-2xl",
      "overflow-hidden",
      "border",
      "border-slate-800",
      "bg-[#1a2029]"
    );
  });

  it("applies correct CSS classes to header", () => {
    const { container } = render(<BetFeed bets={mockBets} />);

    const header = container.querySelector("header");
    expect(header).toHaveClass(
      "px-4",
      "py-3",
      "border-b",
      "border-slate-800",
      "bg-[#1f2630]"
    );
  });

  it("applies correct CSS classes to header text", () => {
    render(<BetFeed bets={mockBets} />);

    const headerText = screen.getByText("Live bets");
    expect(headerText).toHaveClass("text-sm", "text-slate-300");
  });

  it("applies correct CSS classes to content div", () => {
    const { container } = render(<BetFeed bets={mockBets} />);

    const contentDiv = container.querySelector(".p-2.lb-scroll");
    expect(contentDiv).toHaveClass("p-2", "lb-scroll");
  });

  it("applies correct CSS classes to motion ul", () => {
    render(<BetFeed bets={mockBets} />);

    const motionUl = screen.getByTestId("motion-ul");
    expect(motionUl).toHaveClass("flex", "flex-col", "gap-2");
  });

  it("passes correct props to motion ul", () => {
    render(<BetFeed bets={mockBets} />);

    const motionUl = screen.getByTestId("motion-ul");
    expect(motionUl).toHaveAttribute("role", "list");
    expect(motionUl).toHaveAttribute("layout", "true");
  });

  it("renders AnimatePresence with correct props", () => {
    render(<BetFeed bets={mockBets} />);

    const animatePresence = screen.getByTestId("animate-presence");
    expect(animatePresence).toBeInTheDocument();
  });

  it("maps over bets correctly", () => {
    render(<BetFeed bets={mockBets} />);

    // Check that all bets are rendered
    mockBets.forEach((bet) => {
      expect(screen.getByTestId(`bet-feed-item-${bet.id}`)).toBeInTheDocument();
    });
  });

  it("handles single bet", () => {
    const singleBet = [mockBets[0]!];
    render(<BetFeed bets={singleBet} />);

    expect(screen.getByTestId("bet-feed-item-1")).toBeInTheDocument();
    expect(screen.queryByTestId("bet-feed-item-2")).not.toBeInTheDocument();
  });

  it("handles large number of bets", () => {
    const manyBets: Bet[] = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      playerId: i + 1,
      playerUsername: `player${i + 1}`,
      playerAvatar: `https://example.com/avatar${i + 1}.jpg`,
      amount: 100 + i * 10,
      betType: "Football",
      timestamp: "2024-01-15T10:30:00Z",
    }));

    render(<BetFeed bets={manyBets} />);

    // Check first and last bet
    expect(screen.getByTestId("bet-feed-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("bet-feed-item-50")).toBeInTheDocument();
  });

  it("maintains structure when bets change", () => {
    const { rerender } = render(<BetFeed bets={mockBets} />);

    expect(screen.getByText("Live bets")).toBeInTheDocument();
    expect(screen.getByTestId("bet-feed-item-1")).toBeInTheDocument();

    const newBets = [mockBets[0]!, mockBets[1]!];
    rerender(<BetFeed bets={newBets} />);

    expect(screen.getByText("Live bets")).toBeInTheDocument();
    expect(screen.getByTestId("bet-feed-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("bet-feed-item-2")).toBeInTheDocument();
    expect(screen.queryByTestId("bet-feed-item-3")).not.toBeInTheDocument();
  });

  it("handles bets with missing optional fields", () => {
    const betsWithMissingFields: Bet[] = [
      {
        id: 1,
        playerId: 1,
        playerUsername: "player1",
        amount: 100,
        betType: "Football",
        timestamp: "2024-01-15T10:30:00Z",
      },
    ];

    render(<BetFeed bets={betsWithMissingFields} />);

    expect(screen.getByTestId("bet-feed-item-1")).toBeInTheDocument();
  });
});
