export type Language = 'az' | 'en' | 'tr';

export interface TranslationDictionary {
  // Common / General
  langName: string;

  // Main Menu
  systemIntegrity: string;
  gameTitle: string;
  gameSubtitle: string;
  deploySentinel: string;
  tacticalArchive: string;
  soundMuted: string;
  soundActive: string;
  allTimeRecord: string;
  operationalControls: string;
  ctrlMove: string;
  ctrlAim: string;
  ctrlChrono: string;
  ctrlDash: string;
  kernelVersion: string;
  chronoRestraint: string;

  // HUD
  hpLabel: string;
  shieldLabel: string;
  chronoLabel: string;
  sectorWave: string;
  currentScore: string;
  highScorePrefix: string;
  comboLabel: string;
  pauseBtn: string;
  lvlPrefix: string;
  xpLabel: string;
  chronoBtnAction: string;
  dashBtnAction: string;
  bossWarning: string;

  // Upgrades Modal
  levelElevation: string;
  selectAugment: string;
  augmentDesc: string;
  rarityCommon: string;
  rarityRare: string;
  rarityEpic: string;
  rarityLegendary: string;
  stackPrefix: string;
  installBtn: string;

  // Pause Modal
  systemSuspended: string;
  chronoStasisActive: string;
  audioConfig: string;
  masterAudio: string;
  audioEnabled: string;
  audioMuted: string;
  sfxSynth: string;
  musicMatrix: string;
  languageSelect: string;
  resumeBtn: string;
  restartBtn: string;
  abortToMenu: string;

  // Game Over Modal
  coreCompromised: string;
  sentinelShutdown: string;
  newRecordEstablished: string;
  finalScore: string;
  waveReached: string;
  survivalDuration: string;
  anomaliesPurged: string;
  bossesDefeated: string;
  maxCombo: string;
  totalDamage: string;
  chronoUtilization: string;
  rebootSentinel: string;
  returnToArchive: string;

  // Achievements Modal
  archivedMilestones: string;
  tacticalAchievements: string;
  progressLabel: string;
  unlockedBadge: string;
  completedBadge: string;
  returnToReady: string;

  // Augments Dictionary (id -> { title, description })
  augments: Record<string, { title: string; description: string }>;

  // Achievements Dictionary (id -> { title, description })
  achievements: Record<string, { title: string; description: string }>;
}

