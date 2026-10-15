import React from 'react';
import type { PlayerStats, GameStats } from '../types/game';
import { Shield, Heart, Zap, Clock, Trophy, Flame } from 'lucide-react';

interface HUDProps {
  playerStats: PlayerStats;
  gameStats: GameStats;
  isBossActive: boolean;
  bossHealthPercent?: number;
  onPause: () => void;
  onToggleChrono: () => void;
  onTriggerDash: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  playerStats,
  gameStats,
  isBossActive,
  bossHealthPercent = 1,
  onPause,
  onToggleChrono,
  onTriggerDash,
}) => {
  const hpPercent = Math.max(0, (playerStats.health / playerStats.maxHealth) * 100);
  const shieldPercent = Math.max(0, (playerStats.shield / playerStats.maxShield) * 100);
  const chronoPercent = Math.max(0, (playerStats.chronoEnergy / playerStats.maxChronoEnergy) * 100);
  const xpPercent = Math.min(100, (playerStats.xp / playerStats.nextLevelXp) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="hud-container">
      {/* Top Header Row */}
      <div className="hud-top-bar">
        {/* Left: Vitals */}
        <div className="hud-vitals">
          {/* Health */}
          <div className="vital-group">
            <div className="vital-header">
              <span className="vital-label">
                <Heart size={14} className="icon-pulse text-red" /> HP
              </span>
              <span className="vital-value text-red">
                {Math.ceil(playerStats.health)} / {playerStats.maxHealth}
              </span>
            </div>
            <div className="vital-bar-track">
              <div
                className="vital-bar-fill fill-health"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* Shield */}
          <div className="vital-group">
            <div className="vital-header">
              <span className="vital-label">
                <Shield size={14} className="text-cyan" /> SHIELD
              </span>
              <span className="vital-value text-cyan">
                {Math.ceil(playerStats.shield)} / {playerStats.maxShield}
              </span>
            </div>
            <div className="vital-bar-track">
              <div
                className="vital-bar-fill fill-shield"
                style={{ width: `${shieldPercent}%` }}
              />
            </div>
          </div>

          {/* Chrono Energy */}
          <div className="vital-group">
            <div className="vital-header">
              <span className="vital-label">
                <Clock size={14} className="text-chrono" /> CHRONO MATRIX
              </span>
              <span className="vital-value text-chrono">
                {Math.ceil(playerStats.chronoEnergy)}%
              </span>
            </div>
            <div className="vital-bar-track">
              <div
                className={`vital-bar-fill fill-chrono ${playerStats.isChronoActive ? 'chrono-active-pulse' : ''}`}
                style={{ width: `${chronoPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Wave & Boss Info */}
        <div className="hud-center">
          <div className="wave-badge">
            <span className="wave-title">SECTOR / WAVE</span>
            <span className="wave-number">{gameStats.wave}</span>
          </div>

          <div className="survival-time">
            {formatTime(gameStats.timeSurvived)}
          </div>

          {isBossActive && (
            <div className="boss-banner">
              <div className="boss-title">⚠️ ROGUE AI OVERLORD DETECTED</div>
              <div className="boss-bar-track">
                <div
                  className="boss-bar-fill"
                  style={{ width: `${bossHealthPercent * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Score, Combo & Pause */}
        <div className="hud-right">
          <div className="score-display">
            <div className="score-label">CURRENT SCORE</div>
            <div className="score-value">{gameStats.score.toLocaleString()}</div>
            <div className="high-score-sub">
              <Trophy size={11} className="inline mr-1 text-gold" /> HI: {gameStats.highScore.toLocaleString()}
            </div>
          </div>

          {playerStats.combo > 1 && (
            <div className="combo-counter">
              <Flame size={18} className="combo-flame" />
              <span className="combo-val">{playerStats.combo}x</span>
              <span className="combo-text">COMBO</span>
            </div>
          )}

          <button className="hud-btn pause-btn" onClick={onPause} title="Pause (P)">
            PAUSE
          </button>
        </div>
      </div>

      {/* Bottom Center: XP Bar & Quick Action Indicators */}
      <div className="hud-bottom-bar">
        <div className="xp-container">
          <div className="xp-info">
            <span className="level-badge">LVL {playerStats.level}</span>
            <span className="xp-ratio">
              XP {Math.round(playerStats.xp)} / {playerStats.nextLevelXp}
            </span>
          </div>
          <div className="xp-track">
            <div className="xp-fill" style={{ width: `${xpPercent}%` }} />
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div className="action-buttons-hud">
          <button
            className={`action-pill ${playerStats.isChronoActive ? 'active' : ''}`}
            onClick={onToggleChrono}
          >
            <Clock size={16} />
            <span>CHRONO [SPACE]</span>
          </button>
          <button className="action-pill" onClick={onTriggerDash}>
            <Zap size={16} />
            <span>BLINK [SHIFT]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
