# Leaderboard Web Client

A real-time leaderboard web application built with React and TypeScript, featuring live betting feeds, tournament management, and WebSocket integration for real-time updates.

## Prerequisites

This project can be run using either **npm** or **pnpm**. We recommend using **pnpm** for better performance and disk space efficiency.

### Installing pnpm

If you don't have pnpm installed, you can install it using one of the following methods:

#### Option 1: Using npm (recommended)
```bash
npm install -g pnpm
```

#### Option 2: Using Homebrew (macOS)
```bash
brew install pnpm
```

#### Option 3: Using curl
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### Option 4: Using PowerShell (Windows)
```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd leaderboard-web-client
```

2. Install dependencies using your preferred package manager:

**Using pnpm (recommended):**
```bash
pnpm install
```

**Using npm:**
```bash
npm install
```

## Development

Start the development server:

**Using pnpm:**
```bash
pnpm dev
```

**Using npm:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server |
| `build` | Build for production |
| `preview` | Preview production build |
| `test` | Run tests in watch mode |
| `test:ui` | Run tests with UI |
| `test:run` | Run tests once |
| `test:coverage` | Run tests with coverage report |
| `lint` | Run ESLint |

## Technologies Used

### Core Framework
- **React 19.1.1** - Modern React with latest features
- **TypeScript 5.8.3** - Type-safe JavaScript with strict typing
- **Vite 7.1.7** - Fast build tool and development server

### Styling & UI
- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **Framer Motion 12.23.22** - Animation library for React
- **clsx 2.1.1** - Utility for constructing className strings

### State Management & Data Fetching
- **TanStack Query 5.90.2** - Powerful data synchronization for React
- **Zod 4.1.11** - TypeScript-first schema validation

### Testing
- **Vitest 3.2.4** - Fast unit test framework
- **Testing Library** - Simple and complete testing utilities
- **jsdom 27.0.0** - DOM implementation for Node.js

### Development Tools
- **ESLint 9.36.0** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

## Features

- 🏆 **Real-time Leaderboard** - Live updates via WebSocket
- 🎯 **Betting Feed** - Real-time bet tracking and display
- 🏅 **Tournament Management** - Tournament information and statistics
- 📊 **Player Profiles** - Detailed player statistics and betting history
- 🎨 **Modern UI** - Responsive design with smooth animations
- ⚡ **Real-time Updates** - WebSocket integration for live data
- 🧪 **Comprehensive Testing** - Full test coverage with Vitest
- 📱 **Mobile Responsive** - Optimized for all device sizes

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BetFeed.tsx     # Real-time betting feed
│   ├── LeaderboardTable.tsx  # Tournament leaderboard
│   ├── PlayerProfileDrawer.tsx  # Player profile modal
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useLeaderboard.ts  # Leaderboard data management
│   ├── useBetFeed.ts      # Betting feed logic
│   └── useWebSocket.ts    # WebSocket connection
├── lib/                # Utility functions and types
│   ├── api.ts          # API client
│   ├── types.ts        # TypeScript type definitions
│   └── ws.ts           # WebSocket utilities
├── layouts/            # Layout components
└── test/               # Test utilities and setup
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000
```

## Building for Production

**Using pnpm:**
```bash
pnpm build
```

**Using npm:**
```bash
npm run build
```

The built files will be in the `dist` directory.

## Testing

Run the test suite:

**Using pnpm:**
```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui
```

**Using npm:**
```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Code Quality

This project follows strict coding standards:

- **TypeScript strict mode** - No `any` types allowed
- **ESLint configuration** - Enforced code quality rules
- **Clean code principles** - Readable and maintainable code
- **Comprehensive testing** - High test coverage
- **Type safety** - Runtime validation with Zod schemas

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the coding standards
4. Add tests for new functionality
5. Run the test suite: `pnpm test`
6. Run linting: `pnpm lint`
7. Commit your changes: `git commit -m "Add your feature"`
8. Push to the branch: `git push origin feature/your-feature-name`
9. Submit a pull request

## License

This project is private and proprietary.