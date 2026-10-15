import { useEffect, useRef, useState } from 'react';
import { GameEngine } from './engine/GameEngine';
import type { GameState, GameStats, Augment, PlayerStats } from './types/game';
import { HUD } from './components/HUD';
import { MainMenu } from './components/MainMenu';
import { UpgradeModal } from './components/UpgradeModal';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { AchievementsModal } from './components/AchievementsModal';
import { VirtualControls } from './components/VirtualControls';
import './App.css';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('menu');
  const [showAchievements, setShowAchievements] = useState(false);
  const [upgradeOptions, setUpgradeOptions] = useState<Augment[]>([]);

  // Synced Stats for HUD
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    highScore: 0,
    wave: 1,
    timeSurvived: 0,
    enemiesKilled: 0,
    bossesDefeated: 0,
    damageDealt: 0,
    damageTaken: 0,
    chronoTimeUsed: 0,
    highestCombo: 1,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current);
    engineRef.current = engine;

    // Connect Engine Callbacks
    engine.onStateChange = (newState) => {
      setGameState(newState);
    };

    engine.onLevelUpChoice = (options) => {
      setUpgradeOptions(options);
    };

    engine.onStatsUpdate = (stats, pStats) => {
      setGameStats({ ...stats });
      setPlayerStats({ ...pStats });
    };

    // Initialize stats state
    setGameStats({ ...engine.stats });
    setPlayerStats({ ...engine.player.stats });

    return () => {
      engine.cleanup();
    };
  }, []);

  const handleStartGame = () => {
    engineRef.current?.startNewGame();
  };

  const handleSelectAugment = (id: string) => {
    engineRef.current?.applyChosenAugment(id);
    setUpgradeOptions([]);
  };

  const handlePause = () => {
    engineRef.current?.setState('paused');
  };

  const handleResume = () => {
    engineRef.current?.setState('playing');
  };

  const handleRestart = () => {
    engineRef.current?.startNewGame();
  };

  const handleHome = () => {
    engineRef.current?.setState('menu');
  };

  const handleToggleChrono = () => {
    engineRef.current?.player.toggleChrono();
  };

  const handleTriggerDash = () => {
    if (engineRef.current) {
      engineRef.current.player.triggerDash(
        engineRef.current.particles,
        engineRef.current.grid
      );
    }
  };

  const boss = engineRef.current?.enemies.getCurrentBoss();
  const bossHealthPercent = boss && boss.maxHealth > 0 ? boss.health / boss.maxHealth : 1;

  return (
    <div className="game-app-wrapper">
      {/* Background Interactive Canvas */}
      <canvas ref={canvasRef} className="game-canvas" />

      {/* Main HUD */}
      {playerStats && gameState !== 'menu' && (
        <HUD
          playerStats={playerStats}
          gameStats={gameStats}
          isBossActive={Boolean(boss && boss.health > 0)}
          bossHealthPercent={bossHealthPercent}
          onPause={handlePause}
          onToggleChrono={handleToggleChrono}
          onTriggerDash={handleTriggerDash}
        />
      )}

      {/* On-screen touch controls */}
      {gameState === 'playing' && playerStats && (
        <VirtualControls
          onDash={handleTriggerDash}
          onChrono={handleToggleChrono}
          isChronoActive={playerStats.isChronoActive}
        />
      )}

      {/* Main Menu Overlay */}
      {gameState === 'menu' && (
        <MainMenu
          highScore={gameStats.highScore}
          onStart={handleStartGame}
          onOpenAchievements={() => setShowAchievements(true)}
        />
      )}

      {/* Roguelite Upgrade Choice Modal */}
      {gameState === 'upgrade' && (
        <UpgradeModal
          options={upgradeOptions}
          onSelect={handleSelectAugment}
        />
      )}

      {/* Pause Menu */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}

      {/* Game Over Screen */}
      {gameState === 'gameover' && (
        <GameOverModal
          stats={gameStats}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}

      {/* Achievements / Tactical Archive Modal */}
      {showAchievements && engineRef.current && (
        <AchievementsModal
          achievements={engineRef.current.achievements}
          onClose={() => setShowAchievements(false)}
        />
      )}
    </div>
  );
}
