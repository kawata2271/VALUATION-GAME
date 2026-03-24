import { lazy, Suspense } from 'react';
import { useGameStore } from './ui/hooks/useGame';
import { TitleScreen } from './ui/screens/TitleScreen';

const SetupScreen = lazy(() => import('./ui/screens/SetupScreen').then(m => ({ default: m.SetupScreen })));
const GameScreen = lazy(() => import('./ui/screens/GameScreen').then(m => ({ default: m.GameScreen })));
const GameOverScreen = lazy(() => import('./ui/screens/GameOverScreen').then(m => ({ default: m.GameOverScreen })));
const StatsScreen = lazy(() => import('./ui/screens/StatsScreen').then(m => ({ default: m.StatsScreen })));

const Loading = () => (
  <div style={{
    height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#0a0a0f', color: '#555', fontSize: 14,
  }}>
    Loading...
  </div>
);

function App() {
  const screen = useGameStore(s => s.screen);
  const setScreen = useGameStore(s => s.setScreen);

  return (
    <Suspense fallback={<Loading />}>
      {screen === 'title' && <TitleScreen />}
      {screen === 'setup' && <SetupScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'gameover' && <GameOverScreen />}
      {screen === 'stats' && <StatsScreen onBack={() => setScreen('title')} />}
    </Suspense>
  );
}

export default App;
