import React from 'react';
import type { Augment } from '../types/game';
import {
  Zap,
  Shield,
  FastForward,
  Compass,
  BatteryCharging,
  Crosshair,
  Maximize2,
  ShieldAlert,
  Target,
  Cpu,
  ZapOff,
  Radio,
  Clock,
  Layers,
  Sparkles,
  Flame,
  Sun,
  Award,
} from 'lucide-react';

interface UpgradeModalProps {
  options: Augment[];
  onSelect: (id: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Zap,
  Shield,
  FastForward,
  Compass,
  BatteryCharging,
  Crosshair,
  Maximize2,
  ShieldAlert,
  Target,
  Cpu,
  ZapOff,
  Radio,
  Clock,
  Layers,
  Sparkles,
  Flame,
  Sun,
  Award,
};

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ options, onSelect }) => {
  return (
    <div className="modal-overlay">
      <div className="upgrade-modal-box">
        <div className="modal-header">
          <div className="sub-header-tag">SENTINEL LEVEL ELEVATION</div>
          <h2 className="modal-title neon-text">SELECT TACTICAL AUGMENT</h2>
          <p className="modal-desc">
            Enhance mainframe subroutines to overcome escalated corruption waves.
          </p>
        </div>

        <div className="augment-cards-grid">
          {options.map((aug) => {
            const IconComponent = ICON_MAP[aug.iconName] || Award;
            return (
              <div
                key={aug.id}
                className={`augment-card rarity-${aug.rarity}`}
                onClick={() => onSelect(aug.id)}
              >
                <div className="card-rarity-badge">
                  {aug.rarity.toUpperCase()}
                </div>

                <div className="card-icon-wrapper">
                  <IconComponent size={36} className="card-icon" />
                </div>

                <h3 className="card-title">{aug.title}</h3>
                <p className="card-description">{aug.description}</p>

                <div className="card-footer">
                  <span className="card-stacks">
                    STACK: {aug.currentStacks + 1} / {aug.maxStacks}
                  </span>
                  <button className="card-install-btn">INSTALL</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
