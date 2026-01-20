import React, { useState } from 'react';
import { useGameStore } from '@/store';
import {
  Screen,
  ScreenHeader,
  ScreenContent,
  ScreenFooter,
  Button,
  Input,
} from '@/components/ui';
import styles from './PlayerSetup.module.css';

export const PlayerSetup: React.FC = () => {
  const { players, addPlayer, removePlayer, updatePlayerName, setPhase } =
    useGameStore();
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName);
      setNewPlayerName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  const handleContinue = () => {
    setPhase('config');
  };

  const canContinue = players.length >= 3;

  return (
    <Screen>
      <ScreenHeader
        title="👥 Add Players"
        subtitle="Everyone who will play this round"
      />

      <ScreenContent>
        <div className={styles.inputRow}>
          <Input
            placeholder="Enter player name..."
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={handleAddPlayer}
            disabled={!newPlayerName.trim()}
            size="md"
          >
            Add
          </Button>
        </div>

        <div className={styles.playerList}>
          {players.length === 0 ? (
            <p className={styles.emptyText}>
              No players yet. Add at least 3 players to start.
            </p>
          ) : (
            players.map((player, index) => (
              <div key={player.id} className={styles.playerCard}>
                <span className={styles.playerNumber}>{index + 1}</span>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updatePlayerName(player.id, e.target.value)}
                  className={styles.playerName}
                />
                <button
                  onClick={() => removePlayer(player.id)}
                  className={styles.removeBtn}
                  aria-label={`Remove ${player.name}`}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {players.length > 0 && players.length < 3 && (
          <p className={styles.warningText}>
            ⚠️ Add at least {3 - players.length} more player
            {3 - players.length > 1 ? 's' : ''} to start
          </p>
        )}
      </ScreenContent>

      <ScreenFooter>
        <div className={styles.playerCount}>
          <span>{players.length} players</span>
        </div>
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          fullWidth
          size="lg"
        >
          Continue to Settings
        </Button>
      </ScreenFooter>
    </Screen>
  );
};
