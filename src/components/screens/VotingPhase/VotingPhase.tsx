import React, { useState } from 'react';
import { useGameStore } from '@/store';
import { Screen, ScreenContent, Button } from '@/components/ui';
import styles from './VotingPhase.module.css';

type VoteState = 'pass' | 'vote';

export const VotingPhase: React.FC = () => {
  const { players, currentPlayerIndex, castVote } = useGameStore();
  const [state, setState] = useState<VoteState>('pass');

  const currentPlayer = players[currentPlayerIndex];
  const otherPlayers = players.filter((p) => p.id !== currentPlayer?.id);

  const handleReady = () => {
    setState('vote');
  };

  const handleVote = (votedForId: string) => {
    if (currentPlayer) {
      castVote(currentPlayer.id, votedForId);
      setState('pass');
    }
  };

  if (!currentPlayer) return null;

  return (
    <Screen centered>
      <ScreenContent>
        {state === 'pass' ? (
          <div className={styles.passScreen}>
            <div className={styles.passIcon}>🗳️</div>
            <h1 className={styles.passTitle}>Pass the phone to</h1>
            <div className={styles.playerName}>{currentPlayer.name}</div>
            <p className={styles.passSubtitle}>
              Time to vote for who you think is the impostor
            </p>
            <Button onClick={handleReady} size="lg" fullWidth>
              I'm Ready to Vote
            </Button>
            <p className={styles.progress}>
              Vote {currentPlayerIndex + 1} of {players.length}
            </p>
          </div>
        ) : (
          <div className={styles.voteScreen}>
            <h1 className={styles.voteTitle}>Who is the Impostor?</h1>
            <p className={styles.voteSubtitle}>
              {currentPlayer.name}, cast your vote
            </p>
            <div className={styles.voteOptions}>
              {otherPlayers.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handleVote(player.id)}
                  className={styles.voteButton}
                >
                  {player.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </ScreenContent>
    </Screen>
  );
};
