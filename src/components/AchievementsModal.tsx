import React from 'react';
import type { Achievement } from '../types/game';
import { useLanguage } from '../i18n/LanguageContext';
import { Trophy, CheckCircle2, Lock, X, Crosshair, Shield, Clock, Zap, Flame } from 'lucide-react';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Crosshair,
  Shield,
  Clock,
  Zap,
  Flame,
  Trophy,
};

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  onClose,
}) => {
  const { t } = useLanguage();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="modal-overlay">
      <div className="achievements-box">
        <div className="achievements-header">
          <div>
            <div className="sub-header-tag">{t.archivedMilestones}</div>
            <h2 className="modal-title neon-text">{t.tacticalAchievements}</h2>
          </div>
          <button className="close-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="achievements-status-bar">
          <span>{t.progressLabel}</span>
          <span className="text-cyan font-bold">
            {unlockedCount} / {achievements.length} {t.unlockedBadge}
          </span>
        </div>

        <div className="achievements-list">
          {achievements.map((ach) => {
            const IconComp = ICON_MAP[ach.icon] || Trophy;
            const localized = t.achievements[ach.id];
            const title = localized ? localized.title : ach.title;
            const description = localized ? localized.description : ach.description;

            return (
              <div
                key={ach.id}
                className={`achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="ach-icon-col">
                  {ach.unlocked ? (
                    <div className="ach-icon-circle unlocked">
                      <IconComp size={24} className="text-gold" />
                    </div>
                  ) : (
                    <div className="ach-icon-circle locked">
                      <Lock size={20} className="text-muted" />
                    </div>
                  )}
                </div>

                <div className="ach-info-col">
                  <div className="ach-title-row">
                    <h3 className="ach-title">{title}</h3>
                    {ach.unlocked && (
                      <span className="ach-badge">
                        <CheckCircle2 size={13} className="mr-1 inline text-green" /> {t.completedBadge}
                      </span>
                    )}
                  </div>
                  <p className="ach-desc">{description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="achievements-footer">
          <button className="cyber-btn primary-btn" onClick={onClose}>
            {t.returnToReady}
          </button>
        </div>
      </div>
    </div>
  );
};
