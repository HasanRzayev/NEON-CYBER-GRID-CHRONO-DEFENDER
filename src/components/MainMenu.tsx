import React, { useState } from 'react';
import { soundManager } from '../audio/SoundManager';
import { Play, Trophy, Volume2, VolumeX, Zap, Clock, MousePointer } from 'lucide-react';

interface MainMenuProps {
  highScore: number;
  onStart: () => void;
  onOpenAchievements: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  highScore,
  onStart,
  onOpenAchievements,
}) => {
  const [muted, setMuted] = useState(soundManager.getIsMuted());

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundManager.setMuted(next);
  };

  return (
    <div className="main-menu-overlay">
      <div className="menu-scanlines" />

      <div className="main-menu-content">
        {/* Title & Tagline */}
        <div className="menu-header">
          <div className="cyber-sub-badge">SYSTEM INTEGRITY: 14% // ANOMALY DETECTED</div>
          <h1 className="menu-main-title glitch-text" data-text="NEON CYBER-GRID">
            NEON CYBER-GRID
          </h1>
          <div className="menu-subtitle">CHRONO DEFENDER PROTOCOL</div>
        </div>

        {/* Action Buttons */}
        <div className="menu-actions">
          <button className="cyber-btn primary-btn" onClick={onStart}>
            <Play size={20} className="mr-2" />
            <span>DEPLOY SENTINEL</span>
          </button>

          <button className="cyber-btn secondary-btn" onClick={onOpenAchievements}>
            <Trophy size={18} className="mr-2" />
            <span>TACTICAL ARCHIVE</span>
          </button>

          <button className="cyber-btn tertiary-btn" onClick={handleToggleMute}>
            {muted ? (
              <>
                <VolumeX size={18} className="mr-2 text-red" />
                <span>SOUND: MUTED</span>
              </>
            ) : (
              <>
                <Volume2 size={18} className="mr-2 text-cyan" />
                <span>SOUND: ACTIVE</span>
              </>
            )}
          </button>
        </div>

        {/* High Score Banner */}
        <div className="menu-highscore-box">
          <span className="hs-label">ALL-TIME RECORD PURGE</span>
          <span className="hs-value">{highScore.toLocaleString()} PTS</span>
        </div>

        {/* Quick Controls Card */}
        <div className="controls-cheat-sheet">
          <div className="controls-title">OPERATIONAL CONTROLS</div>
          <div className="controls-grid">
            <div className="control-item">
              <span className="key-cap">W A S D</span>
              <span className="key-desc">Maneuver Sentinel</span>
            </div>
            <div className="control-item">
              <span className="key-cap">
                <MousePointer size={14} className="inline mr-1" /> AIM
              </span>
              <span className="key-desc">Auto-Target & Fire</span>
            </div>
            <div className="control-item">
              <span className="key-cap">
                <Clock size={14} className="inline mr-1 text-chrono" /> SPACE
              </span>
              <span className="key-desc">Chrono Matrix (Slow-Mo)</span>
            </div>
            <div className="control-item">
              <span className="key-cap">
                <Zap size={14} className="inline mr-1 text-cyan" /> SHIFT
              </span>
              <span className="key-desc">Quantum Blink Dash</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="menu-footer">
          <span>QUANTUM KERNEL v2.4.0</span>
          <span>•</span>
          <span>CHRONO RESTRAINT: ACTIVE</span>
          <span>•</span>
          <span>60 FPS SYNTH ENGINE</span>
        </div>
      </div>
    </div>
  );
};
