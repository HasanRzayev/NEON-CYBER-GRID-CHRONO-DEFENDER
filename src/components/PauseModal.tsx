import React, { useState } from 'react';
import { soundManager } from '../audio/SoundManager';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { Play, RotateCcw, Home, Volume2, VolumeX, Sliders } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
}) => {
  const { t } = useLanguage();
  const [muted, setMuted] = useState(soundManager.getIsMuted());
  const [sfxVol, setSfxVol] = useState(0.5);
  const [musicVol, setMusicVol] = useState(0.3);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundManager.setMuted(next);
  };

  const changeSfx = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSfxVol(val);
    soundManager.setSfxVolume(val);
  };

  const changeMusic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMusicVol(val);
    soundManager.setMusicVolume(val);
  };

  return (
    <div className="modal-overlay">
      <div className="pause-box">
        <div className="modal-header">
          <div className="sub-header-tag">{t.systemSuspended}</div>
          <h2 className="modal-title">{t.chronoStasisActive}</h2>
        </div>

        {/* Audio & Language Controls */}
        <div className="pause-settings-panel">
          <div className="panel-title">
            <Sliders size={16} className="mr-2" />
            <span>{t.audioConfig}</span>
          </div>

          {/* Language Switcher */}
          <div className="setting-row">
            <span>{t.languageSelect}</span>
            <LanguageSelector showIcon={false} />
          </div>

          {/* Master Audio Toggle */}
          <div className="setting-row">
            <span>{t.masterAudio}</span>
            <button
              className={`toggle-btn ${muted ? 'off' : 'on'}`}
              onClick={toggleMute}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span>{muted ? t.audioMuted : t.audioEnabled}</span>
            </button>
          </div>

          {/* SFX */}
          <div className="setting-row slider-row">
            <span>{t.sfxSynth}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sfxVol}
              onChange={changeSfx}
              className="cyber-slider"
            />
          </div>

          {/* Music */}
          <div className="setting-row slider-row">
            <span>{t.musicMatrix}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVol}
              onChange={changeMusic}
              className="cyber-slider"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pause-actions">
          <button className="cyber-btn primary-btn" onClick={onResume}>
            <Play size={18} className="mr-2" />
            <span>{t.resumeBtn}</span>
          </button>

          <button className="cyber-btn secondary-btn" onClick={onRestart}>
            <RotateCcw size={18} className="mr-2" />
            <span>{t.restartBtn}</span>
          </button>

          <button className="cyber-btn tertiary-btn" onClick={onHome}>
            <Home size={18} className="mr-2" />
            <span>{t.abortToMenu}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
