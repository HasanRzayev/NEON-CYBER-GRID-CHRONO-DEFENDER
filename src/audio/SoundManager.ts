export class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  
  private isMuted: boolean = false;
  private sfxVolume: number = 0.5;
  private musicVolume: number = 0.3;
  private isMusicPlaying: boolean = false;
  private musicInterval: number | null = null;
  private step: number = 0;

  constructor() {
    const savedMute = localStorage.getItem('chrono_muted');
    if (savedMute !== null) this.isMuted = savedMute === 'true';
    
    const savedSfx = localStorage.getItem('chrono_sfx_vol');
    if (savedSfx !== null) this.sfxVolume = parseFloat(savedSfx);

    const savedMusic = localStorage.getItem('chrono_music_vol');
    if (savedMusic !== null) this.musicVolume = parseFloat(savedMusic);
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();

      this.masterGain.gain.value = this.isMuted ? 0 : 1;
      this.sfxGain.gain.value = this.sfxVolume;
      this.musicGain.gain.value = this.musicVolume;

      this.sfxGain.connect(this.masterGain);
      this.musicGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('chrono_muted', String(muted));
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 1;
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('chrono_sfx_vol', String(this.sfxVolume));
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.sfxVolume;
    }
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('chrono_music_vol', String(this.musicVolume));
    if (this.musicGain) {
      this.musicGain.gain.value = this.musicVolume;
    }
  }

  // Laser / Shoot Sound
  public playShoot(weapon: string = 'plasma') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (weapon === 'chronoBeam') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (weapon === 'arcLightning') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.setValueAtTime(800, now + 0.04);
      osc.frequency.setValueAtTime(1400, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (weapon === 'microMissile') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.12);
    } else {
      // Default Plasma
      osc.type = 'square';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  }

  // Explosion with noise and sub-bass
  public playExplosion(isLarge = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const duration = isLarge ? 0.45 : 0.22;

    // Sub-bass thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(isLarge ? 180 : 120, now);
    subOsc.frequency.exponentialRampToValueAtTime(25, now + duration);

    subGain.gain.setValueAtTime(isLarge ? 0.4 : 0.25, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(now);
    subOsc.stop(now + duration);

    // Noise burst
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isLarge ? 1200 : 800, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + duration);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(isLarge ? 0.3 : 0.18, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);
  }

  // Chrono Time Distortion Warp
  public playChronoEnter() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.35);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playChronoExit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.25);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Quantum Dash Sound
  public playDash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  // Pickup Item
  public playPickup(type: string = 'xp') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    if (type === 'health' || type === 'shield') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(660, now + 0.06);
      osc.frequency.setValueAtTime(880, now + 0.12);
    } else if (type === 'overdrive') {
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
    } else {
      // XP
      osc.frequency.setValueAtTime(700 + Math.random() * 200, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.07);
    }

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Level Up Fanfare
  public playLevelUp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.25);
    });
  }

  // Boss Siren Warning
  public playBossWarning() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    for (let i = 0; i < 2; i++) {
      const now = this.ctx.currentTime + i * 0.35;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(520, now + 0.15);
      osc.frequency.linearRampToValueAtTime(260, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.32);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.32);
    }
  }

  // Dynamic Cyberpunk Procedural Music Synthesizer
  public startMusic() {
    if (this.isMusicPlaying) return;
    this.initContext();
    this.isMusicPlaying = true;
    this.step = 0;

    const bassScale = [110, 110, 130.81, 146.83, 110, 110, 164.81, 146.83]; // A2, C3, D3, E3
    const leadScale = [440, 523.25, 587.33, 659.25, 783.99, 880];

    const tempoMs = 125; // ~120 BPM 16th notes
    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      const stepIdx = this.step % 16;

      // Bassline on 8th notes
      if (stepIdx % 2 === 0) {
        const bassNote = bassScale[(this.step >> 1) % bassScale.length];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(bassNote / 2, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.18);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + 0.18);
      }

      // Arpeggiator lead on selected 16ths
      if (stepIdx % 2 === 1 && Math.random() > 0.3) {
        const leadNote = leadScale[Math.floor(Math.random() * leadScale.length)];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(leadNote, now);

        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.09);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + 0.09);
      }

      // Cyber Kick / Hi-hat pulse
      if (stepIdx % 4 === 0) {
        // Kick
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(120, now);
        kickOsc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

        kickGain.gain.setValueAtTime(0.22, now);
        kickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        kickOsc.connect(kickGain);
        kickGain.connect(this.musicGain);
        kickOsc.start(now);
        kickOsc.stop(now + 0.08);
      } else if (stepIdx % 2 === 1) {
        // Hihat
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.02);
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

        const hatSource = this.ctx.createBufferSource();
        hatSource.buffer = noiseBuffer;

        const hatFilter = this.ctx.createBiquadFilter();
        hatFilter.type = 'highpass';
        hatFilter.frequency.setValueAtTime(7000, now);

        const hatGain = this.ctx.createGain();
        hatGain.gain.setValueAtTime(0.03, now);
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        hatSource.connect(hatFilter);
        hatFilter.connect(hatGain);
        hatGain.connect(this.musicGain);

        hatSource.start(now);
        hatSource.stop(now + 0.02);
      }

      this.step++;
    }, tempoMs);
  }

  public stopMusic() {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isMusicPlaying = false;
  }
}

export const soundManager = new SoundManager();
