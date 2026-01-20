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
}

export type GamePhase =
  | 'setup'
  | 'config'
  | 'reveal'
  | 'playing'
  | 'voting'
  | 'results';

export interface GameConfig {
  rounds: number;
  impostorCount: number;
  isRandomImpostors: boolean;
  selectedCategories: string[];
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  config: GameConfig;
  secretWord: string | null;
  currentPlayerIndex: number;
  votes: Record<string, string>; // voterId -> votedForId
}

export interface Vote {
  voterId: string;
  votedForId: string;
}
