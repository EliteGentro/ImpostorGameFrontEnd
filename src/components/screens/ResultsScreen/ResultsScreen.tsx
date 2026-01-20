import React, { useState } from 'react';
import { useGameStore } from '@/store';
import {
  Screen,
  ScreenContent,
  ScreenFooter,
  Button,
} from '@/components/ui';
import styles from './ResultsScreen.module.css';

export const ResultsScreen: React.FC = () => {
  const {
    players,
    secretWord,
    getImpostors,
    getVoteResults,
    getWinner,
    resetMatch,
    resetGame,
  } = useGameStore();

  const [showVotes, setShowVotes] = useState(false);

  const impostors = getImpostors();
  const voteResults = getVoteResults();
  const winner = getWinner();

  const handlePlayAgain = () => {
    resetMatch();
  };

  const handleNewMatch = () => {
    resetGame();
  };

  return (
    <Screen>
      <ScreenContent>
        <div className={styles.container}>
          {/* Winner Banner */}
          <div
            className={`${styles.winnerBanner} ${
              winner === 'villagers' ? styles.villagersWin : styles.impostorsWin
            }`}
          >
            <div className={styles.winnerIcon}>
              {winner === 'villagers' ? '🎉' : '🕵️'}
            </div>
            <h1 className={styles.winnerTitle}>
              {winner === 'villagers' ? 'Villagers Win!' : 'Impostors Win!'}
            </h1>
            <p className={styles.winnerSubtitle}>
              {winner === 'villagers'
                ? 'The impostor was caught!'
                : 'The impostor escaped detection!'}
            </p>
          </div>

          {/* Secret Word */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>The Secret Word Was</h2>
            <div className={styles.secretWord}>{secretWord}</div>
          </div>

          {/* Impostors Revealed */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {impostors.length === 1 ? 'The Impostor' : 'The Impostors'}
            </h2>
            <div className={styles.impostorList}>
              {impostors.map((impostor) => (
                <div key={impostor.id} className={styles.impostorCard}>
                  <span className={styles.impostorIcon}>🕵️</span>
                  <span className={styles.impostorName}>{impostor.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vote Breakdown */}
          <div className={styles.section}>
            <button
              className={styles.toggleButton}
              onClick={() => setShowVotes(!showVotes)}
            >
              {showVotes ? '▼' : '▶'} Vote Breakdown
            </button>
            {showVotes && (
              <div className={styles.voteList}>
                {voteResults.map(({ playerId, voteCount }) => {
                  const player = players.find((p) => p.id === playerId);
                  if (!player) return null;
                  return (
                    <div key={playerId} className={styles.voteRow}>
                      <span className={styles.voteName}>
                        {player.name}
                        {player.isImpostor && (
                          <span className={styles.impostorBadge}>Impostor</span>
                        )}
                      </span>
                      <span className={styles.voteCount}>
                        {voteCount} vote{voteCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </ScreenContent>

      <ScreenFooter>
        <Button onClick={handlePlayAgain} fullWidth size="lg">
          🔄 Play Again (Same Players)
        </Button>
        <Button onClick={handleNewMatch} variant="ghost" fullWidth>
          New Match
        </Button>
      </ScreenFooter>
    </Screen>
  );
};
