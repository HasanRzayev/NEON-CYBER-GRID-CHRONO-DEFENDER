import type { Augment } from '../types/game';

export const AUGMENTS_POOL: Augment[] = [
  // COMMON
  {
    id: 'overclock_reactor',
    title: 'Overclock Reactor',
    description: '+15% Fire Rate for all primary and secondary weapons.',
    rarity: 'common',
    iconName: 'Zap',
    category: 'weapon',
    maxStacks: 5,
    currentStacks: 0,
    apply: (player, weapons) => {
      player.fireRateMultiplier += 0.15;
      weapons.forEach((w) => {
        w.fireRate *= 1.15;
      });
    },
  },
  {
    id: 'nanite_hull',
    title: 'Nanite Hull Plating',
    description: '+25 Max Health and heals 25 HP immediately.',
    rarity: 'common',
    iconName: 'Shield',
    category: 'defense',
    maxStacks: 5,
    currentStacks: 0,
    apply: (player) => {
      player.maxHealth += 25;
      player.health = Math.min(player.maxHealth, player.health + 25);
    },
  },
  {
    id: 'kinetic_booster',
    title: 'Kinetic Thrusters',
    description: '+12% Movement Speed and +10% Dash Distance.',
    rarity: 'common',
    iconName: 'FastForward',
    category: 'utility',
    maxStacks: 4,
    currentStacks: 0,
    apply: (player) => {
      player.speed *= 1.12;
      player.maxSpeed *= 1.12;
    },
  },
  {
    id: 'magnetic_extractor',
    title: 'Magnetic Harvester',
    description: '+40% Pickup Radius for XP, Shields, and Power-ups.',
    rarity: 'common',
    iconName: 'Compass',
    category: 'utility',
    maxStacks: 3,
    currentStacks: 0,
    apply: (player) => {
      player.pickupMagnetRadius *= 1.4;
    },
  },
  {
    id: 'energy_capacitor',
    title: 'Chrono Capacitor',
    description: '+25 Max Chrono Energy & +15% Energy Recharge Rate.',
    rarity: 'common',
    iconName: 'BatteryCharging',
    category: 'chrono',
    maxStacks: 4,
    currentStacks: 0,
    apply: (player) => {
      player.maxChronoEnergy += 25;
      player.chronoEnergy = player.maxChronoEnergy;
      player.chronoRegenRate *= 1.15;
    },
  },

  // RARE
  {
    id: 'piercing_plasma',
    title: 'High-Density Cores',
    description: 'Primary Plasma shots pierce +1 additional enemy and deal +20% damage.',
    rarity: 'rare',
    iconName: 'Crosshair',
    category: 'weapon',
    maxStacks: 3,
    currentStacks: 0,
    apply: (_player, weapons) => {
      const plasma = weapons.get('plasma');
      if (plasma) {
        plasma.pierce += 1;
        plasma.damage *= 1.2;
      }
    },
  },
  {
    id: 'chrono_beam_unlock',
    title: 'Chrono Beam Protocol',
    description: 'Unlocks a piercing high-energy laser beam that sweeps across the grid.',
    rarity: 'rare',
    iconName: 'Maximize2',
    category: 'weapon',
    maxStacks: 1,
    currentStacks: 0,
    apply: (_, weapons) => {
      const beam = weapons.get('chronoBeam');
      if (beam) {
        beam.unlocked = true;
        beam.level = 1;
      }
    },
  },
  {
    id: 'shield_matrix',
    title: 'Phase Shield Matrix',
    description: '+30 Max Shield and shield begins regenerating 30% sooner after taking hit.',
    rarity: 'rare',
    iconName: 'ShieldAlert',
    category: 'defense',
    maxStacks: 3,
    currentStacks: 0,
    apply: (player) => {
      player.maxShield += 30;
      player.shield = player.maxShield;
      player.shieldRegenDelay = Math.max(0.8, player.shieldRegenDelay * 0.7);
    },
  },
  {
    id: 'quantum_crit',
    title: 'Precision Targeting Subroutine',
    description: '+12% Critical Strike Chance and +40% Critical Strike Damage.',
    rarity: 'rare',
    iconName: 'Target',
    category: 'weapon',
    maxStacks: 4,
    currentStacks: 0,
    apply: (player) => {
      player.critChance += 0.12;
      player.critMultiplier += 0.4;
    },
  },
  {
    id: 'attack_drone',
    title: 'Guardian Drone Unit',
    description: 'Deploys an autonomous companion drone that orbits and shoots approaching foes.',
    rarity: 'rare',
    iconName: 'Cpu',
    category: 'drone',
    maxStacks: 3,
    currentStacks: 0,
    apply: (player) => {
      // Handled in player / drone fleet logic
      player.damageMultiplier += 0.1;
    },
  },

  // EPIC
  {
    id: 'arc_lightning_unlock',
    title: 'Arc Lightning Coil',
    description: 'Unlocks chain-lightning weapon that shocks up to 5 connected targets simultaneously.',
    rarity: 'epic',
    iconName: 'ZapOff',
    category: 'weapon',
    maxStacks: 1,
    currentStacks: 0,
    apply: (_, weapons) => {
      const arc = weapons.get('arcLightning');
      if (arc) {
        arc.unlocked = true;
        arc.level = 1;
      }
    },
  },
  {
    id: 'micro_missiles_unlock',
    title: 'Micro-Missile Pods',
    description: 'Launches swarms of smart homing missiles that lock onto high-threat anomalies.',
    rarity: 'epic',
    iconName: 'Radio',
    category: 'weapon',
    maxStacks: 1,
    currentStacks: 0,
    apply: (_, weapons) => {
      const missile = weapons.get('microMissile');
      if (missile) {
        missile.unlocked = true;
        missile.level = 1;
      }
    },
  },
  {
    id: 'chrono_dilation',
    title: 'Temporal Stasis Dilation',
    description: 'Chrono Matrix slows enemies down to 10% speed (from 25%) and halves dash cooldown.',
    rarity: 'epic',
    iconName: 'Clock',
    category: 'chrono',
    maxStacks: 2,
    currentStacks: 0,
    apply: (player) => {
      player.chronoSlowFactor = 0.1;
      player.dashCooldown *= 0.65;
    },
  },
  {
    id: 'reactive_armor',
    title: 'Reactive Deflector Field',
    description: 'Takes 20% less damage from all sources and releases a defensive shockwave when hit.',
    rarity: 'epic',
    iconName: 'Layers',
    category: 'defense',
    maxStacks: 2,
    currentStacks: 0,
    apply: (player) => {
      player.armorPercent = Math.min(0.5, player.armorPercent + 0.2);
    },
  },

  // LEGENDARY
  {
    id: 'singularity_core',
    title: 'Quantum Singularity Core',
    description: 'Eliminations have a 15% chance to trigger mini-black holes that pull and crush enemies.',
    rarity: 'legendary',
    iconName: 'Sparkles',
    category: 'weapon',
    maxStacks: 1,
    currentStacks: 0,
    apply: (player) => {
      player.damageMultiplier += 0.35;
    },
  },
  {
    id: 'chrono_overdrive',
    title: 'Infinite Chrono Overdrive',
    description: 'Entering Chrono Mode grants 50% bonus fire rate and automatically recharges shields.',
    rarity: 'legendary',
    iconName: 'Flame',
    category: 'chrono',
    maxStacks: 1,
    currentStacks: 0,
    apply: (player) => {
      player.chronoRegenRate *= 1.5;
    },
  },
  {
    id: 'emp_shockwave_system',
    title: 'Omega EMP Detonator',
    description: 'Every 8 seconds, automatically releases a massive EMP pulse wiping incoming projectiles.',
    rarity: 'legendary',
    iconName: 'Sun',
    category: 'weapon',
    maxStacks: 1,
    currentStacks: 0,
    apply: (_, weapons) => {
      const emp = weapons.get('empWave');
      if (emp) {
        emp.unlocked = true;
        emp.level = 1;
      }
    },
  },
];

export function getRandomAugments(count: number, currentPool: Augment[]): Augment[] {
  const available = currentPool.filter((a) => a.currentStacks < a.maxStacks);
  if (available.length === 0) return [];

  // Weighted random selection based on rarity
  const rarityWeights = {
    common: 55,
    rare: 30,
    epic: 12,
    legendary: 3,
  };

  const selected: Augment[] = [];
  const cloned = [...available];

  for (let i = 0; i < count && cloned.length > 0; i++) {
    const totalWeight = cloned.reduce((sum, a) => sum + rarityWeights[a.rarity], 0);
    let rand = Math.random() * totalWeight;
    let chosenIdx = 0;

    for (let j = 0; j < cloned.length; j++) {
      rand -= rarityWeights[cloned[j].rarity];
      if (rand <= 0) {
        chosenIdx = j;
        break;
      }
    }

    selected.push(cloned[chosenIdx]);
    cloned.splice(chosenIdx, 1);
  }

  return selected;
}
