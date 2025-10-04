import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/test-utils";
import { LeaderboardTable } from "../LeaderboardTable";
import type { LeaderboardEntry } from "../../lib/types";

// Mock data for testing
const mockLeaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    playerId: 1,
    username: "player1",
    avatar: "https://example.com/avatar1.jpg",
    totalBets: 5000,
    betsCount: 10,
    prize: 1000,
    lastBetTime: "2024-01-15T10:30:00Z",
  },
  {
    rank: 2,
    playerId: 2,
    username: "player2",
    avatar: "https://example.com/avatar2.jpg",
    totalBets: 3000,
    betsCount: 8,
    prize: 500,
    lastBetTime: "2024-01-15T09:15:00Z",
  },
  {
    rank: 3,
    playerId: 3,
    username: "player3",
    avatar: "https://example.com/avatar3.jpg",
    totalBets: 2000,
    betsCount: 5,
    prize: 250,
    lastBetTime: "2024-01-15T08:45:00Z",
  },
];

const mockMinimalData: LeaderboardEntry[] = [
  {
    rank: 1,
    playerId: 1,
    username: "minimalplayer",
    avatar: "https://example.com/minimal.jpg",
    totalBets: 1000,
  },
];

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
      [key: string]: any;
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

// Mock LeaderboardRow component
vi.mock("../LeaderboardRow", () => ({
  LeaderboardRow: ({
    row,
    onSelect,
  }: {
    row: LeaderboardEntry;
    onSelect: (row: LeaderboardEntry) => void;
  }) => (
    <li
      data-testid={`leaderboard-row-${row.playerId}`}
      onClick={() => onSelect(row)}
    >
      {row.username}
    </li>
  ),
}));