export const translations: Record<Language, TranslationDictionary> = {
  az: {
    langName: 'Azərbaycan',

    // Main Menu
    systemIntegrity: 'SİSTEM BÜTÖVLÜYÜ: 14% // ANOMALİYA AŞKARLANDI',
    gameTitle: 'NEON CYBER-GRID',
    gameSubtitle: 'XRONO DEFENDER PROTOKOLU',
    deploySentinel: 'SENTİNELİ DÖYÜŞƏ GÖNDƏR',
    tacticalArchive: 'TAKTAKİ ARXİV (NAİLİYYƏTLƏR)',
    soundMuted: 'SƏS: SƏSSİZ',
    soundActive: 'SƏS: AKTİV',
    allTimeRecord: 'BÜTÜN ZAMANLARIN REKORDU',
    operationalControls: 'DÖYÜŞ İDARƏETMƏSİ',
    ctrlMove: 'Sentineli İdarə Et',
    ctrlAim: 'Avtomatik Nişan və Atəş',
    ctrlChrono: 'Xrono Matris (Zamanı Yavaşlat)',
    ctrlDash: 'Kvant Sıçrayışı (Qorunma)',
    kernelVersion: 'KVANT NÜVƏSİ v2.4.0',
    chronoRestraint: 'ZAMAN NƏZARƏTİ: AKTİV',

    // HUD
    hpLabel: 'HP (CAN)',
    shieldLabel: 'QALXAN',
    chronoLabel: 'XRONO MATRİS',
    sectorWave: 'SEKTOR / DALĞA',
    currentScore: 'CARİ XAL',
    highScorePrefix: 'REKORD',
    comboLabel: 'KOMBO',
    pauseBtn: 'FASİLƏ',
    lvlPrefix: 'SƏVİYYƏ',
    xpLabel: 'TƏCRÜBƏ',
    chronoBtnAction: 'XRONO [SPACE]',
    dashBtnAction: 'SIÇRAYIŞ [SHIFT]',
    bossWarning: '⚠️ QATİL SÜNİ İNTELLEKT BOSS AŞKAR EDİLDİ',

    // Upgrades Modal
    levelElevation: 'SENTİNEL SƏVİYYƏ ARTIRILMASI',
    selectAugment: 'TAKTİKİ TƏKMİLLƏŞDİRMƏ SEÇİN',
    augmentDesc: 'Qarşısıalınmaz anomaliya dalğalarını dəf etmək üçün sistem altproqramlarını gücləndirin.',
    rarityCommon: 'ADİ',
    rarityRare: 'NADİR',
    rarityEpic: 'EPİK',
    rarityLegendary: 'ƏFSANƏVİ',
    stackPrefix: 'SƏVİYYƏ',
    installBtn: 'QURAŞDIR',

    // Pause Modal
    systemSuspended: 'SİSTEM DAYANDIRILDI',
    chronoStasisActive: 'XRONO STASİS AKTİVDİR',
    audioConfig: 'AUDİO VƏ DİL TƏNZİMLƏMƏLƏRİ',
    masterAudio: 'ƏSAS SƏS',
    audioEnabled: 'AKTİV',
    audioMuted: 'SƏSSİZ',
    sfxSynth: 'SƏS EFFEKTLƏRİ (SFX)',
    musicMatrix: 'FON MUSİQİSİ',
    languageSelect: 'İNTERFEYS DİLİ',
    resumeBtn: 'ƏMƏLİYYATI DAVAM ETDİR [P]',
    restartBtn: 'MİSSİYANI YENİDƏN BAŞLAT',
    abortToMenu: 'ƏSAS MENYUYA QAYIT',

    // Game Over Modal
    coreCompromised: 'NÜVƏ ƏLƏ KEÇİRİLDİ',
    sentinelShutdown: 'SENTİNEL SÖNDÜRÜLDÜ // MAİNFRAME DAĞIDILDI',
    newRecordEstablished: 'TƏBRİKLƏR! YENİ BÜTÜN ZAMANLARIN REKORDU!',
    finalScore: 'YEKUN NƏTİCƏ',
    waveReached: 'ÇATILAN SEKTOR',
    survivalDuration: 'SAĞ QALMA MÜDDƏTİ',
    anomaliesPurged: 'MƏHV EDİLƏN ANOMALİYALAR',
    bossesDefeated: 'MƏĞLUB EDİLƏN BOSSLAR',
    maxCombo: 'MAKSİMUM KOMBO',
    totalDamage: 'ÜMUMİ VURULAN ZƏRBƏ',
    chronoUtilization: 'ZAMANIN YAVAŞLADILMASI',
    rebootSentinel: 'SENTİNELİ YENİDƏN BAŞLAT',
    returnToArchive: 'ARXİVƏ QAYIT',

    // Achievements Modal
    archivedMilestones: 'ƏLDƏ EDİLMİŞ UĞURLAR',
    tacticalAchievements: 'TAKTİKİ NAİLİYYƏTLƏR',
    progressLabel: 'TƏRƏQQİ:',
    unlockedBadge: 'AÇILDI',
    completedBadge: 'TAMAMLANDI',
    returnToReady: 'DÖYÜŞ REJİMİNƏ QAYIT',

    // Augments
    augments: {
      overclock_reactor: {
        title: 'Overklok Reaktoru',
        description: 'Bütün əsas və köməkçi silahlar üçün +15% atəş tezliyi.',
      },
      nanite_hull: {
        title: 'Nanit Zireh Lövhələri',
        description: '+25 Maksimum Can verir və dərhal 25 HP bərpa edir.',
      },
      kinetic_booster: {
        title: 'Kinetik Mühərriklər',
        description: '+12% Hərəkət Sürəti və +10% Sıçrayış Məsafəsi.',
      },
      magnetic_extractor: {
        title: 'Maqnit Yığıcısı',
        description: 'Təcrübə, qalxan və gücləndiricilər üçün +40% cəlbetmə radiusu.',
      },
      energy_capacitor: {
        title: 'Xrono Kondensator',
        description: '+25 Maksimum Xrono Enerjisi və +15% enerji bərpa sürəti.',
      },
      piercing_plasma: {
        title: 'Yüksək Sıxlıqlı Nüvə',
        description: 'Plazma atəşləri əlavə +1 düşməni deşib keçir və +20% zərər vurur.',
      },
      chrono_beam_unlock: {
        title: 'Xrono Şüa Protokolu',
        description: 'Şəbəkə boyunca bütün hədəfləri deşib keçən güclü lazer şüasını aktivləşdirir.',
      },
      shield_matrix: {
        title: 'Faza Qalxan Matrisi',
        description: '+30 Maksimum Qalxan və zərbədən sonra bərpa gecikməsinin 30% azalması.',
      },
      quantum_crit: {
        title: 'Dəqiq Nişanalma Subproqramı',
        description: '+12% Kritik Zərbə Ehtimalı və +40% Kritik Zərbə Gücü.',
      },
      attack_drone: {
        title: 'Mühafizəçi Dron Bloku',
        description: 'Sentinel ətrafında dövrə vuran və yaxınlaşan düşmənləri vuran köməkçi dron.',
      },
      arc_lightning_unlock: {
        title: 'Qövs İldırımı Sarğısı',
        description: 'Eyni vaxtda 5 əlaqəli hədəfi cərəyanla vuran zəncirvari elektrik silahı.',
      },
      micro_missiles_unlock: {
        title: 'Mikro-Raket Qüllələri',
        description: 'Təhlükəli hədəflərə kilidlənən özütuşlanan ağıllı mikro-raketlər buraxır.',
      },
      chrono_dilation: {
        title: 'Zaman Dilatasiyası',
        description: 'Xrono Matris düşmənləri 10% sürətə qədər yavaşladır və sıçrayışın bərpasını yarıya endirir.',
      },
      reactive_armor: {
        title: 'Reaktiv Deflektor Qalxanı',
        description: 'Bütün mənbələrdən 20% az zərər alır və vurulduqda müdafiə şok dalğası yaradır.',
      },
      singularity_core: {
        title: 'Kvant Sinqulyarlıq Nüvəsi',
        description: 'Məhv edilən hər düşməndən 15% ehtimalla ətrafdakıları sovuran mini-qara dəlik yaranır.',
      },
      chrono_overdrive: {
        title: 'Sonsuz Xrono Overdrive',
        description: 'Xrono rejiminə daxil olduqda +50% atəş tezliyi verir və qalxanı bərpa edir.',
      },
      emp_shockwave_system: {
        title: 'Omeqa EMP Detonatoru',
        description: 'Hər 8 saniyədən bir düşmən mərmilərini silən və zərər vuran nəhəng EMP dalğası buraxır.',
      },
    },

    // Achievements
    achievements: {
      first_blood: {
        title: 'Sistem Təmizləyicisi',
        description: 'İlk yoluxmuş anomal virusu zərərsizləşdirin.',
      },
      wave_survivor_5: {
        title: 'Firewall Müdafiəçisi',
        description: '5-ci dalğadan sağ çıxın və nəhəng Leviathan Bossunu məğlub edin.',
      },
      chrono_master: {
        title: 'Zamanın Hökmdarı',
        description: 'Xrono rejimində cəmi 30 saniyədən çox vaxt keçirin.',
      },
      combo_king: {
        title: 'İti Reflekslər',
        description: 'Döyüşdə ardıcıl 50x kombo çarpanına çatın.',
      },
      damage_dealer: {
        title: 'Kiber Qiyamət',
        description: 'Əməliyyatlar boyu cəmi 100.000-dən çox zərbə endirin.',
      },
      high_scorer: {
        title: 'Elit Sentinel',
        description: 'Tək bir döyüşdə 50.000-dən çox xal toplayın.',
      },
    },
  },

  en: {
    langName: 'English',

    // Main Menu
    systemIntegrity: 'SYSTEM INTEGRITY: 14% // ANOMALY DETECTED',
    gameTitle: 'NEON CYBER-GRID',
    gameSubtitle: 'CHRONO DEFENDER PROTOCOL',
    deploySentinel: 'DEPLOY SENTINEL',
    tacticalArchive: 'TACTICAL ARCHIVE (ACHIEVEMENTS)',
    soundMuted: 'SOUND: MUTED',
    soundActive: 'SOUND: ACTIVE',
    allTimeRecord: 'ALL-TIME RECORD PURGE',
    operationalControls: 'OPERATIONAL CONTROLS',
    ctrlMove: 'Maneuver Sentinel',
    ctrlAim: 'Auto-Target & Fire',
    ctrlChrono: 'Chrono Matrix (Bullet-Time)',
    ctrlDash: 'Quantum Blink Dash (Invulnerability)',
    kernelVersion: 'QUANTUM KERNEL v2.4.0',
    chronoRestraint: 'CHRONO RESTRAINT: ACTIVE',

    // HUD
    hpLabel: 'HP (HEALTH)',
    shieldLabel: 'SHIELD',
    chronoLabel: 'CHRONO MATRIX',
    sectorWave: 'SECTOR / WAVE',
    currentScore: 'CURRENT SCORE',
    highScorePrefix: 'HI',
    comboLabel: 'COMBO',
    pauseBtn: 'PAUSE',
    lvlPrefix: 'LVL',
    xpLabel: 'XP',
    chronoBtnAction: 'CHRONO [SPACE]',
    dashBtnAction: 'BLINK [SHIFT]',
    bossWarning: '⚠️ ROGUE AI OVERLORD DETECTED',

    // Upgrades Modal
    levelElevation: 'SENTINEL LEVEL ELEVATION',
    selectAugment: 'SELECT TACTICAL AUGMENT',
    augmentDesc: 'Enhance mainframe subroutines to overcome escalated corruption waves.',
    rarityCommon: 'COMMON',
    rarityRare: 'RARE',
    rarityEpic: 'EPIC',
    rarityLegendary: 'LEGENDARY',
    stackPrefix: 'STACK',
    installBtn: 'INSTALL',

    // Pause Modal
    systemSuspended: 'SYSTEM SUSPENDED',
    chronoStasisActive: 'CHRONO STASIS ACTIVE',
    audioConfig: 'AUDIO & LANGUAGE CONFIGURATION',
    masterAudio: 'MASTER AUDIO',
    audioEnabled: 'ENABLED',
    audioMuted: 'MUTED',
    sfxSynth: 'SFX SYNTHESIZER',
    musicMatrix: 'MUSIC MATRIX',
    languageSelect: 'INTERFACE LANGUAGE',
    resumeBtn: 'RESUME OPERATION [P]',
    restartBtn: 'RESTART DEPLOYMENT',
    abortToMenu: 'ABORT TO MAIN MENU',

    // Game Over Modal
    coreCompromised: 'CORE COMPROMISED',
    sentinelShutdown: 'SENTINEL SHUTDOWN // MAINFRAME OVERRUN',
    newRecordEstablished: 'NEW ALL-TIME RECORD ESTABLISHED!',
    finalScore: 'FINAL PURGE SCORE',
    waveReached: 'WAVE REACHED',
    survivalDuration: 'SURVIVAL DURATION',
    anomaliesPurged: 'ANOMALIES PURGED',
    bossesDefeated: 'BOSS OVERLORDS DEFEATED',
    maxCombo: 'MAX COMBAT COMBO',
    totalDamage: 'TOTAL DAMAGE OUTPUT',
    chronoUtilization: 'CHRONO MATRIX UTILIZATION',
    rebootSentinel: 'REBOOT SENTINEL',
    returnToArchive: 'RETURN TO ARCHIVE',

    // Achievements Modal
    archivedMilestones: 'ARCHIVED MILESTONES',
    tacticalAchievements: 'TACTICAL ACHIEVEMENTS',
    progressLabel: 'PROGRESS:',
    unlockedBadge: 'UNLOCKED',
    completedBadge: 'COMPLETED',
    returnToReady: 'RETURN TO OPERATIONAL READY',

    // Augments
    augments: {
      overclock_reactor: {
        title: 'Overclock Reactor',
        description: '+15% Fire Rate for all primary and secondary weapons.',
      },
      nanite_hull: {
        title: 'Nanite Hull Plating',
        description: '+25 Max Health and heals 25 HP immediately.',
      },
      kinetic_booster: {
        title: 'Kinetic Thrusters',
        description: '+12% Movement Speed and +10% Dash Distance.',
      },
      magnetic_extractor: {
        title: 'Magnetic Harvester',
        description: '+40% Pickup Radius for XP, Shields, and Power-ups.',
      },
      energy_capacitor: {
        title: 'Chrono Capacitor',
        description: '+25 Max Chrono Energy & +15% Energy Recharge Rate.',
      },
      piercing_plasma: {
        title: 'High-Density Cores',
        description: 'Primary Plasma shots pierce +1 additional enemy and deal +20% damage.',
      },
      chrono_beam_unlock: {
        title: 'Chrono Beam Protocol',
        description: 'Unlocks a piercing high-energy laser beam that sweeps across the grid.',
      },
      shield_matrix: {
        title: 'Phase Shield Matrix',
        description: '+30 Max Shield and shield begins regenerating 30% sooner after taking hit.',
      },
      quantum_crit: {
        title: 'Precision Targeting Subroutine',
        description: '+12% Critical Strike Chance and +40% Critical Strike Damage.',
      },
      attack_drone: {
        title: 'Guardian Drone Unit',
        description: 'Deploys an autonomous companion drone that orbits and shoots approaching foes.',
      },
      arc_lightning_unlock: {
        title: 'Arc Lightning Coil',
        description: 'Unlocks chain-lightning weapon that shocks up to 5 connected targets simultaneously.',
      },
      micro_missiles_unlock: {
        title: 'Micro-Missile Pods',
        description: 'Launches swarms of smart homing missiles that lock onto high-threat anomalies.',
      },
      chrono_dilation: {
        title: 'Temporal Stasis Dilation',
        description: 'Chrono Matrix slows enemies down to 10% speed (from 25%) and halves dash cooldown.',
      },
      reactive_armor: {
        title: 'Reactive Deflector Field',
        description: 'Takes 20% less damage from all sources and releases a defensive shockwave when hit.',
      },
      singularity_core: {
        title: 'Quantum Singularity Core',
        description: 'Eliminations have a 15% chance to trigger mini-black holes that pull and crush enemies.',
      },
      chrono_overdrive: {
        title: 'Infinite Chrono Overdrive',
        description: 'Entering Chrono Mode grants 50% bonus fire rate and automatically recharges shields.',
      },
      emp_shockwave_system: {
        title: 'Omega EMP Detonator',
        description: 'Every 8 seconds, automatically releases a massive EMP pulse wiping incoming projectiles.',
      },
    },

    // Achievements
    achievements: {
      first_blood: {
        title: 'System Purifier',
        description: 'Neutralize your first corrupted anomaly.',
      },
      wave_survivor_5: {
        title: 'Firewall Defender',
        description: 'Survive past Wave 5 and defeat the Leviathan Boss.',
      },
      chrono_master: {
        title: 'Time Lord',
        description: 'Spend more than 30 total seconds in Chrono Bullet-Time.',
      },
      combo_king: {
        title: 'Overclocked Reflexes',
        description: 'Reach a continuous combat combo multiplier of 50x.',
      },
      damage_dealer: {
        title: 'Cyber Cataclysm',
        description: 'Deal over 100,000 total damage across your operations.',
      },
      high_scorer: {
        title: 'Elite Sentinel',
        description: 'Score over 50,000 points in a single deployment.',
      },
    },
  },

  tr: {
    langName: 'Türkçe',

    // Main Menu
    systemIntegrity: 'SİSTEM BÜTÜNLÜĞÜ: %14 // ANOMALİ TESPİT EDİLDİ',
    gameTitle: 'NEON CYBER-GRID',
    gameSubtitle: 'KRONO SAVUNUCU PROTOKOLÜ',
    deploySentinel: 'SAVUNUCUYU GÖREVE GÖNDER',
    tacticalArchive: 'TAKTİK ARŞİV (BAŞARILAR)',
    soundMuted: 'SES: SESSIZ',
    soundActive: 'SES: AKTİF',
    allTimeRecord: 'TÜM ZAMANLARIN REKORU',
    operationalControls: 'OPERASYONEL KONTROLLER',
    ctrlMove: 'Savunucuyu Yönet',
    ctrlAim: 'Otomatik Hedef ve Ateş',
    ctrlChrono: 'Krono Matris (Zamanı Yavaşlat)',
    ctrlDash: 'Kuantum Atılım (Dokunulmazlık)',
    kernelVersion: 'KUANTUM ÇEKİRDEĞİ v2.4.0',
    chronoRestraint: 'ZAMAN KONTROLÜ: AKTİF',

    // HUD
    hpLabel: 'CAN (HP)',
    shieldLabel: 'KALKAN',
    chronoLabel: 'KRONO MATRİS',
    sectorWave: 'SEKTÖR / DALGA',
    currentScore: 'GÜNCEL PUAN',
    highScorePrefix: 'REKOR',
    comboLabel: 'KOMBO',
    pauseBtn: 'DURAKLAT',
    lvlPrefix: 'SEVİYE',
    xpLabel: 'TP',
    chronoBtnAction: 'KRONO [SPACE]',
    dashBtnAction: 'ATILIM [SHIFT]',
    bossWarning: '⚠️ BOZUK YAPAY ZEKA PATRONU TESPİT EDİLDİ',

    // Upgrades Modal
    levelElevation: 'SAVUNUCU SEVİYE YÜKSELTMESİ',
    selectAugment: 'TAKTİK TAKVİYE SEÇİN',
    augmentDesc: 'Şiddetlenen anomali dalgalarını alt etmek için sistem alt rutinlerini güçlendirin.',
    rarityCommon: 'YAYGIN',
    rarityRare: 'NADİR',
    rarityEpic: 'EPİK',
    rarityLegendary: 'EFSANEVİ',
    stackPrefix: 'KADEME',
    installBtn: 'YÜKLE',

    // Pause Modal
    systemSuspended: 'SİSTEM ASKIYA ALINDI',
    chronoStasisActive: 'KRONO HAREKETSİZLİK AKTİF',
    audioConfig: 'SES VE DİL AYARLARI',
    masterAudio: 'ANA SES',
    audioEnabled: 'AÇIK',
    audioMuted: 'KAPALI',
    sfxSynth: 'SES EFEKTLERİ (SFX)',
    musicMatrix: 'MÜZİK MATRİSİ',
    languageSelect: 'ARAYÜZ DİLİ',
    resumeBtn: 'GÖREVE DEVAM ET [P]',
    restartBtn: 'GÖREVİ YENİDEN BAŞLAT',
    abortToMenu: 'ANA MENÜYE DÖN',

    // Game Over Modal
    coreCompromised: 'ÇEKİRDEK ÇÖKTÜ',
    sentinelShutdown: 'SAVUNUCU KAPANDI // SİSTEM İSTİLA EDİLDİ',
    newRecordEstablished: 'TEBRİKLER! YENİ TÜM ZAMANLAR REKORU!',
    finalScore: 'SONUÇ PUANI',
    waveReached: 'ULAŞILAN SEKTÖR',
    survivalDuration: 'HAYATTA KALMA SÜRESİ',
    anomaliesPurged: 'TEMİZLENEN ANOMALİLER',
    bossesDefeated: 'YENİLEN PATRONLAR',
    maxCombo: 'EN YÜKSEK KOMBO',
    totalDamage: 'TOPLAM VERİLEN HASAR',
    chronoUtilization: 'ZAMAN YAVAŞLATMA KULLANIMI',
    rebootSentinel: 'SAVUNUCUYU YENİDEN BAŞLAT',
    returnToArchive: 'ARŞİVE DÖN',

    // Achievements Modal
    archivedMilestones: 'ARŞİVLENMİŞ DÖNÜM NOKTALARI',
    tacticalAchievements: 'TAKTİK BAŞARILAR',
    progressLabel: 'İLERLEME:',
    unlockedBadge: 'AÇILDI',
    completedBadge: 'TAMAMLANDI',
    returnToReady: 'GÖREV DÜZENİNE DÖN',

    // Augments
    augments: {
      overclock_reactor: {
        title: 'Hız Aşırtma Reaktörü',
        description: 'Tüm birincil ve ikincil silahlar için +%15 Atış Hızı.',
      },
      nanite_hull: {
        title: 'Nanit Gövde Zırhı',
        description: '+25 Maksimum Can ve anında 25 Can yenileme.',
      },
      kinetic_booster: {
        title: 'Kinetik İticiler',
        description: '+%12 Hareket Hızı ve +%10 Atılım Mesafesi.',
      },
      magnetic_extractor: {
        title: 'Manyetik Toplayıcı',
        description: 'TP, Kalkan ve Güçlendiriciler için +%40 Çekim Yarıçapı.',
      },
      energy_capacitor: {
        title: 'Krono Kondansatör',
        description: '+25 Maksimum Krono Enerjisi ve +%15 Enerji Yenilenme Hızı.',
      },
      piercing_plasma: {
        title: 'Yüksek Yoğunluklu Çekirdek',
        description: 'Plazma atışları +1 fazladan düşmanı delip geçer ve +%20 hasar verir.',
      },
      chrono_beam_unlock: {
        title: 'Krono Işın Protokolü',
        description: 'Izgara boyunca tüm hedefleri delip geçen yüksek enerjili lazer ışınını açar.',
      },
      shield_matrix: {
        title: 'Faz Kalkanı Matrisi',
        description: '+30 Maksimum Kalkan ve darbe sonrası kalkan dolum beklemesinde %30 kısalma.',
      },
      quantum_crit: {
        title: 'Hassas Nişanlama Rutini',
        description: '+%12 Kritik Vuruş Şansı ve +%40 Kritik Vuruş Hasarı.',
      },
      attack_drone: {
        title: 'Muhafız Dron Birimi',
        description: 'Etrafınızda dönen ve yaklaşan düşmanlara ateş eden otonom refakatçi dron.',
      },
      arc_lightning_unlock: {
        title: 'Ark Yıldırımı Bobini',
        description: 'Aynı anda 5 bağlı hedefe elektrik sıçratan zincirleme yıldırım silahını açar.',
      },
      micro_missiles_unlock: {
        title: 'Mikro-Füze Yuvaları',
        description: 'Yüksek tehditli hedeflere kilitlenen akıllı güdümlü mikro-füzeler fırlatır.',
      },
      chrono_dilation: {
        title: 'Zamansal Durgunluk Genişlemesi',
        description: 'Krono Matris düşmanları %10 hıza kadar yavaşlatır ve atılım bekleme süresini yarılar.',
      },
      reactive_armor: {
        title: 'Reaktif Saptırıcı Alan',
        description: 'Tüm kaynaklardan %20 daha az hasar alır ve vurulduğunda savunma şok dalgası yayar.',
      },
      singularity_core: {
        title: 'Kuantum Tekillik Çekirdeği',
        description: 'İmha edilen düşmanlardan %15 ihtimalle yakındakileri ezen mini-kara delik doğar.',
      },
      chrono_overdrive: {
        title: 'Sonsuz Krono Aşırı Yükleme',
        description: 'Krono Moduna girildiğinde +%50 atış hızı sağlar ve kalkanı doldurur.',
      },
      emp_shockwave_system: {
        title: 'Omega EMP Detonatörü',
        description: 'Her 8 saniyede bir düşman mermilerini yok eden devasa bir EMP şok dalgası salar.',
      },
    },

    // Achievements
    achievements: {
      first_blood: {
        title: 'Sistem Temizleyicisi',
        description: 'İlk bozuk virüs anomalisini etkisiz hale getirin.',
      },
      wave_survivor_5: {
        title: 'Güvenlik Duvarı Savunucusu',
        description: '5. Dalgayı geçin ve devasa Leviathan Patronunu alt edin.',
      },
      chrono_master: {
        title: 'Zaman Lordu',
        description: 'Krono modunda toplamda 30 saniyeden fazla zaman geçirin.',
      },
      combo_king: {
        title: 'Yüksek Refleksler',
        description: 'Savaşta kesintisiz 50x kombo çarpanına ulaşın.',
      },
      damage_dealer: {
        title: 'Siber Kıyamet',
        description: 'Operasyonlar boyunca toplamda 100.000\'den fazla hasar verin.',
      },
      high_scorer: {
        title: 'Seçkin Savunucu',
        description: 'Tek bir konuşlandırmada 50.000\'den fazla puan toplayın.',
      },
    },
  },
};
