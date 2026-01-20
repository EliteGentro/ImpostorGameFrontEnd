import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store';
import { api } from '@/services';
import { Category } from '@/types';
import {
  Screen,
  ScreenHeader,
  ScreenContent,
  ScreenFooter,
  Button,
  Stepper,
  Checkbox,
} from '@/components/ui';
import styles from './GameConfig.module.css';

export const GameConfig: React.FC = () => {
  const {
    players,
    config,
    setRounds,
    setImpostorCount,
    setRandomImpostors,
    setSelectedCategories,
    startGame,
    setPhase,
  } = useGameStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
        // Select all categories by default
        if (config.selectedCategories.length === 0) {
          setSelectedCategories(data.map((c) => c.id));
        }
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...config.selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        config.selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };

  const handleSelectAll = () => {
    setSelectedCategories(categories.map((c) => c.id));
  };

  const handleDeselectAll = () => {
    setSelectedCategories([]);
  };

  const handleBack = () => {
    setPhase('setup');
  };

  const handleStartGame = async () => {
    if (config.selectedCategories.length === 0) return;

    setStarting(true);
    try {
      const word = await api.getRandomWord(config.selectedCategories);
      startGame(word.value);
    } catch (err) {
      setError('Failed to get a word. Please try again.');
      console.error(err);
      setStarting(false);
    }
  };

  const maxImpostors = Math.max(1, players.length - 2);
  const canStart = config.selectedCategories.length > 0 && !starting;

  return (
    <Screen>
      <ScreenHeader
        title="⚙️ Game Settings"
        subtitle={`${players.length} players ready`}
      />

      <ScreenContent>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Rounds</h2>
          <Stepper
            label="Number of rounds"
            value={config.rounds}
            onChange={setRounds}
            min={1}
            max={10}
          />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Impostors</h2>
          <Checkbox
            label="Random number of impostors"
            description="Adds mystery - could be 0 to all!"
            checked={config.isRandomImpostors}
            onChange={setRandomImpostors}
          />
          {!config.isRandomImpostors && (
            <Stepper
              label="Number of impostors"
              value={config.impostorCount}
              onChange={setImpostorCount}
              min={1}
              max={maxImpostors}
            />
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Categories</h2>
            <div className={styles.categoryActions}>
              <button
                onClick={handleSelectAll}
                className={styles.textButton}
              >
                All
              </button>
              <span className={styles.divider}>|</span>
              <button
                onClick={handleDeselectAll}
                className={styles.textButton}
              >
                None
              </button>
            </div>
          </div>

          {loading ? (
            <p className={styles.loadingText}>Loading categories...</p>
          ) : error ? (
            <p className={styles.errorText}>{error}</p>
          ) : (
            <div className={styles.categoryList}>
              {categories.map((category) => (
                <Checkbox
                  key={category.id}
                  label={category.name}
                  description={category.description}
                  checked={config.selectedCategories.includes(category.id)}
                  onChange={(checked) =>
                    handleCategoryToggle(category.id, checked)
                  }
                />
              ))}
            </div>
          )}
        </section>
      </ScreenContent>

      <ScreenFooter>
        <Button onClick={handleBack} variant="ghost" fullWidth>
          ← Back to Players
        </Button>
        <Button
          onClick={handleStartGame}
          disabled={!canStart}
          fullWidth
          size="lg"
        >
          {starting ? 'Starting...' : '🎮 Start Game'}
        </Button>
      </ScreenFooter>
    </Screen>
  );
};
