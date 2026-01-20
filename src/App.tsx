import { useGameStore } from '@/store';
import {
  PlayerSetup,
  GameConfig,
  RevealPhase,
  GameplayScreen,
  VotingPhase,
  ResultsScreen,
} from '@/components/screens';

function App() {
  const { phase } = useGameStore();

  const renderScreen = () => {
    switch (phase) {
      case 'setup':
        return <PlayerSetup />;
      case 'config':
        return <GameConfig />;
      case 'reveal':
        return <RevealPhase />;
      case 'playing':
        return <GameplayScreen />;
      case 'voting':
        return <VotingPhase />;
      case 'results':
        return <ResultsScreen />;
      default:
        return <PlayerSetup />;
    }
  };

  return <div className="no-select">{renderScreen()}</div>;
}

export default App;
