import React, { useState } from 'react';
import { useGameStore } from '@/store';
import { Screen, ScreenContent, Button } from '@/components/ui';
import styles from './RevealPhase.module.css';

type RevealState = 'pass' | 'reveal';

export const RevealPhase: React.FC = () => {
  const { players, currentPlayerIndex, secretWord, nextPlayer } = useGameStore();
  const [state, setState] = useState<RevealState>('pass');

  const currentPlayer = players[currentPlayerIndex];
  const isImpostor = currentPlayer?.isImpostor;

  const handleReveal = () => {
    setState('reveal');
  };

  const handleHideAndPass = () => {
    setState('pass');
    nextPlayer();
  };

  if (!currentPlayer) return null;

  return (
    <Screen centered>
      <ScreenContent>
        {state === 'pass' ? (
          <div className={styles.passScreen}>
            <div className={styles.passIcon}>📱</div>
            <h1 className={styles.passTitle}>Pass the phone to</h1>
            <div className={styles.playerName}>{currentPlayer.name}</div>
            <p className={styles.passSubtitle}>
              Make sure no one else can see the screen
            </p>
            <Button onClick={handleReveal} size="lg" fullWidth>
              👁️ Reveal My Role
            </Button>
            <p className={styles.progress}>
              Player {currentPlayerIndex + 1} of {players.length}
            </p>
          </div>
        ) : (
          <div className={`${styles.revealScreen} ${isImpostor ? styles.impostor : styles.villager}`}>
            {isImpostor ? (
              <>
                <div className={styles.roleIcon}>🕵️</div>
                <h1 className={styles.roleTitle}>You are the Impostor!</h1>
                <p className={styles.roleSubtitle}>
                  Blend in with the others. Don't be obvious.
                </p>
                <div className={styles.tip}>
                  <span className={styles.tipLabel}>Tip:</span>
                  <span>Listen carefully and give vague clues</span>
                </div>
              </>
            ) : (
              <>
                <div className={styles.roleIcon}>🎯</div>
                <h1 className={styles.roleTitle}>The Secret Word</h1>
                <div className={styles.secretWord}>{secretWord}</div>
                <p className={styles.roleSubtitle}>
                  Remember it. Be subtle.
                </p>
              </>
            )}
            <Button onClick={handleHideAndPass} size="lg" fullWidth variant={isImpostor ? 'danger' : 'secondary'}>
              🙈 Hide & Pass On
            </Button>
          </div>
        )}
      </ScreenContent>
    </Screen>
  );
};
