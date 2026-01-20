# Impostor Game Frontend

A mobile-first React frontend for the Impostor Word Game, a social deduction game where players guess words while identifying impostors. Built with Vite, TypeScript, and Zustand for state management.

## Features

- **Mobile-First Design**: Optimized for mobile devices with responsive UI
- **Game Flow**: Complete game experience with multiple phases (setup, gameplay, voting, reveal, results)
- **State Management**: Zustand for efficient global state handling
- **TypeScript**: Full type safety throughout the application
- **Modular Components**: Reusable UI components with CSS Modules
- **API Integration**: Seamless integration with NestJS backend
- **Real-time Updates**: Dynamic game state management

## Tech Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.4.21
- **Language**: TypeScript 5.3.0
- **State Management**: Zustand 4.4.7
- **Styling**: CSS Modules
- **HTTP Client**: Fetch API (native)
- **Package Manager**: npm

## Project Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── screens/          # Game screens/pages
│   │   │   ├── GameConfig/   # Game configuration screen
│   │   │   ├── GameplayScreen/ # Main gameplay interface
│   │   │   ├── PlayerSetup/  # Player name input
│   │   │   ├── ResultsScreen/ # Game results display
│   │   │   ├── RevealPhase/  # Word reveal phase
│   │   │   └── VotingPhase/  # Voting interface
│   │   └── ui/               # Reusable UI components
│   │       ├── Button/       # Custom button component
│   │       ├── Checkbox/     # Checkbox input
│   │       ├── Input/        # Text input field
│   │       ├── Screen/       # Screen wrapper/layout
│   │       └── Stepper/      # Number input stepper
│   ├── services/
│   │   └── api.ts            # API service for backend communication
│   ├── store/
│   │   └── gameStore.ts      # Zustand store for game state
│   ├── styles/
│   │   └── global.css        # Global styles
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   └── vite-env.d.ts         # Vite environment types
├── .env                      # Environment variables
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tsconfig.node.json        # Node.js TypeScript config
└── vite.config.ts            # Vite configuration
```

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd ImpostorGame/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
Starts the development server on `http://localhost:5173` with hot reload.

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

## Game Flow

The application follows a structured game flow:

1. **Player Setup**: Players enter their names
2. **Game Configuration**: Select categories and game settings
3. **Gameplay**: Players guess words and identify impostors
4. **Voting Phase**: Vote on suspected impostors
5. **Reveal Phase**: Reveal actual impostors and words
6. **Results**: Display final scores and game summary

## API Integration

The frontend communicates with the NestJS backend through the `services/api.ts` file.

### Available API Calls

#### Get Categories
```typescript
import { api } from '../services/api';

// Get all available categories
const categories = await api.getCategories();
```

#### Get Random Words
```typescript
// Get random words for selected categories
const words = await api.getRandomWords({
  categoryIds: ['category-uuid-1', 'category-uuid-2'],
  count: 6
});
```

### API Service Structure
```typescript
// services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  async getCategories(): Promise<Category[]> {
    // Implementation
  },

  async getRandomWords(params: {
    categoryIds: string[];
    count?: number;
  }): Promise<Word[]> {
    // Implementation
  }
};
```

## State Management

Game state is managed using Zustand store (`store/gameStore.ts`).

### Store Structure
```typescript
interface GameState {
  // Player management
  players: Player[];
  currentPlayerIndex: number;

  // Game configuration
  selectedCategories: string[];
  wordCount: number;

  // Game state
  gamePhase: GamePhase;
  words: Word[];
  currentWordIndex: number;
  votes: Vote[];
  revealedWords: RevealedWord[];

  // Actions
  addPlayer: (name: string) => void;
  setCategories: (categories: string[]) => void;
  startGame: () => void;
  nextWord: () => void;
  submitVote: (vote: Vote) => void;
  revealWord: () => void;
  resetGame: () => void;
}
```

### Usage
```typescript
import { useGameStore } from '../store/gameStore';

function MyComponent() {
  const { players, addPlayer, gamePhase } = useGameStore();

  // Use state and actions
}
```

## Component Architecture

### Screen Components
Each screen represents a game phase and is located in `components/screens/`.

- **PlayerSetup**: Collect player names
- **GameConfig**: Configure game settings (categories, word count)
- **GameplayScreen**: Main game interface with word display
- **VotingPhase**: Allow players to vote on impostors
- **RevealPhase**: Show revealed words and impostors
- **ResultsScreen**: Display final game results

### UI Components
Reusable components in `components/ui/`:

- **Button**: Customizable button with variants
- **Checkbox**: Checkbox input component
- **Input**: Text input field
- **Screen**: Layout wrapper for screens
- **Stepper**: Number input with increment/decrement

### Component Structure
Each component follows this pattern:
```
ComponentName/
├── ComponentName.tsx      # Main component
├── ComponentName.module.css  # Styles
└── index.ts               # Export
```

## Styling

- **CSS Modules**: Scoped styles for each component
- **Global Styles**: Base styles in `styles/global.css`
- **Mobile-First**: Responsive design starting from mobile
- **CSS Variables**: Consistent theming through CSS custom properties

## TypeScript Types

Type definitions are centralized in `types/index.ts`:

```typescript
export interface Player {
  id: string;
  name: string;
  isImpostor: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Word {
  id: string;
  value: string;
  categoryId: string;
  difficulty?: string;
}

export type GamePhase =
  | 'setup'
  | 'config'
  | 'playing'
  | 'voting'
  | 'reveal'
  | 'results';
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint (if configured) |

## Development

### Code Style
- **TypeScript**: Strict mode enabled
- **Component Naming**: PascalCase for components
- **File Naming**: kebab-case for files, PascalCase for components
- **Imports**: Group imports (React, third-party, local)

### Adding New Features
1. Create component in appropriate directory
2. Add styles with CSS Modules
3. Update store if needed
4. Add types if required
5. Update API service for new endpoints

### State Management Guidelines
- Keep store actions pure and simple
- Use selectors for computed values
- Avoid complex logic in components

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3001/api` |

## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

## Performance

- **Code Splitting**: Automatic with Vite
- **Tree Shaking**: Unused code elimination
- **Fast Refresh**: Hot reload during development
- **Optimized Builds**: Minified and compressed production builds

## Testing

### Running Tests
```bash
npm run test
```
*(Note: Test scripts need to be added to package.json)*

### Testing Strategy
- Unit tests for utilities and hooks
- Integration tests for components
- E2E tests for critical user flows

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` directory to your hosting service (Netlify, Vercel, etc.)

3. Ensure backend is deployed and accessible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following the established patterns
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Related Projects

- **Backend**: [Impostor Game Backend](../backend/README.md) - NestJS API server
- **Full Stack**: [Impostor Game](../README.md) - Complete application</content>
<parameter name="filePath">c:\Code\Personal\ImpostorGame\frontend\README.md