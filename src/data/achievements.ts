import type { Achievement } from '../types/game';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'System Purifier',
    description: 'Neutralize your first corrupted anomaly.',
    icon: 'Crosshair',
    unlocked: false,
    check: (stats) => stats.enemiesKilled >= 1,
  },
  {
    id: 'wave_survivor_5',
    title: 'Firewall Defender',
    description: 'Survive past Wave 5 and defeat the Leviathan Boss.',
    icon: 'Shield',
    unlocked: false,
    check: (stats) => stats.wave >= 5 && stats.bossesDefeated >= 1,
  },
  {
    id: 'chrono_master',
    title: 'Time Lord',
    description: 'Spend more than 30 total seconds in Chrono Bullet-Time.',
    icon: 'Clock',
    unlocked: false,
    check: (stats) => stats.chronoTimeUsed >= 30,
  },
  {
    id: 'combo_king',
    title: 'Overclocked Reflexes',
    description: 'Reach a continuous combat combo multiplier of 50x.',
    icon: 'Zap',
    unlocked: false,
    check: (stats) => stats.highestCombo >= 50,
  },
  {
    id: 'damage_dealer',
    title: 'Cyber Cataclysm',
    description: 'Deal over 100,000 total damage across your operations.',
    icon: 'Flame',
    unlocked: false,
    check: (stats) => stats.damageDealt >= 100000,
  },
  {
    id: 'high_scorer',
    title: 'Elite Sentinel',
    description: 'Score over 50,000 points in a single deployment.',
    icon: 'Trophy',
    unlocked: false,
    check: (stats) => stats.score >= 50000,
  },
];

export function loadSavedAchievements(): Achievement[] {
  const saved = localStorage.getItem('chrono_achievements');
  if (!saved) return INITIAL_ACHIEVEMENTS;

  try {
    const parsed = JSON.parse(saved) as Record<string, boolean>;
    return INITIAL_ACHIEVEMENTS.map((ach) => ({
      ...ach,
      unlocked: Boolean(parsed[ach.id]),
    }));
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function saveAchievements(achievements: Achievement[]) {
  const map: Record<string, boolean> = {};
  achievements.forEach((a) => {
    map[a.id] = a.unlocked;
  });
  localStorage.setItem('chrono_achievements', JSON.stringify(map));
}
