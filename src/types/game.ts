export type GameState = 'menu' | 'playing' | 'paused' | 'upgrade' | 'gameover';

export interface Vector2 {
  x: number;
  y: number;
}

export type WeaponType = 'plasma' | 'chronoBeam' | 'arcLightning' | 'microMissile' | 'empWave';

export interface WeaponStats {
  id: WeaponType;
  name: string;
  level: number;
  unlocked: boolean;
  damage: number;
  fireRate: number; // shots per second
  lastFired: number;
  projectileSpeed: number;
  color: string;
  range: number;
  pierce: number;
  spreadCount: number;
}

export type EnemyType =
  | 'swarmer'      // Small, fast, fragile
  | 'speeder'      // Zig-zag charging drone
  | 'sniper'       // Stays at distance, fires homing orbs
  | 'brute'        // Heavy armored, high health, slow
  | 'phantom'      // Teleports, stealth phases
  | 'splitter'     // Splits into 3 swarmers on destruction
  | 'boss_leviathan' // Multi-stage behemoth with bullet hell spirals
  | 'boss_nexus';    // Spawns shield orbs and gravitational pulls

export interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  color: string;
  glowColor: string;
  points: number;
  xpValue: number;
  angle: number;
  shootCooldown: number;
  lastShot: number;
  shield?: number;
  maxShield?: number;
  stateTimer: number;
  isBoss?: boolean;
  isElite?: boolean;
  bossPhase?: number;
  specialTimer?: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  color: string;
  glowColor: string;
  fromPlayer: boolean;
  weaponType: WeaponType;
  pierce: number;
  hitsLeft: number;
  life: number;
  maxLife: number;
  homingTarget?: Enemy;
  homingStrength?: number;
  trail: Vector2[];
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  decay: number;
  friction: number;
  gravity?: number;
  shape?: 'circle' | 'line' | 'square' | 'spark' | 'ring';
  length?: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  life: number;
  maxLife: number;
  isCrit?: boolean;
}

export type DropType = 'xp' | 'health' | 'shield' | 'chronoBattery' | 'overdrive';

export interface DropItem {
  id: string;
  type: DropType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  value: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface Drone {
  id: string;
  type: 'attack' | 'shield' | 'repair';
  orbitAngle: number;
  orbitDistance: number;
  orbitSpeed: number;
  fireCooldown: number;
  lastFired: number;
  level: number;
}

export type AugmentRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Augment {
  id: string;
  title: string;
  description: string;
  rarity: AugmentRarity;
  iconName: string;
  category: 'weapon' | 'defense' | 'chrono' | 'drone' | 'utility';
  apply: (player: PlayerStats, weapons: Map<WeaponType, WeaponStats>) => void;
  maxStacks: number;
  currentStacks: number;
}

export interface PlayerStats {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  speed: number;
  maxSpeed: number;
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  shieldRegenRate: number; // shield per second
  shieldRegenDelay: number; // delay after hit
  lastHitTime: number;
  
  // Chrono Energy (Bullet-Time)
  chronoEnergy: number;
  maxChronoEnergy: number;
  chronoRegenRate: number;
  isChronoActive: boolean;
  chronoSlowFactor: number; // 0.2 means enemies move at 20% speed
  
  // Dash / Quantum Blink
  dashCooldown: number;
  lastDashTime: number;
  dashDuration: number;
  isDashing: boolean;
  dashSpeedMultiplier: number;
  
  // Progression
  level: number;
  xp: number;
  nextLevelXp: number;
  score: number;
  combo: number;
  comboTimer: number;
  maxCombo: number;
  
  // Multipliers
  damageMultiplier: number;
  fireRateMultiplier: number;
  critChance: number;
  critMultiplier: number;
  pickupMagnetRadius: number;
  
  // Defense / Special
  armorPercent: number; // 0.0 - 0.5
  hpRegenRate: number;
  overdriveTimer: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  wave: number;
  timeSurvived: number; // in seconds
  enemiesKilled: number;
  bossesDefeated: number;
  damageDealt: number;
  damageTaken: number;
  chronoTimeUsed: number;
  highestCombo: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  check: (stats: GameStats, player: PlayerStats) => boolean;
}
