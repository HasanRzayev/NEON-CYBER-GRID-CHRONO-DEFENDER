import React, { useState } from 'react';
import { soundManager } from '../audio/SoundManager';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
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
  const { t } = useLanguage();
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
        {/* Language Switcher Bar */}
        <div className="menu-lang-bar">
          <LanguageSelector showIcon={true} />
        </div>

        {/* Title & Tagline */}
        <div className="menu-header">
          <div className="cyber-sub-badge">{t.systemIntegrity}</div>
          <h1 className="menu-main-title glitch-text" data-text={t.gameTitle}>
            {t.gameTitle}
          </h1>
          <div className="menu-subtitle">{t.gameSubtitle}</div>
        </div>

        {/* Action Buttons */}
        <div className="menu-actions">
          <button className="cyber-btn primary-btn" onClick={onStart}>
            <Play size={20} className="mr-2" />
            <span>{t.deploySentinel}</span>
          </button>

          <button className="cyber-btn secondary-btn" onClick={onOpenAchievements}>
            <Trophy size={18} className="mr-2" />
            <span>{t.tacticalArchive}</span>
          </button>

          <button className="cyber-btn tertiary-btn" onClick={handleToggleMute}>
            {muted ? (
              <>
                <VolumeX size={18} className="mr-2 text-red" />
                <span>{t.soundMuted}</span>
              </>
            ) : (
              <>
                <Volume2 size={18} className="mr-2 text-cyan" />
                <span>{t.soundActive}</span>
              </>
            )}
          </button>
        </div>

        {/* High Score Banner */}
        <div className="menu-highscore-box">
          <span className="hs-label">{t.allTimeRecord}</span>
          <span className="hs-value">{highScore.toLocaleString()} PTS</span>
        </div>

        {/* Quick Controls Card */}
        <div className="controls-cheat-sheet">
          <div className="controls-title">{t.operationalControls}</div>
          <div className="controls-grid">
            <div className="control-item">
              <span className="key-cap">W A S D</span>
              <span className="key-desc">{t.ctrlMove}</span>
            </div>
            <div className="control-item">
              <span className="key-cap">
                <MousePointer size={14} className="inline mr-1" /> AIM
              </span>
              <span className="key-desc">{t.ctrlAim}</span>
            </div>
            <div className="control-item">
              <span className="key-cap">
                <Clock size={14} className="inline mr-1 text-chrono" /> SPACE
              </span>
              <span className="key-desc">{t.ctrlChrono}</span>
            </div>
            <div className="control-item">
              <span className="key-cap">
                <Zap size={14} className="inline mr-1 text-cyan" /> SHIFT
              </span>
              <span className="key-desc">{t.ctrlDash}</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="menu-footer">
          <span>{t.kernelVersion}</span>
          <span>•</span>
          <span>{t.chronoRestraint}</span>
          <span>•</span>
          <span>60 FPS SYNTH ENGINE</span>
        </div>
      </div>
    </div>
  );
};
