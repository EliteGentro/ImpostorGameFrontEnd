import { create } from 'zustand';
import { GameState, GamePhase, Player, GameConfig } from '@/types';

const DEFAULT_CONFIG: GameConfig = {
  rounds: 2,
  impostorCount: 1,
  isRandomImpostors: false,
  selectedCategories: [],
};

interface GameStore extends GameState {
  // Player actions
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updatePlayerName: (id: string, name: string) => void;
  
  // Config actions
  setRounds: (rounds: number) => void;
  setImpostorCount: (count: number) => void;
  setRandomImpostors: (isRandom: boolean) => void;
  setSelectedCategories: (categories: string[]) => void;
  
  // Game flow actions
  setPhase: (phase: GamePhase) => void;
  startGame: (secretWord: string) => void;
  nextPlayer: () => void;
  castVote: (voterId: string, votedForId: string) => void;
  
  // Utility actions
  resetGame: () => void;
  resetMatch: () => void;
  
  // Computed values
  getImpostors: () => Player[];
  getVoteResults: () => { playerId: string; voteCount: number }[];
  getWinner: () => 'impostors' | 'villagers' | null;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  phase: 'setup',
  players: [],
  config: DEFAULT_CONFIG,
  secretWord: null,
  currentPlayerIndex: 0,
  votes: {},

  // Player actions
  addPlayer: (name: string) => {
    set((state) => ({
      players: [
        ...state.players,
        { id: generateId(), name: name.trim(), isImpostor: false },
      ],
    }));
  },

  removePlayer: (id: string) => {
    set((state) => ({
      players: state.players.filter((p) => p.id !== id),
    }));
  },

  updatePlayerName: (id: string, name: string) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.id === id ? { ...p, name: name.trim() } : p
      ),
    }));
  },

  // Config actions
  setRounds: (rounds: number) => {
    set((state) => ({
      config: { ...state.config, rounds: Math.max(1, Math.min(10, rounds)) },
    }));
  },

  setImpostorCount: (count: number) => {
    set((state) => ({
      config: {
        ...state.config,
        impostorCount: Math.max(1, Math.min(state.players.length - 1, count)),
      },
    }));
  },

  setRandomImpostors: (isRandom: boolean) => {
    set((state) => ({
      config: { ...state.config, isRandomImpostors: isRandom },
    }));
  },

  setSelectedCategories: (categories: string[]) => {
    set((state) => ({
      config: { ...state.config, selectedCategories: categories },
    }));
  },

  // Game flow actions
  setPhase: (phase: GamePhase) => {
    set({ phase });
  },

  startGame: (secretWord: string) => {
    const { players, config } = get();
    
    // Determine impostor count
    let impostorCount = config.impostorCount;
    if (config.isRandomImpostors) {
      impostorCount = Math.floor(Math.random() * players.length);
      if (impostorCount === 0) impostorCount = 1;
      if (impostorCount >= players.length) impostorCount = players.length - 1;
    }
    
    // Randomly assign impostors
    const shuffledPlayers = shuffleArray(players);
    const updatedPlayers = shuffledPlayers.map((player, index) => ({
      ...player,
      isImpostor: index < impostorCount,
    }));
    
    // Re-shuffle to hide impostor order
    const finalPlayers = shuffleArray(updatedPlayers);
    
    set({
      players: finalPlayers,
      secretWord,
      phase: 'reveal',
      currentPlayerIndex: 0,
      votes: {},
    });
  },

  nextPlayer: () => {
    const { currentPlayerIndex, players, phase } = get();
    const nextIndex = currentPlayerIndex + 1;
    
    if (phase === 'reveal') {
      if (nextIndex >= players.length) {
        set({ phase: 'playing', currentPlayerIndex: 0 });
      } else {
        set({ currentPlayerIndex: nextIndex });
      }
    } else if (phase === 'voting') {
      if (nextIndex >= players.length) {
        set({ phase: 'results', currentPlayerIndex: 0 });
      } else {
        set({ currentPlayerIndex: nextIndex });
      }
    }
  },

  castVote: (voterId: string, votedForId: string) => {
    set((state) => ({
      votes: { ...state.votes, [voterId]: votedForId },
    }));
    get().nextPlayer();
  },

  // Utility actions
  resetGame: () => {
    set({
      phase: 'setup',
      players: [],
      config: DEFAULT_CONFIG,
      secretWord: null,
      currentPlayerIndex: 0,
      votes: {},
    });
  },

  resetMatch: () => {
    set((state) => ({
      phase: 'config',
      players: state.players.map((p) => ({ ...p, isImpostor: false })),
      secretWord: null,
      currentPlayerIndex: 0,
      votes: {},
    }));
  },

  // Computed values
  getImpostors: () => {
    return get().players.filter((p) => p.isImpostor);
  },

  getVoteResults: () => {
    const { votes, players } = get();
    const voteCounts: Record<string, number> = {};
    
    players.forEach((p) => {
      voteCounts[p.id] = 0;
    });
    
    Object.values(votes).forEach((votedForId) => {
      if (voteCounts[votedForId] !== undefined) {
        voteCounts[votedForId]++;
      }
    });
    
    return Object.entries(voteCounts)
      .map(([playerId, voteCount]) => ({ playerId, voteCount }))
      .sort((a, b) => b.voteCount - a.voteCount);
  },

  getWinner: () => {
    const { players } = get();
    const voteResults = get().getVoteResults();
    
    if (voteResults.length === 0) return null;
    
    const topVoted = voteResults[0];
    const majorityThreshold = Math.floor(players.length / 2) + 1;
    
    // Check if top voted has majority
    if (topVoted.voteCount >= majorityThreshold) {
      const votedPlayer = players.find((p) => p.id === topVoted.playerId);
      if (votedPlayer?.isImpostor) {
        return 'villagers';
      }
    }
    
    return 'impostors';
  },
}));
