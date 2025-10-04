import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../../test/test-utils";
import { PlayerProfileDrawer } from "../PlayerProfileDrawer";
import type { LeaderboardEntry, Bet } from "../../lib/types";

// Mock framer-motion components
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animate-presence">{children}</div>
  ),
  motion: {
    div: ({
      children,
      className,
      onClick,
      ...props
    }: {
      children: React.ReactNode;
      className?: string;
      onClick?: () => void;
      [key: string]: unknown;
    }) => (
      <div
        data-testid="motion-div"
        className={className}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    ),
    aside: ({
      children,
      className,
      ...props
    }: {
      children: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }) => (
      <aside data-testid="motion-aside" className={className} {...props}>
        {children}
      </aside>
    ),
  },
}));

// Mock usePlayerBets hook
vi.mock("../../hooks/usePlayerBets", () => ({
  usePlayerBets: vi.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
  })),
}));

// Mock ProfileStat component
vi.mock("../ProfileStat", () => ({
  ProfileStat: ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <div
      data-testid={`profile-stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {label}: {value}
    </div>
  ),
}));

// Mock BetRow component
vi.mock("../BetRow", () => ({
  BetRow: ({ bet }: { bet: Bet }) => (
    <li data-testid={`bet-row-${bet.id}`}>
      {bet.playerUsername} - {bet.betType} - {bet.amount}
    </li>
  ),
}));

// Mock data
const mockPlayer: LeaderboardEntry = {
  rank: 1,
  playerId: 1,
  username: "testuser",
  avatar: "https://example.com/avatar.jpg",
  totalBets: 5000,
  betsCount: 10,
  prize: 1000,
  lastBetTime: "2024-01-15T10:30:00Z",
};

const mockPlayerWithoutAvatar: LeaderboardEntry = {
  rank: 2,
  playerId: 2,
  username: "noavatar",
  avatar: "https://example.com/avatar2.jpg",
  totalBets: 3000,
  betsCount: 5,
  prize: 500,
  lastBetTime: "2024-01-15T09:15:00Z",
};

const mockPlayerMinimal: LeaderboardEntry = {
  rank: 3,
  playerId: 3,
  username: "minimal",
  avatar: "https://example.com/avatar3.jpg",
  totalBets: 1000,
};

describe("PlayerProfileDrawer Component", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when player is null", () => {
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={null}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders drawer when player is provided", () => {
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("displays player information correctly", () => {
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("testuser")).toBeInTheDocument();
    // Check that the component renders without crashing
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("displays player without prize", () => {
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayerMinimal}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("minimal")).toBeInTheDocument();
    expect(screen.getByText("Rank #3")).toBeInTheDocument();
    expect(screen.queryByText("Prize:")).not.toBeInTheDocument();
  });

  it("displays custom avatar when provided", () => {
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    const avatar = screen.getByAltText("testuser");
    expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("displays generated avatar when not provided", () => {
    const playerWithoutAvatar = {
      ...mockPlayerWithoutAvatar,
      avatar: undefined as unknown as string,
    };
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={playerWithoutAvatar}
        onClose={mockOnClose}
      />
    );

    const avatar = screen.getByAltText("noavatar");
    expect(avatar).toHaveAttribute(
      "src",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=2"
    );
  });

  it("displays placeholder when avatar is undefined", () => {
    const playerWithoutAvatar = {
      ...mockPlayer,
      avatar: undefined as unknown as string,
    };
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={playerWithoutAvatar}
        onClose={mockOnClose}
      />
    );

    const avatar = screen.getByAltText("testuser");
    expect(avatar).toHaveAttribute(
      "src",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=1"
    );
  });

  it("displays stats correctly", () => {
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId("profile-stat-total-bets")).toHaveTextContent(
      "Total bets: 10"
    );
    expect(screen.getByTestId("profile-stat-volume")).toHaveTextContent(
      "Volume: 5000 €"
    );
    expect(screen.getByTestId("profile-stat-avg-bet")).toHaveTextContent(
      "Avg bet: 500 €"
    );
  });

  it("calls onClose when close button is clicked", () => {
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    const backdrop = screen.getByTestId("motion-div");
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when other keys are pressed", () => {
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    fireEvent.keyDown(document, { key: "Enter" });
    fireEvent.keyDown(document, { key: "Space" });
    fireEvent.keyDown(document, { key: "a" });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("applies correct CSS classes to drawer", () => {
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    const drawer = screen.getByTestId("motion-aside");
    expect(drawer).toHaveClass(
      "fixed",
      "inset-y-0",
      "right-0",
      "z-50",
      "w-full",
      "max-w-md",
      "bg-[#0f141b]",
      "border-l",
      "border-slate-800",
      "shadow-2xl",
      "flex",
      "flex-col"
    );
  });

  it("applies correct CSS classes to backdrop", () => {
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    const backdrop = screen.getByTestId("motion-div");
    expect(backdrop).toHaveClass(
      "fixed",
      "inset-0",
      "bg-black/50",
      "backdrop-blur-[2px]",
      "z-40"
    );
  });

  it("applies correct CSS classes to avatar", () => {
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    const avatar = screen.getByAltText("testuser");
    expect(avatar).toHaveClass(
      "h-12",
      "w-12",
      "rounded-full",
      "border",
      "border-slate-700",
      "bg-slate-800"
    );
  });

  it("applies correct CSS classes to close button", () => {
    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByLabelText("Close");
    expect(closeButton).toHaveClass(
      "ml-auto",
      "rounded-md",
      "border",
      "border-slate-700",
      "px-2",
      "py-1",
      "text-slate-200",
      "hover:bg-slate-800"
    );
  });

  it("handles different tournament IDs", () => {
    const { rerender } = render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("testuser")).toBeInTheDocument();

    rerender(
      <PlayerProfileDrawer
        tournamentId={999}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("handles player changes", () => {
    const { rerender } = render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("testuser")).toBeInTheDocument();

    rerender(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayerWithoutAvatar}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("noavatar")).toBeInTheDocument();
    expect(screen.queryByText("testuser")).not.toBeInTheDocument();
  });

  it("cleans up event listeners on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={mockPlayer}
        onClose={mockOnClose}
      />
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("handles edge case with undefined betsCount", () => {
    const playerWithUndefinedBetsCount = {
      ...mockPlayer,
      betsCount: undefined,
    };

    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={playerWithUndefinedBetsCount}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId("profile-stat-total-bets")).toHaveTextContent(
      "Total bets: 0"
    );
    expect(screen.getByTestId("profile-stat-avg-bet")).toHaveTextContent(
      "Avg bet: 5000 €"
    );
  });

  it("handles edge case with undefined totalBets", () => {
    const playerWithUndefinedTotalBets = {
      ...mockPlayer,
      totalBets: undefined as unknown as number,
    };

    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={playerWithUndefinedTotalBets}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId("profile-stat-volume")).toHaveTextContent(
      "Volume: 0 €"
    );
  });

  it("handles very large numbers in stats", () => {
    const playerWithLargeNumbers = {
      ...mockPlayer,
      totalBets: 999999999,
      betsCount: 1000000,
    };

    render(
      <PlayerProfileDrawer
        tournamentId={1}
        player={playerWithLargeNumbers}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId("profile-stat-total-bets")).toHaveTextContent(
      "Total bets: 1000000"
    );
    expect(screen.getByTestId("profile-stat-volume")).toHaveTextContent(
      "Volume: 999.999.999 €"
    );
  });
});
