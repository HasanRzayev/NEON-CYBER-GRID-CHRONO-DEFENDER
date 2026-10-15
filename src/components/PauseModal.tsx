import React, { useState } from 'react';
import { soundManager } from '../audio/SoundManager';
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
          <div className="sub-header-tag">SYSTEM SUSPENDED</div>
          <h2 className="modal-title">CHRONO STASIS ACTIVE</h2>
        </div>

        {/* Audio Controls */}
        <div className="pause-settings-panel">
          <div className="panel-title">
            <Sliders size={16} className="mr-2" />
            <span>AUDIO CONFIGURATION</span>
          </div>

          <div className="setting-row">
            <span>MASTER AUDIO</span>
            <button
              className={`toggle-btn ${muted ? 'off' : 'on'}`}
              onClick={toggleMute}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span>{muted ? 'MUTED' : 'ENABLED'}</span>
            </button>
          </div>

          <div className="setting-row slider-row">
            <span>SFX SYNTHESIZER</span>
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

          <div className="setting-row slider-row">
            <span>MUSIC MATRIX</span>
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
            <span>RESUME OPERATION [P]</span>
          </button>

          <button className="cyber-btn secondary-btn" onClick={onRestart}>
            <RotateCcw size={18} className="mr-2" />
            <span>RESTART DEPLOYMENT</span>
          </button>

          <button className="cyber-btn tertiary-btn" onClick={onHome}>
            <Home size={18} className="mr-2" />
            <span>ABORT TO MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
