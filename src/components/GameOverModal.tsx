import React, { useEffect } from 'react';
import type { GameStats } from '../types/game';
import { useLanguage } from '../i18n/LanguageContext';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Trophy, Skull } from 'lucide-react';

interface GameOverModalProps {
  stats: GameStats;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ stats, onRestart, onHome }) => {
  const { t } = useLanguage();
  const isNewHighScore = stats.score > 0 && stats.score >= stats.highScore;

  useEffect(() => {
    if (isNewHighScore) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ffcc', '#00f0ff', '#ff00ff', '#ffd700'],
      });
    }
  }, [isNewHighScore]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="modal-overlay">
      <div className="gameover-box">
        <div className="glitch-header-danger">
          <Skull size={44} className="danger-icon" />
          <h2 className="danger-title">{t.coreCompromised}</h2>
          <div className="danger-sub">{t.sentinelShutdown}</div>
        </div>

        {isNewHighScore && (
          <div className="new-highscore-badge">
            <Trophy size={18} className="text-gold mr-2" />
            <span>{t.newRecordEstablished}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-summary-grid">
          <div className="stat-card highlight">
            <span className="stat-label">{t.finalScore}</span>
            <span className="stat-val text-cyan">{stats.score.toLocaleString()}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">{t.waveReached}</span>
            <span className="stat-val text-purple">{stats.wave}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">{t.survivalDuration}</span>
            <span className="stat-val">{formatTime(stats.timeSurvived)}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">{t.anomaliesPurged}</span>
            <span className="stat-val">{stats.enemiesKilled.toLocaleString()}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">{t.bossesDefeated}</span>
            <span className="stat-val text-red">{stats.bossesDefeated}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">{t.maxCombo}</span>
            <span className="stat-val text-gold">{stats.highestCombo}x</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">{t.totalDamage}</span>
            <span className="stat-val">{Math.round(stats.damageDealt).toLocaleString()}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">{t.chronoUtilization}</span>
            <span className="stat-val text-chrono">{Math.round(stats.chronoTimeUsed)}s</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="gameover-actions">
          <button className="cyber-btn primary-btn" onClick={onRestart}>
            <RotateCcw size={18} className="mr-2" />
            <span>{t.rebootSentinel}</span>
          </button>

          <button className="cyber-btn secondary-btn" onClick={onHome}>
            <Home size={18} className="mr-2" />
            <span>{t.returnToArchive}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
