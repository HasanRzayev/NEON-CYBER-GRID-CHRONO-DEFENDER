import React from 'react';
import type { Augment } from '../types/game';
import { useLanguage } from '../i18n/LanguageContext';
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
  const { t } = useLanguage();

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'rare': return t.rarityRare;
      case 'epic': return t.rarityEpic;
      case 'legendary': return t.rarityLegendary;
      default: return t.rarityCommon;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="upgrade-modal-box">
        <div className="modal-header">
          <div className="sub-header-tag">{t.levelElevation}</div>
          <h2 className="modal-title neon-text">{t.selectAugment}</h2>
          <p className="modal-desc">{t.augmentDesc}</p>
        </div>

        <div className="augment-cards-grid">
          {options.map((aug) => {
            const IconComponent = ICON_MAP[aug.iconName] || Award;
            const localized = t.augments[aug.id];
            const title = localized ? localized.title : aug.title;
            const description = localized ? localized.description : aug.description;

            return (
              <div
                key={aug.id}
                className={`augment-card rarity-${aug.rarity}`}
                onClick={() => onSelect(aug.id)}
              >
                <div className="card-rarity-badge">
                  {getRarityLabel(aug.rarity)}
                </div>

                <div className="card-icon-wrapper">
                  <IconComponent size={36} className="card-icon" />
                </div>

                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>

                <div className="card-footer">
                  <span className="card-stacks">
                    {t.stackPrefix}: {aug.currentStacks + 1} / {aug.maxStacks}
                  </span>
                  <button className="card-install-btn">{t.installBtn}</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
