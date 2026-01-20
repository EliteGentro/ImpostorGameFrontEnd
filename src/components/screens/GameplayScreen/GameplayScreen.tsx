import React from 'react';
import { useGameStore } from '@/store';
import { Screen, ScreenContent, ScreenFooter, Button } from '@/components/ui';
import styles from './GameplayScreen.module.css';

export const GameplayScreen: React.FC = () => {
  const { config, players, setPhase } = useGameStore();

  const handleEndRounds = () => {
    setPhase('voting');
  };

  return (
    <Screen centered>
      <ScreenContent>
        <div className={styles.container}>
          <div className={styles.icon}>🎭</div>
          <h1 className={styles.title}>Time to Play!</h1>
          
          <div className={styles.roundInfo}>
            <span className={styles.roundLabel}>Complete</span>
            <span className={styles.roundNumber}>{config.rounds} round{config.rounds > 1 ? 's' : ''}</span>
          </div>

          <div className={styles.instructions}>
            <h2 className={styles.instructionsTitle}>How to Play</h2>
            <ol className={styles.instructionsList}>
              <li>Go around the circle {config.rounds} time{config.rounds > 1 ? 's' : ''}</li>
              <li>Each player says ONE word related to the secret word</li>
              <li>Impostors must blend in without knowing the word</li>
              <li>Pay attention to suspicious clues!</li>
            </ol>
          </div>

          <div className={styles.playerList}>
            <span className={styles.playersLabel}>Players:</span>
            <div className={styles.players}>
              {players.map((player) => (
                <span key={player.id} className={styles.playerChip}>
                  {player.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </ScreenContent>

      <ScreenFooter>
        <Button onClick={handleEndRounds} size="lg" fullWidth>
          🗳️ End Rounds & Vote
        </Button>
      </ScreenFooter>
    </Screen>
  );
};