// Mock PlayerProfileDrawer component
vi.mock("../PlayerProfileDrawer", () => ({
  PlayerProfileDrawer: ({
    player,
    onClose,
  }: {
    player: LeaderboardEntry | null;
    onClose: () => void;
  }) => (
    <div
      data-testid="player-profile-drawer"
      style={{ display: player ? "block" : "none" }}
    >
      {player ? `Profile for ${player.username}` : "No player selected"}
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe("LeaderboardTable Component", () => {
  it("renders table header correctly", () => {
    render(<LeaderboardTable data={mockLeaderboardData} tournamentId={1} />);

    expect(screen.getByText("#")).toBeInTheDocument();
    expect(screen.getByText("Player")).toBeInTheDocument();
    expect(screen.getByText("Wagers")).toBeInTheDocument();
  });

  it("renders leaderboard data correctly", () => {
    render(<LeaderboardTable data={mockLeaderboardData} tournamentId={1} />);

    expect(screen.getByText("player1")).toBeInTheDocument();
    expect(screen.getByText("player2")).toBeInTheDocument();
    expect(screen.getByText("player3")).toBeInTheDocument();
  });

  it("renders with undefined data", () => {
    render(<LeaderboardTable data={undefined} tournamentId={1} />);

    // Should not crash and should render header
    expect(screen.getByText("#")).toBeInTheDocument();
    expect(screen.getByText("Player")).toBeInTheDocument();
    expect(screen.getByText("Wagers")).toBeInTheDocument();
  });

  it("renders with empty data array", () => {
    render(<LeaderboardTable data={[]} tournamentId={1} />);

    // Should not crash and should render header
    expect(screen.getByText("#")).toBeInTheDocument();
    expect(screen.getByText("Player")).toBeInTheDocument();
    expect(screen.getByText("Wagers")).toBeInTheDocument();
  });

  it("limits display to 30 entries", () => {
    // Create 35 entries
    const largeData = Array.from({ length: 35 }, (_, i) => ({
      rank: i + 1,
      playerId: i + 1,
      username: `player${i + 1}`,
      avatar: `https://example.com/avatar${i + 1}.jpg`,
      totalBets: 1000 + i * 100,
    }));

    render(<LeaderboardTable data={largeData} tournamentId={1} />);

    // Should only show first 30 entries
    expect(screen.getByText("player1")).toBeInTheDocument();
    expect(screen.getByText("player30")).toBeInTheDocument();
    expect(screen.queryByText("player31")).not.toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    const { container } = render(
      <LeaderboardTable data={mockLeaderboardData} tournamentId={1} />
    );

    const section = container.querySelector("section");
    const header = container.querySelector("header");
    const motionUl = screen.getByTestId("motion-ul");

    // Check section classes
    expect(section).toHaveClass(
      "rounded-2xl",
      "overflow-hidden",
      "border",
      "border-slate-800",
      "bg-[#1a2029]"
    );

    // Check header classes
    expect(header).toHaveClass(
      "px-4",
      "py-3",
      "border-b",
      "border-slate-800",
      "bg-[#1f2630]"
    );

    // Check motion ul classes
    expect(motionUl).toHaveClass("flex", "flex-col", "gap-2");
  });

  it("renders with minimal data", () => {
    render(<LeaderboardTable data={mockMinimalData} tournamentId={1} />);

    expect(screen.getByText("minimalplayer")).toBeInTheDocument();
  });

  it("passes correct props to LeaderboardRow", () => {
    render(<LeaderboardTable data={mockLeaderboardData} tournamentId={1} />);

    // The LeaderboardRow components should be rendered
    // We can't easily test the props directly, but we can verify the rows are rendered
    expect(screen.getByText("player1")).toBeInTheDocument();
    expect(screen.getByText("player2")).toBeInTheDocument();
    expect(screen.getByText("player3")).toBeInTheDocument();
  });

  it("renders PlayerProfileDrawer with correct props", () => {
    render(<LeaderboardTable data={mockLeaderboardData} tournamentId={1} />);

    // PlayerProfileDrawer should be rendered
    const drawer = screen.getByTestId("player-profile-drawer");
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveTextContent("No player selected");
  });

  it("handles tournamentId prop correctly", () => {
    const customTournamentId = 999;
    render(
      <LeaderboardTable
        data={mockLeaderboardData}
        tournamentId={customTournamentId}
      />
    );

    // Component should render without crashing
    expect(screen.getByText("player1")).toBeInTheDocument();
  });

  it("renders with different tournament IDs", () => {
    const { rerender } = render(
      <LeaderboardTable data={mockLeaderboardData} tournamentId={1} />
    );

    expect(screen.getByText("player1")).toBeInTheDocument();

    rerender(<LeaderboardTable data={mockLeaderboardData} tournamentId={2} />);

    expect(screen.getByText("player1")).toBeInTheDocument();
  });

  it("maintains state when data changes", () => {
    const { rerender } = render(
      <LeaderboardTable data={mockLeaderboardData} tournamentId={1} />
    );

    expect(screen.getByText("player1")).toBeInTheDocument();

    const newData = [
      ...mockLeaderboardData,
      {
        rank: 4,
        playerId: 4,
        username: "newplayer",
        avatar: "https://example.com/new.jpg",
        totalBets: 1500,
      },
    ];

    rerender(<LeaderboardTable data={newData} tournamentId={1} />);

    expect(screen.getByText("player1")).toBeInTheDocument();
    expect(screen.getByText("newplayer")).toBeInTheDocument();
  });

  it("handles data with missing optional fields", () => {
    const dataWithMissingFields: LeaderboardEntry[] = [
      {
        rank: 1,
        playerId: 1,
        username: "incomplete",
        avatar: "https://example.com/incomplete.jpg",
        totalBets: 1000,
        // Missing betsCount, prize, lastBetTime
      },
    ];

    render(<LeaderboardTable data={dataWithMissingFields} tournamentId={1} />);

    expect(screen.getByText("incomplete")).toBeInTheDocument();
  });

  it("renders with very large numbers", () => {
    const dataWithLargeNumbers: LeaderboardEntry[] = [
      {
        rank: 1,
        playerId: 1,
        username: "bigplayer",
        avatar: "https://example.com/big.jpg",
        totalBets: 999999999,
        betsCount: 1000,
        prize: 500000,
      },
    ];

    render(<LeaderboardTable data={dataWithLargeNumbers} tournamentId={1} />);

    expect(screen.getByText("bigplayer")).toBeInTheDocument();
  });
});
