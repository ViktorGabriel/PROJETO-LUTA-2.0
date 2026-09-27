/* ============================================================
   RPG BATTLE ARENA - ENGINE, CLASSES E SISTEMA DE BOSS (POO ES6)
   ============================================================ */

// ------------------------------------------------------------
// 1. GERADOR DE EFEITOS SONOROS NATIVOS (Web Audio API)
// ------------------------------------------------------------
const soundFx = {
    ctx: null,
    muted: false,

    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    },

    playSlash() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(340, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.13);
    },

    playArrow() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(700, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.16);
    },

    playMagic() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.04);
            gain.gain.setValueAtTime(0.18, now + idx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.04);
            osc.stop(now + idx * 0.04 + 0.26);
        });
    },

    playHoly() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [587.33, 739.99, 880.00, 1174.66].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);
            gain.gain.setValueAtTime(0.2, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.05 + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.36);
        });
    },

    playRoar() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(140, this.ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.42);
    },

    playBossAlert() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [150, 120, 90].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);
            gain.gain.setValueAtTime(0.3, now + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 0.22);
        });
    },

    playHit() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.18);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.19);
    },

    playCrit() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.linearRampToValueAtTime(900, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.3);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.32);
    },

    playHeal() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);
            gain.gain.setValueAtTime(0.15, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.07 + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.32);
        });
    },

    playDefend() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.26);
    },

    playVictory() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const fanfare = [
            { f: 523.25, t: 0.0, d: 0.15 },
            { f: 659.25, t: 0.16, d: 0.15 },
            { f: 783.99, t: 0.32, d: 0.15 },
            { f: 1046.50, t: 0.48, d: 0.45 }
        ];

        fanfare.forEach(item => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(item.f, now + item.t);
            gain.gain.setValueAtTime(0.3, now + item.t);
            gain.gain.exponentialRampToValueAtTime(0.005, now + item.t + item.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + item.t);
            osc.stop(now + item.t + item.d + 0.05);
        });
    },

    playDefeat() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [
            { f: 392.00, t: 0.0, d: 0.2 },
            { f: 369.99, t: 0.22, d: 0.2 },
            { f: 329.63, t: 0.44, d: 0.4 }
        ];

        notes.forEach(item => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(item.f, now + item.t);
            gain.gain.setValueAtTime(0.2, now + item.t);
            gain.gain.exponentialRampToValueAtTime(0.005, now + item.t + item.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + item.t);
            osc.stop(now + item.t + item.d + 0.05);
        });
    },

    playLevelUp() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [
            { f: 440, t: 0.0, d: 0.1 },
            { f: 554.37, t: 0.09, d: 0.1 },
            { f: 659.25, t: 0.18, d: 0.1 },
            { f: 880, t: 0.28, d: 0.25 },
            { f: 1108.73, t: 0.42, d: 0.4 }
        ];

        notes.forEach(item => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(item.f, now + item.t);
            gain.gain.setValueAtTime(0.3, now + item.t);
            gain.gain.exponentialRampToValueAtTime(0.005, now + item.t + item.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + item.t);
            osc.stop(now + item.t + item.d + 0.05);
        });
    },

    playPoison() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.08);
        osc.frequency.linearRampToValueAtTime(180, now + 0.16);
        osc.frequency.linearRampToValueAtTime(100, now + 0.26);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.29);
    },

    playBurn() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.22);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
    },

    playBleed() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
    },

    playShield() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [587.33, 880.00, 1174.66].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.04);
            gain.gain.setValueAtTime(0.18, now + idx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.002, now + idx * 0.04 + 0.45);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.04);
            osc.stop(now + idx * 0.04 + 0.46);
        });
    },

    playStun() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.linearRampToValueAtTime(220, now + 0.09);
        osc.frequency.linearRampToValueAtTime(310, now + 0.18);
        osc.frequency.linearRampToValueAtTime(180, now + 0.28);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.33);
    }
};

// ------------------------------------------------------------
// 2. DEFINIÇÕES DO SISTEMA FORMAL DE EFEITOS DE ESTADO
// ------------------------------------------------------------
const statusSystem = {
    definitions: {
        poison: {
            id: 'poison',
            name: 'Veneno',
            icon: '🧪',
            desc: 'Dano tóxico por rodada que ignora armadura.',
            defaultPower: 7,
            badgeClass: 'status-poison',
            auraClass: 'card-poison-aura',
            logType: 'monster'
        },
        burn: {
            id: 'burn',
            name: 'Queimadura',
            icon: '🔥',
            desc: 'Chamas abrasadoras causam dano por rodada e reduzem o ataque em 15%.',
            defaultPower: 9,
            badgeClass: 'status-burn',
            auraClass: 'card-burn-aura',
            logType: 'crit'
        },
        bleed: {
            id: 'bleed',
            name: 'Sangramento',
            icon: '🩸',
            desc: 'Hemorragia contínua por rodada e aumenta em +15% a chance de sofrer acertos críticos.',
            defaultPower: 8,
            badgeClass: 'status-bleed',
            auraClass: 'card-bleed-aura',
            logType: 'monster'
        },
        holyShield: {
            id: 'holyShield',
            name: 'Escudo Sagrado',
            icon: '🛡️',
            desc: 'Barreira divina de luz que reduz todo o dano direto sofrido em 50%.',
            defaultPower: 0,
            badgeClass: 'status-holyShield',
            auraClass: 'card-shield-aura',
            logType: 'heal'
        },
        stun: {
            id: 'stun',
            name: 'Atordoamento',
            icon: '⚡',
            desc: 'Incapacitado pelo impacto, perdendo a vez de agir nesta rodada.',
            defaultPower: 0,
            badgeClass: 'status-stun',
            auraClass: 'card-stun-aura',
            logType: 'system'
        }
    },

    get(type) {
        return this.definitions[type] || {
            id: type,
            name: type,
            icon: '✨',
            desc: 'Efeito ativo',
            defaultPower: 5,
            badgeClass: 'status-poison',
            auraClass: '',
            logType: 'system'
        };
    }
};

// ------------------------------------------------------------
// 2. SISTEMA DE PROGRESSÃO E NÍVEIS (LOCALSTORAGE & STATS)
// ------------------------------------------------------------
const progressionSystem = {
    STORAGE_KEY: 'rpg_hero_progression_v2',
    data: {},

    init() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                this.data = JSON.parse(raw);
            }
        } catch (e) {
            console.warn('Falha ao ler progressão do localStorage', e);
        }
    },

    save() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.warn('Falha ao salvar progressão no localStorage', e);
        }
    },

    getHeroProgress(heroClass) {
        if (!this.data[heroClass]) {
            this.data[heroClass] = {
                level: 1,
                currentXp: 0,
                unspentPoints: 0,
                attributes: {
                    str: 0, // +1 Ataque Físico
                    def: 0, // +1 Defesa / Absorção
                    vit: 0, // +8 HP Máximo
                    agi: 0  // +2% Esquiva e +2% Crítico
                }
            };
        }
        return this.data[heroClass];
    },

    getXpForLevel(level) {
        // Nível 1: 100 XP, Nível 2: 135 XP, Nível 3: 182 XP, etc.
        return Math.round(100 * Math.pow(1.35, level - 1));
    },

    addXp(heroClass, amount) {
        const prog = this.getHeroProgress(heroClass);
        prog.currentXp += amount;
        let leveledUp = false;
        let levelsGained = 0;

        let needed = this.getXpForLevel(prog.level);
        while (prog.currentXp >= needed) {
            prog.currentXp -= needed;
            prog.level++;
            prog.unspentPoints += 2; // +2 pontos de atributo por nível ganho!
            leveledUp = true;
            levelsGained++;
            needed = this.getXpForLevel(prog.level);
        }

        this.save();
        return {
            leveledUp,
            newLevel: prog.level,
            unspentPoints: prog.unspentPoints,
            levelsGained,
            currentXp: prog.currentXp,
            neededXp: needed
        };
    },

    allocatePoint(heroClass, stat) {
        const prog = this.getHeroProgress(heroClass);
        if (prog.unspentPoints <= 0) return false;
        if (prog.attributes[stat] === undefined) return false;

        prog.attributes[stat]++;
        prog.unspentPoints--;
        this.save();
        return true;
    },

    resetPoints(heroClass) {
        const prog = this.getHeroProgress(heroClass);
        const totalAllocated = prog.attributes.str + prog.attributes.def + prog.attributes.vit + prog.attributes.agi;
        prog.unspentPoints += totalAllocated;
        prog.attributes.str = 0;
        prog.attributes.def = 0;
        prog.attributes.vit = 0;
        prog.attributes.agi = 0;
        this.save();
    },

    applyToHero(hero) {
        if (!hero || hero.type !== 'hero') return;
        const prog = this.getHeroProgress(hero.characterClass);
        hero.level = prog.level;
        hero.currentXp = prog.currentXp;
        hero.neededXp = this.getXpForLevel(prog.level);
        hero.unspentPoints = prog.unspentPoints;

        hero.bonusStr = prog.attributes.str;
        hero.bonusDef = prog.attributes.def;
        hero.bonusVit = prog.attributes.vit;
        hero.bonusAgi = prog.attributes.agi;

        hero.attack += hero.bonusStr;
        hero.defense += hero.bonusDef;
        const extraHp = hero.bonusVit * 8;
        hero.maxLife += extraHp;
        hero.life += extraHp;
        hero.dodgeChance += (hero.bonusAgi * 0.02);
        hero.critChance += (hero.bonusAgi * 0.02);
    }
};

// Inicializa a persistência imediatamente
progressionSystem.init();

// ------------------------------------------------------------
// 3. CLASSES DE PERSONAGENS (POO ES6 COMPLETO)
// ------------------------------------------------------------

class Character {
    constructor(name) {
        this.name = name;
        this.type = 'hero';
        this.characterClass = 'knight';
        this.level = 1;
        this.currentXp = 0;
        this.neededXp = 100;
        this.unspentPoints = 0;
        this.bonusStr = 0;
        this.bonusDef = 0;
        this.bonusVit = 0;
        this.bonusAgi = 0;
        this.xpReward = 50; // Recompensa de XP para monstros
        this.life = 1;
        this.maxLife = 100;
        this.attack = 10;
        this.defense = 5;
        this.potions = 2;
        this.isDefending = false;
        this.avatar = 'assets/images/knight.jpg';
        this.classTag = 'Cavaleiro';
        this.themeClass = 'theme-knight';
        this.behavior = 'Equilibrado';
        this.critChance = 0.15;
        this.dodgeChance = 0.10;
        this.isBoss = false;
        this.bossPhase = 1;
        this.statusEffects = []; // bleed, poison, stun, etc.
        this.specialSkill = {
            name: 'Golpe Especial',
            multiplier: 1.8,
            cooldown: 3,
            currentCooldown: 0,
            desc: 'Ataque fortificado'
        };
    }
}

// ----------------- HERÓIS -----------------

// 1. Guerreiro (Cavaleiro Paladino)
class Knight extends Character {
    constructor(name = 'Viktor') {
        super(name);
        this.type = 'hero';
        this.characterClass = 'knight';
        this.life = 115;
        this.maxLife = 115;
        this.attack = 14;
        this.defense = 9;
        this.potions = 2;
        this.avatar = 'assets/images/knight.jpg';
        this.classTag = 'Guerreiro Paladino';
        this.themeClass = 'theme-knight';
        this.behavior = 'Tanque e Dano';
        this.critChance = 0.15;
        this.dodgeChance = 0.10;
        this.specialSkill = {
            name: 'Golpe Demolidor',
            multiplier: 1.85,
            cooldown: 3,
            currentCooldown: 0,
            desc: 'Causa 185% de dano esmagador com a espada rúnica'
        };
    }
}

// 2. Feiticeiro (Mago Arcano)
class Sorcerer extends Character {
    constructor(name = 'Viktor') {
        super(name);
        this.type = 'hero';
        this.characterClass = 'sorcerer';
        this.life = 85;
        this.maxLife = 85;
        this.attack = 19;
        this.defense = 4;
        this.potions = 3;
        this.avatar = 'assets/images/sorcerer.jpg';
        this.classTag = 'Mago Arcano';
        this.themeClass = 'theme-sorcerer';
        this.behavior = 'Alto Dano Mágico';
        this.critChance = 0.20;
        this.dodgeChance = 0.10;
        this.specialSkill = {
            name: 'Explosão Arcana',
            multiplier: 2.2,
            cooldown: 3,
            currentCooldown: 0,
            desc: 'Conjura chamas arcanas causando 220% de dano mágico'
        };
    }
}

// 3. Arqueiro / Caçador
class Archer extends Character {
    constructor(name = 'Lyra') {
        super(name);
        this.type = 'hero';
        this.characterClass = 'archer';
        this.life = 90;
        this.maxLife = 90;
        this.attack = 16;
        this.defense = 6;
        this.potions = 2;
        this.avatar = 'assets/images/archer.jpg';
        this.classTag = 'Arqueira Caçadora';
        this.themeClass = 'theme-archer';
        this.behavior = 'Combate à Distância';
        this.critChance = 0.32; // Alta chance de crítico
        this.dodgeChance = 0.16;
        this.specialSkill = {
            name: 'Tiro Perfurante',
            multiplier: 2.3,
            cooldown: 3,
            currentCooldown: 0,
            desc: 'Disparo de flecha mágica perfurante com 230% de dano'
        };
    }
}

// 4. Ladino / Assassino
class Rogue extends Character {
    constructor(name = 'Sombra') {
        super(name);
        this.type = 'hero';
        this.characterClass = 'rogue';
        this.life = 80;
        this.maxLife = 80;
        this.attack = 18;
        this.defense = 5;
        this.potions = 2;
        this.avatar = 'assets/images/rogue.jpg';
        this.classTag = 'Ladino Assassino';
        this.themeClass = 'theme-rogue';
        this.behavior = 'Furtivo e Letal';
        this.critChance = 0.28;
        this.dodgeChance = 0.26; // Maior taxa de esquiva
        this.specialSkill = {
            name: 'Golpe Venenoso',
            multiplier: 2.1,
            cooldown: 2,
            currentCooldown: 0,
            desc: 'Apunhala com lâmina envenenada causando 210% de dano'
        };
    }
}

// 5. Clérigo / Sacerdote
class Cleric extends Character {
    constructor(name = 'Ildor') {
        super(name);
        this.type = 'hero';
        this.characterClass = 'cleric';
        this.life = 105;
        this.maxLife = 105;
        this.attack = 13;
        this.defense = 8;
        this.potions = 4; // Mais poções e sustentação
        this.avatar = 'assets/images/cleric.jpg';
        this.classTag = 'Clérigo da Luz';
        this.themeClass = 'theme-cleric';
        this.behavior = 'Suporte e Cura';
        this.critChance = 0.15;
        this.dodgeChance = 0.10;
        this.specialSkill = {
            name: 'Punição Sagrada',
            multiplier: 1.7,
            cooldown: 3,
            currentCooldown: 0,
            desc: 'Dano radiante de 170% e restaura +25 de vida para si'
        };
    }
}

// 6. Bárbaro (Berserker)
class Berserker extends Character {
    constructor(name = 'Krag') {
        super(name);
        this.type = 'hero';
        this.characterClass = 'berserker';
        this.life = 130;
        this.maxLife = 130;
        this.attack = 15;
        this.defense = 5;
        this.potions = 1;
        this.avatar = 'assets/images/berserker.jpg';
        this.classTag = 'Bárbaro Berserker';
        this.themeClass = 'theme-berserker';
        this.behavior = 'Fúria Destrutiva';
        this.critChance = 0.22;
        this.dodgeChance = 0.08;
        this.specialSkill = {
            name: 'Fúria Sanguinária',
            multiplier: 2.4,
            cooldown: 3,
            currentCooldown: 0,
            desc: 'Ataque brutal de machados causando 240% de dano devastador'
        };
    }
}

// ----------------- INIMIGOS COMUNS -----------------

// 1. Goblin Ladrão
class LittleMonster extends Character {
    constructor() {
        super('Goblin Ladrão');
        this.type = 'monster';
        this.characterClass = 'little-monster';
        this.xpReward = 45;
        this.life = 55;
        this.maxLife = 55;
        this.attack = 9;
        this.defense = 4;
        this.potions = 0;
        this.avatar = 'assets/images/little_monster.jpg';
        this.classTag = 'Goblin Ladrão';
        this.themeClass = 'theme-goblin';
        this.behavior = 'Ágil e Esquivo';
        this.critChance = 0.18;
        this.dodgeChance = 0.15;
        this.specialSkill = {
            name: 'Punhalada Sorrateira',
            multiplier: 1.6,
            cooldown: 2,
            currentCooldown: 0,
            desc: 'Golpe com adaga venenosa'
        };
    }
}

// 2. Esqueleto Arqueiro
class SkeletonArcher extends Character {
    constructor() {
        super('Esqueleto Arqueiro');
        this.type = 'monster';
        this.characterClass = 'skeleton-archer';
        this.xpReward = 55;
        this.life = 65;
        this.maxLife = 65;
        this.attack = 12;
        this.defense = 3;
        this.potions = 0;
        this.avatar = 'assets/images/skeleton_archer.jpg';
        this.classTag = 'Morto-Vivo Frágil';
        this.themeClass = 'theme-skeleton';
        this.behavior = 'Disparos da Retaguarda';
        this.critChance = 0.25;
        this.dodgeChance = 0.10;
        this.specialSkill = {
            name: 'Flecha Óssea Perfurante',
            multiplier: 1.75,
            cooldown: 3,
            currentCooldown: 0,
            desc: 'Flecha amaldiçoada'
        };
    }
}

// 3. Xamã Goblin / Cultista
class GoblinShaman extends Character {
    constructor() {
        super('Xamã Goblin');
        this.type = 'monster';
        this.characterClass = 'goblin-shaman';
        this.xpReward = 70;
        this.life = 75;
        this.maxLife = 75;
        this.attack = 11;
        this.defense = 5;
        this.potions = 1;
        this.avatar = 'assets/images/goblin_shaman.jpg';
        this.classTag = 'Conjurador Sombrio';
        this.themeClass = 'theme-shaman';
        this.behavior = 'Cura e Maldições';
        this.critChance = 0.15;
        this.dodgeChance = 0.10;
        this.specialSkill = {
            name: 'Maldição de Sangue',
            multiplier: 1.8,
            cooldown: 3,
            currentCooldown: 0,
            desc: 'Hex místico venenoso'
        };
    }
}

// 4. Lobo Selvagem / Rastejador
class WildWolf extends Character {
    constructor() {
        super('Lobo da Noite');
        this.type = 'monster';
        this.characterClass = 'wild-wolf';
        this.xpReward = 65;
        this.life = 70;
        this.maxLife = 70;
        this.attack = 14;
        this.defense = 4;
        this.potions = 0;
        this.avatar = 'assets/images/wild_wolf.jpg';
        this.classTag = 'Besta Feroz';
        this.themeClass = 'theme-wolf';
        this.behavior = 'Ataque Veloz e Sangramento';
        this.critChance = 0.24;
        this.dodgeChance = 0.18;
        this.specialSkill = {
            name: 'Mordida Rasgante',
            multiplier: 1.85,
            cooldown: 2,
            currentCooldown: 0,
            desc: 'Aplica sangramento violento'
        };
    }
}

// 5. Mímico (Baú Falso)
class MimicChest extends Character {
    constructor() {
        super('Mímico Devorador');
        this.type = 'monster';
        this.characterClass = 'mimic';
        this.xpReward = 85;
        this.life = 90;
        this.maxLife = 90;
        this.attack = 15;
        this.defense = 8;
        this.potions = 0;
        this.avatar = 'assets/images/mimic.jpg';
        this.classTag = 'Armadilha Voraz';
        this.themeClass = 'theme-mimic';
        this.behavior = 'Emboscada e Dentes Afiados';
        this.critChance = 0.22;
        this.dodgeChance = 0.05;
        this.specialSkill = {
            name: 'Mastigada Esmagadora',
            multiplier: 1.9,
            cooldown: 3,
            currentCooldown: 0,
            desc: 'Aperto que esmaga ossos'
        };
    }
}

// 6. Golem de Lava (Monstro Forte)
class BigMonster extends Character {
    constructor() {
        super('Golem de Lava');
        this.type = 'monster';
        this.characterClass = 'big-monster';
        this.xpReward = 100;
        this.life = 130;
        this.maxLife = 130;
        this.attack = 13;
        this.defense = 10;
        this.potions = 0;
        this.avatar = 'assets/images/big_monster.jpg';
        this.classTag = 'Monstro Gigante';
        this.themeClass = 'theme-golem';
        this.behavior = 'Armadura Vulcânica';
        this.critChance = 0.15;
        this.dodgeChance = 0.05;
        this.specialSkill = {
            name: 'Impacto Sísmico',
            multiplier: 1.8,
            cooldown: 3,
            currentCooldown: 0,
            desc: 'Golpe sísmico'
        };
    }
}

// ----------------- CHEFÕES (BOSSES) -----------------

// 1. Rei dos Goblins (Chefe com mecânica de invocação e fumaça)
class GoblinKing extends Character {
    constructor() {
        super('Rei dos Goblins');
        this.type = 'monster';
        this.characterClass = 'goblin-king';
        this.isBoss = true;
        this.bossPhase = 1;
        this.xpReward = 220;
        this.life = 180;
        this.maxLife = 180;
        this.attack = 16;
        this.defense = 9;
        this.potions = 1;
        this.avatar = 'assets/images/goblin_king.jpg';
        this.classTag = '👑 CHEFÃO SUPREMO';
        this.themeClass = 'theme-boss-goblin';
        this.behavior = 'Invocação e Bombas';
        this.critChance = 0.20;
        this.dodgeChance = 0.15;
        this.specialSkill = {
            name: 'Bomba de Fumaça & Emboscada',
            multiplier: 2.1,
            cooldown: 3,
            currentCooldown: 0,
            desc: 'Joga fumaça tóxica e ordena ataque brutal da horda'
        };
    }
}

// 2. Colosso Ancestral (Golem Corrompido com ataque telegrafado de terremoto)
class AncientColossus extends Character {
    constructor() {
        super('Colosso Ancestral');
        this.type = 'monster';
        this.characterClass = 'ancient-colossus';
        this.isBoss = true;
        this.bossPhase = 1;
        this.xpReward = 320;
        this.life = 240;
        this.maxLife = 240;
        this.attack = 19;
        this.defense = 14;
        this.potions = 0;
        this.avatar = 'assets/images/ancient_colossus.jpg';
        this.classTag = '👑 CHEFE TITÂNICO';
        this.themeClass = 'theme-boss-colossus';
        this.behavior = 'Terremoto Telegrafado';
        this.critChance = 0.18;
        this.dodgeChance = 0.02;
        this.isTelegraphing = false; // Telegrafa golpe sísmico mortal
        this.specialSkill = {
            name: 'Cataclismo de Rocha',
            multiplier: 2.6,
            cooldown: 4,
            currentCooldown: 0,
            desc: 'Impacto sísmico mortal que derruba o teto'
        };
    }
}

// ------------------------------------------------------------
// 4. FACTORY FUNCTIONS (PADRÃO FUNCIONAL COMPATÍVEL)
// ------------------------------------------------------------
const createKnight = (name = 'Viktor') => {
    const hero = new Knight(name);
    progressionSystem.applyToHero(hero);
    return hero;
};

const createSorcerer = (name = 'Viktor') => {
    const hero = new Sorcerer(name);
    progressionSystem.applyToHero(hero);
    return hero;
};

const createArcher = (name = 'Lyra') => {
    const hero = new Archer(name);
    progressionSystem.applyToHero(hero);
    return hero;
};

const createRogue = (name = 'Sombra') => {
    const hero = new Rogue(name);
    progressionSystem.applyToHero(hero);
    return hero;
};

const createCleric = (name = 'Ildor') => {
    const hero = new Cleric(name);
    progressionSystem.applyToHero(hero);
    return hero;
};

const createBerserker = (name = 'Krag') => {
    const hero = new Berserker(name);
    progressionSystem.applyToHero(hero);
    return hero;
};

const createLittleMonster = () => new LittleMonster();
const createSkeletonArcher = () => new SkeletonArcher();
const createGoblinShaman = () => new GoblinShaman();
const createWildWolf = () => new WildWolf();
const createMimic = () => new MimicChest();
const createBigMonster = () => new BigMonster();

// Chefes
const createGoblinKing = () => new GoblinKing();
const createAncientColossus = () => new AncientColossus();

// ------------------------------------------------------------
// 4. GERENCIADOR DO LOG DE COMBATE
// ------------------------------------------------------------
const log = {
    listEl: null,

    init(element) {
        this.listEl = element;
    },

    addMessage(msg, type = 'system') {
        if (!this.listEl) return;
        const li = document.createElement('li');
        li.className = `log-${type}`;

        let icon = '⚡';
        if (type === 'hero') icon = '⚔️';
        if (type === 'monster') icon = '👹';
        if (type === 'boss') icon = '👑';
        if (type === 'crit') icon = '💥';
        if (type === 'heal') icon = '🧪';
        if (type === 'system') icon = '📜';

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        li.innerHTML = `<span>${icon}</span> <span>[${time}] ${msg}</span>`;

        this.listEl.appendChild(li);

        const parent = this.listEl.parentElement;
        if (parent) {
            parent.scrollTop = parent.scrollHeight;
        }
    },

    clear() {
        if (this.listEl) {
            this.listEl.innerHTML = '';
            this.addMessage('Histórico reiniciado. Que comece a batalha!', 'system');
        }
    }
};

// ------------------------------------------------------------
// 5. MOTOR DA ARENA DE COMBATE (STAGE ENGINE)
// ------------------------------------------------------------
const stage = {
    fighter1: null,
    fighter2: null,
    fighter1El: null,
    fighter2El: null,
    arenaEl: null,
    round: 1,
    isPlayerTurn: true,
    isGameOver: false,
    stats: {
        damageDealt: 0,
        damageTaken: 0,
        critsLanded: 0,
        healsUsed: 0
    },

    start(fighter1, fighter2, fighter1El, fighter2El) {
        this.fighter1 = fighter1;
        this.fighter2 = fighter2;
        this.fighter1.statusEffects = [];
        this.fighter2.statusEffects = [];
        this.fighter1El = fighter1El;
        this.fighter2El = fighter2El;
        this.arenaEl = document.getElementById('fightArena');
        this.round = 1;
        this.isPlayerTurn = true;
        this.isGameOver = false;
        this.stats = { damageDealt: 0, damageTaken: 0, critsLanded: 0, healsUsed: 0 };

        log.init(document.getElementById('combatLog'));
        log.clear();

        if (this.fighter2.isBoss) {
            soundFx.playBossAlert();
            log.addMessage(`🚨 ALERTA DE CHEFÃO! ${this.fighter2.name} despertou na Arena dos Campeões!`, 'boss');
            this.triggerBossNotice(`${this.fighter2.name.toUpperCase()} ENTROU NA ARENA!`);
        } else {
            log.addMessage(`A batalha começou! ${this.fighter1.name} (${this.fighter1.classTag}) vs ${this.fighter2.name} (${this.fighter2.classTag})!`, 'system');
        }

        this.bindEvents();
        this.renderStatusBars();
        this.update();
    },

    applyStatus(target, statusType, duration = 3, power = null, source = null) {
        if (!target || target.life <= 0 || this.isGameOver) return;
        if (!target.statusEffects) target.statusEffects = [];

        const meta = statusSystem.get(statusType);
        const containerId = target === this.fighter1 ? 'charDamageContainer' : 'monsterDamageContainer';
        const existing = target.statusEffects.find(s => s.type === statusType);

        if (existing) {
            existing.duration = Math.max(existing.duration, duration);
            if (power) existing.power = Math.max(existing.power, power);
            this.showFloatingNumber(containerId, `+${meta.name.toUpperCase()} (${existing.duration}T)`, `status-${statusType}`);
            log.addMessage(`🔄 [${meta.name}] A duração do efeito em ${target.name} foi estendida para ${existing.duration} turnos!`, 'system');
        } else {
            const finalPower = power !== null ? power : meta.defaultPower;
            target.statusEffects.push({
                type: statusType,
                duration: duration,
                power: finalPower,
                source: source ? source.name : ''
            });

            this.showFloatingNumber(containerId, `+${meta.name.toUpperCase()} (${duration}T)`, `status-${statusType}`);

            if (statusType === 'poison') soundFx.playPoison();
            else if (statusType === 'burn') soundFx.playBurn();
            else if (statusType === 'bleed') soundFx.playBleed();
            else if (statusType === 'holyShield') soundFx.playShield();
            else if (statusType === 'stun') soundFx.playStun();

            log.addMessage(`${meta.icon} [${meta.name}] ${target.name} foi afligido por ${meta.name} (${duration} rodada${duration > 1 ? 's' : ''})!`, meta.logType || 'system');
        }

        this.renderStatusBars();
        this.update();
    },

    resolveTurnStartStatus(fighter, isHero) {
        if (!fighter || fighter.life <= 0 || !fighter.statusEffects || fighter.statusEffects.length === 0) {
            return { isStunned: false, died: false };
        }

        const containerId = isHero ? 'charDamageContainer' : 'monsterDamageContainer';
        let isStunned = false;
        const expiredStatuses = [];
        const currentStatuses = [...fighter.statusEffects];

        for (const status of currentStatuses) {
            const meta = statusSystem.get(status.type);

            if (status.type === 'poison') {
                const dmg = status.power || 7;
                fighter.life = Math.max(0, fighter.life - dmg);
                this.showFloatingNumber(containerId, `-${dmg} VENENO`, 'status-poison');
                soundFx.playPoison();
                log.addMessage(`🧪 [Veneno] Toxinas queimam as entranhas de ${fighter.name}, causando ${dmg} de dano!`, 'monster');
                if (isHero) this.stats.damageTaken += dmg;
                else this.stats.damageDealt += dmg;
            } else if (status.type === 'burn') {
                const dmg = status.power || 9;
                fighter.life = Math.max(0, fighter.life - dmg);
                this.showFloatingNumber(containerId, `-${dmg} FOGO`, 'status-burn');
                soundFx.playBurn();
                log.addMessage(`🔥 [Queimadura] Chamas abrasam ${fighter.name}, causando ${dmg} de dano contínuo!`, 'crit');
                if (isHero) this.stats.damageTaken += dmg;
                else this.stats.damageDealt += dmg;
            } else if (status.type === 'bleed') {
                const dmg = status.power || 8;
                fighter.life = Math.max(0, fighter.life - dmg);
                this.showFloatingNumber(containerId, `-${dmg} SANGRANDO`, 'status-bleed');
                soundFx.playBleed();
                log.addMessage(`🩸 [Sangramento] Ferimentos abertos de ${fighter.name} jorram sangue (-${dmg} HP)!`, 'monster');
                if (isHero) this.stats.damageTaken += dmg;
                else this.stats.damageDealt += dmg;
            } else if (status.type === 'stun') {
                isStunned = true;
                this.showFloatingNumber(containerId, `💫 ATORDOADO!`, 'status-stun');
                soundFx.playStun();
                log.addMessage(`💫 [Atordoamento] ${fighter.name} está atordoado e não consegue agir nesta rodada!`, 'system');
            } else if (status.type === 'holyShield') {
                log.addMessage(`🛡️ [Escudo Sagrado] A barreira divina protege ${fighter.name} (-50% de dano sofrido)!`, 'heal');
            }

            if (fighter.life <= 0) {
                this.update();
                this.renderStatusBars();
                return { isStunned: false, died: true };
            }

            status.duration--;
            if (status.duration <= 0) {
                expiredStatuses.push(status.type);
            }
        }

        fighter.statusEffects = fighter.statusEffects.filter(s => s.duration > 0);
        expiredStatuses.forEach(type => {
            const meta = statusSystem.get(type);
            log.addMessage(`✨ O efeito de [${meta.name}] em ${fighter.name} dissipou-se.`, 'system');
        });

        this.renderStatusBars();
        this.update();

        return { isStunned, died: false };
    },

    renderStatusBars() {
        const charBar = document.getElementById('charStatusBar');
        const monsterBar = document.getElementById('monsterStatusBar');

        if (charBar && this.fighter1) {
            charBar.innerHTML = '';
            if (this.fighter1.statusEffects && this.fighter1.statusEffects.length > 0) {
                this.fighter1.statusEffects.forEach(effect => {
                    const meta = statusSystem.get(effect.type);
                    const pill = document.createElement('div');
                    pill.className = `status-pill ${meta.badgeClass}`;
                    pill.title = `${meta.name}: ${meta.desc} (${effect.duration} rodada${effect.duration > 1 ? 's' : ''} restante${effect.duration > 1 ? 's' : ''})`;
                    pill.innerHTML = `
                        <span class="status-icon">${meta.icon}</span>
                        <span class="status-name">${meta.name}</span>
                        <span class="status-duration-badge">${effect.duration}T</span>
                    `;
                    charBar.appendChild(pill);
                });
            }
        }

        if (monsterBar && this.fighter2) {
            monsterBar.innerHTML = '';
            if (this.fighter2.statusEffects && this.fighter2.statusEffects.length > 0) {
                this.fighter2.statusEffects.forEach(effect => {
                    const meta = statusSystem.get(effect.type);
                    const pill = document.createElement('div');
                    pill.className = `status-pill ${meta.badgeClass}`;
                    pill.title = `${meta.name}: ${meta.desc} (${effect.duration} rodada${effect.duration > 1 ? 's' : ''} restante${effect.duration > 1 ? 's' : ''})`;
                    pill.innerHTML = `
                        <span class="status-icon">${meta.icon}</span>
                        <span class="status-name">${meta.name}</span>
                        <span class="status-duration-badge">${effect.duration}T</span>
                    `;
                    monsterBar.appendChild(pill);
                });
            }
        }
    },

    beginPlayerTurn() {
        if (this.isGameOver) return;

        this.isPlayerTurn = true;
        this.update();

        const heroStatus = this.resolveTurnStartStatus(this.fighter1, true);
        if (heroStatus.died) {
            this.endBattle(false);
            return;
        }

        if (heroStatus.isStunned) {
            this.setControlsDisabled(true);
            this.isPlayerTurn = false;
            this.update();
            setTimeout(() => {
                this.monsterTurn();
            }, 1200);
            return;
        }

        this.setControlsDisabled(false);
    },

    bindEvents() {
        const btnAttack = document.getElementById('btnAttack');
        const btnSpecial = document.getElementById('btnSpecial');
        const btnHeal = document.getElementById('btnHeal');
        const btnDefend = document.getElementById('btnDefend');

        [btnAttack, btnSpecial, btnHeal, btnDefend].forEach(btn => {
            if (btn) {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
            }
        });

        document.getElementById('btnAttack')?.addEventListener('click', () => {
            this.handlePlayerAction('attack');
        });

        document.getElementById('btnSpecial')?.addEventListener('click', () => {
            this.handlePlayerAction('special');
        });

        document.getElementById('btnHeal')?.addEventListener('click', () => {
            this.handlePlayerAction('heal');
        });

        document.getElementById('btnDefend')?.addEventListener('click', () => {
            this.handlePlayerAction('defend');
        });
    },

    update() {
        if (!this.fighter1 || !this.fighter2) return;

        // Atualização Lutador 1 (Herói)
        const f1NameEl = this.fighter1El.querySelector('.name');
        const f1HpTextEl = document.getElementById('charHpText');
        const f1BarEl = this.fighter1El.querySelector('.bar');
        const f1AvatarEl = document.getElementById('charAvatar');
        const f1ClassTagEl = document.getElementById('charClassTag');
        const f1AtkEl = document.getElementById('charAtk');
        const f1DefEl = document.getElementById('charDef');
        const f1PotionsEl = document.getElementById('charPotions');
        const specialNameEl = document.getElementById('specialSkillName');
        const btnSpecial = document.getElementById('btnSpecial');
        const btnHeal = document.getElementById('btnHeal');

        // Bônus passivo do Berserker quando perde vida
        let heroDisplayAtk = this.fighter1.attack;
        if (this.fighter1.characterClass === 'berserker') {
            const missingHpPct = (1 - (this.fighter1.life / this.fighter1.maxLife));
            const rageBonus = Math.round(missingHpPct * 12);
            heroDisplayAtk += rageBonus;
        }

        // Limpa classes de tema antigas e aplica a nova
        this.fighter1El.className = `fighter-card hero-card ${this.fighter1.themeClass || 'theme-knight'}`;

        if (f1NameEl) f1NameEl.innerText = this.fighter1.name;
        if (f1HpTextEl) f1HpTextEl.innerText = `${Math.ceil(this.fighter1.life)} / ${this.fighter1.maxLife} HP`;
        if (f1AvatarEl) {
            f1AvatarEl.src = this.fighter1.avatar;
            f1AvatarEl.alt = this.fighter1.name;
        }
        if (f1ClassTagEl) {
            f1ClassTagEl.innerText = this.fighter1.classTag;
            f1ClassTagEl.className = `class-tag ${this.fighter1.characterClass}`;
        }
        if (f1AtkEl) f1AtkEl.innerText = `${heroDisplayAtk} Atk`;
        if (f1DefEl) f1DefEl.innerText = `${this.fighter1.defense} Def`;
        if (f1PotionsEl) f1PotionsEl.innerText = `${this.fighter1.potions} Poções`;

        // Barra de Nível e XP do Herói
        const heroLevelBadge = document.getElementById('heroLevelBadge');
        const heroXpText = document.getElementById('heroXpText');
        const heroXpBar = document.getElementById('heroXpBar');
        const pointsBadge = document.getElementById('pointsBadge');

        if (heroLevelBadge) heroLevelBadge.innerText = `⭐ Nível ${this.fighter1.level || 1}`;
        if (heroXpText) heroXpText.innerText = `${this.fighter1.currentXp || 0} / ${this.fighter1.neededXp || 100} XP`;
        if (heroXpBar) {
            const xpPct = Math.min(100, Math.max(0, ((this.fighter1.currentXp || 0) / (this.fighter1.neededXp || 100)) * 100));
            heroXpBar.style.width = `${xpPct}%`;
        }

        if (pointsBadge) {
            if (this.fighter1.unspentPoints > 0) {
                pointsBadge.style.display = 'inline-flex';
                pointsBadge.innerText = `+${this.fighter1.unspentPoints} pts`;
            } else {
                pointsBadge.style.display = 'none';
            }
        }

        let f1Pct = Math.max(0, Math.min(100, (this.fighter1.life / this.fighter1.maxLife) * 100));
        if (f1BarEl) {
            f1BarEl.style.width = `${f1Pct}%`;
            f1BarEl.classList.remove('hp-medium', 'hp-low');
            if (f1Pct <= 25) {
                f1BarEl.classList.add('hp-low');
            } else if (f1Pct <= 50) {
                f1BarEl.classList.add('hp-medium');
            }
        }

        // Habilidade Especial
        if (specialNameEl && this.fighter1.specialSkill) {
            if (this.fighter1.specialSkill.currentCooldown > 0) {
                specialNameEl.innerText = `${this.fighter1.specialSkill.name} (${this.fighter1.specialSkill.currentCooldown}T)`;
                if (btnSpecial) btnSpecial.disabled = true;
            } else {
                specialNameEl.innerText = this.fighter1.specialSkill.name;
                if (btnSpecial && this.isPlayerTurn && !this.isGameOver) btnSpecial.disabled = false;
            }
        }

        // Poções
        if (btnHeal) {
            btnHeal.disabled = (this.fighter1.potions <= 0 || !this.isPlayerTurn || this.isGameOver);
        }

        // Atualização Lutador 2 (Monstro / Chefe)
        const f2NameEl = this.fighter2El.querySelector('.name');
        const f2HpTextEl = document.getElementById('monsterHpText');
        const f2BarEl = this.fighter2El.querySelector('.bar');
        const f2AvatarEl = document.getElementById('monsterAvatar');
        const f2ClassTagEl = document.getElementById('monsterClassTag');
        const f2AtkEl = document.getElementById('monsterAtk');
        const f2DefEl = document.getElementById('monsterDef');
        const f2BehaviorEl = document.getElementById('monsterBehavior');

        this.fighter2El.className = `fighter-card monster-card ${this.fighter2.themeClass || 'theme-golem'} ${this.fighter2.isBoss ? 'boss-card' : ''}`;

        if (f2NameEl) f2NameEl.innerText = this.fighter2.name;
        if (f2HpTextEl) f2HpTextEl.innerText = `${Math.ceil(this.fighter2.life)} / ${this.fighter2.maxLife} HP`;
        if (f2AvatarEl) {
            f2AvatarEl.src = this.fighter2.avatar;
            f2AvatarEl.alt = this.fighter2.name;
        }
        if (f2ClassTagEl) {
            f2ClassTagEl.innerText = this.fighter2.classTag;
            f2ClassTagEl.className = `class-tag ${this.fighter2.characterClass} ${this.fighter2.isBoss ? 'boss-badge' : ''}`;
        }
        if (f2AtkEl) f2AtkEl.innerText = `${this.fighter2.attack} Atk`;
        if (f2DefEl) f2DefEl.innerText = `${this.fighter2.defense} Def`;
        if (f2BehaviorEl) f2BehaviorEl.innerText = this.fighter2.behavior;

        let f2Pct = Math.max(0, Math.min(100, (this.fighter2.life / this.fighter2.maxLife) * 100));
        if (f2BarEl) {
            f2BarEl.style.width = `${f2Pct}%`;
            f2BarEl.classList.remove('hp-medium', 'hp-low');
            if (f2Pct <= 25) {
                f2BarEl.classList.add('hp-low');
            } else if (f2Pct <= 50) {
                f2BarEl.classList.add('hp-medium');
            }
        }

        // Transição de Fase do Chefe
        if (this.fighter2.isBoss && this.fighter2.bossPhase === 1 && f2Pct < 50) {
            this.fighter2.bossPhase = 2;
            this.fighter2.attack += 3;
            soundFx.playRoar();
            this.triggerShake();
            log.addMessage(`⚡ FASE 2 DO CHEFÃO! ${this.fighter2.name} se enfurece com poder devastador (+3 Atk)!`, 'boss');
            this.triggerBossNotice(`FASE 2: ${this.fighter2.name.toUpperCase()} ENTROU EM FÚRIA!`);
        }

        // Turno e Indicadores
        const roundCounter = document.getElementById('roundCounter');
        if (roundCounter) roundCounter.innerText = `Turno ${this.round}`;

        const turnIndicator = document.getElementById('turnIndicator');
        const turnText = turnIndicator?.querySelector('.turn-text');
        const enemyStatusText = document.querySelector('.enemy-status-text');

        if (this.isPlayerTurn) {
            this.fighter1El.classList.add('active-turn');
            this.fighter2El.classList.remove('active-turn');
            if (turnIndicator) turnIndicator.classList.remove('enemy-turn');
            if (turnText) turnText.innerText = 'Seu Turno: Escolha uma Ação';
            if (enemyStatusText) {
                if (this.fighter2.isTelegraphing) {
                    enemyStatusText.innerHTML = '<strong style="color: #ef4444;">⚠️ ALERTA: GOLPE SÍSMICO MORTAL IMINENTE! USE DEFESA!</strong>';
                } else {
                    enemyStatusText.innerText = 'Aguardando sua jogada...';
                }
            }
            this.setControlsDisabled(false);
        } else {
            this.fighter1El.classList.remove('active-turn');
            this.fighter2El.classList.add('active-turn');
            if (turnIndicator) turnIndicator.classList.add('enemy-turn');
            if (turnText) turnText.innerText = `Turno de ${this.fighter2.name}...`;
            if (enemyStatusText) enemyStatusText.innerText = 'Preparando investida brutal...';
            this.setControlsDisabled(true);
        }

        if (this.fighter1.isDefending) {
            this.fighter1El.classList.add('defending');
        } else {
            this.fighter1El.classList.remove('defending');
        }

        if (this.fighter2.isDefending) {
            this.fighter2El.classList.add('defending');
        } else {
            this.fighter2El.classList.remove('defending');
        }

        // Auras Visuais dos Efeitos de Estado Ativos
        const allAuraClasses = ['card-poison-aura', 'card-burn-aura', 'card-bleed-aura', 'card-shield-aura', 'card-stun-aura'];
        this.fighter1El.classList.remove(...allAuraClasses);
        this.fighter2El.classList.remove(...allAuraClasses);

        if (this.fighter1.statusEffects) {
            this.fighter1.statusEffects.forEach(s => {
                const meta = statusSystem.get(s.type);
                if (meta && meta.auraClass) this.fighter1El.classList.add(meta.auraClass);
            });
        }

        if (this.fighter2.statusEffects) {
            this.fighter2.statusEffects.forEach(s => {
                const meta = statusSystem.get(s.type);
                if (meta && meta.auraClass) this.fighter2El.classList.add(meta.auraClass);
            });
        }
    },

    triggerBossNotice(text) {
        let noticeEl = document.getElementById('bossNotice');
        if (!noticeEl) {
            noticeEl = document.createElement('div');
            noticeEl.id = 'bossNotice';
            noticeEl.className = 'boss-notice-banner';
            document.body.appendChild(noticeEl);
        }
        noticeEl.innerText = text;
        noticeEl.classList.add('show');
        setTimeout(() => {
            noticeEl.classList.remove('show');
        }, 2200);
    },

    setControlsDisabled(disabled) {
        const buttons = document.querySelectorAll('.actions-panel .action-btn');
        buttons.forEach(btn => {
            btn.disabled = disabled;
        });

        if (!disabled && this.fighter1) {
            const btnSpecial = document.getElementById('btnSpecial');
            const btnHeal = document.getElementById('btnHeal');
            if (btnSpecial && this.fighter1.specialSkill && this.fighter1.specialSkill.currentCooldown > 0) {
                btnSpecial.disabled = true;
            }
            if (btnHeal && this.fighter1.potions <= 0) {
                btnHeal.disabled = true;
            }
        }
    },

    showFloatingNumber(containerId, text, type = 'normal') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const span = document.createElement('span');
        span.className = `floating-damage ${type}`;
        span.innerText = text;
        container.appendChild(span);

        setTimeout(() => {
            span.remove();
        }, 900);
    },

    triggerShake() {
        if (!this.arenaEl) return;
        this.arenaEl.classList.remove('shake');
        void this.arenaEl.offsetWidth;
        this.arenaEl.classList.add('shake');
        setTimeout(() => this.arenaEl.classList.remove('shake'), 400);
    },

    triggerAttackDash(attackerEl, isHero) {
        const className = 'attack-dash';
        attackerEl.classList.add(className);
        setTimeout(() => attackerEl.classList.remove(className), 360);
    },

    triggerHitFlash(targetEl) {
        targetEl.classList.add('hit-effect');
        setTimeout(() => targetEl.classList.remove('hit-effect'), 320);
    },

    handlePlayerAction(action) {
        if (!this.isPlayerTurn || this.isGameOver) return;

        this.setControlsDisabled(true);

        if (action === 'attack') {
            this.executeAttack(this.fighter1, this.fighter2, false);
        } else if (action === 'special') {
            this.executeAttack(this.fighter1, this.fighter2, true);
        } else if (action === 'heal') {
            this.executeHeal(this.fighter1);
        } else if (action === 'defend') {
            this.executeDefend(this.fighter1);
        }

        this.update();

        if (action !== 'special' && this.fighter1.specialSkill.currentCooldown > 0) {
            this.fighter1.specialSkill.currentCooldown--;
        }

        if (this.fighter2.life <= 0) {
            this.endBattle(true);
            return;
        }

        this.isPlayerTurn = false;
        this.update();

        setTimeout(() => {
            this.monsterTurn();
        }, 950);
    },

    executeAttack(attacker, target, isSpecial = false) {
        const isHero = attacker.type === 'hero';
        const attackerEl = isHero ? this.fighter1El : this.fighter2El;
        const targetEl = isHero ? this.fighter2El : this.fighter1El;
        const targetContainerId = isHero ? 'monsterDamageContainer' : 'charDamageContainer';

        this.triggerAttackDash(attackerEl, isHero);

        // Chance de Esquiva
        const dodgeChance = target.dodgeChance || 0.10;
        if (Math.random() < dodgeChance) {
            soundFx.playSlash();
            this.showFloatingNumber(targetContainerId, 'ESQUIVOU!', 'dodge');
            log.addMessage(`💨 ${target.name} esquivou com agilidade do golpe de ${attacker.name}!`, isHero ? 'hero' : 'monster');
            return;
        }

        // Chance de Crítico
        let critChance = attacker.critChance || 0.18;
        if (target.statusEffects && target.statusEffects.some(s => s.type === 'bleed')) {
            critChance += 0.15; // Alvos sangrando são mais suscetíveis a cortes críticos!
        }
        const isCrit = Math.random() < critChance;
        const critMultiplier = isCrit ? 1.75 : 1.0;

        let baseAttack = attacker.attack;

        // Bônus passivo do Berserker quando perde HP
        if (attacker.characterClass === 'berserker') {
            const missingHpPct = (1 - (attacker.life / attacker.maxLife));
            baseAttack += Math.round(missingHpPct * 12);
        }

        let attackPower = baseAttack * (0.85 + Math.random() * 0.35);

        // Queimadura debilita a força física do atacante (-15% de poder)
        if (attacker.statusEffects && attacker.statusEffects.some(s => s.type === 'burn')) {
            attackPower *= 0.85;
        }

        if (isSpecial && attacker.specialSkill) {
            attackPower *= attacker.specialSkill.multiplier;
            attacker.specialSkill.currentCooldown = attacker.specialSkill.cooldown;

            // Habilidade do Clérigo: Cura a si mesmo no golpe especial
            if (attacker.characterClass === 'cleric') {
                const holyHeal = 25;
                attacker.life = Math.min(attacker.maxLife, attacker.life + holyHeal);
                this.showFloatingNumber('charDamageContainer', `+${holyHeal} HP SAGRADO`, 'heal');
            }
        }

        let defenseFactor = target.defense * (0.7 + Math.random() * 0.3);
        if (target.isDefending) {
            defenseFactor *= 1.75;
            target.isDefending = false;
        }

        let rawDamage = (attackPower * critMultiplier) - defenseFactor;
        let finalDamage = Math.max(2, Math.round(rawDamage));

        // Escudo Sagrado no alvo: Mitiga 50% de todo dano recebido!
        if (target.statusEffects && target.statusEffects.some(s => s.type === 'holyShield')) {
            finalDamage = Math.max(1, Math.round(finalDamage * 0.5));
            this.showFloatingNumber(targetContainerId, '🛡️ ABSORVIDO 50%!', 'status-shield');
            soundFx.playShield();
        }

        target.life = Math.max(0, target.life - finalDamage);

        if (isHero) {
            this.stats.damageDealt += finalDamage;
            if (isCrit) this.stats.critsLanded++;
        } else {
            this.stats.damageTaken += finalDamage;
        }

        this.triggerHitFlash(targetEl);

        // Efeitos sonoros temáticos por classe
        if (attacker.characterClass === 'archer' || attacker.characterClass === 'skeleton-archer') {
            soundFx.playArrow();
        } else if (attacker.characterClass === 'sorcerer') {
            soundFx.playMagic();
        } else if (attacker.characterClass === 'cleric') {
            soundFx.playHoly();
        } else if (attacker.characterClass === 'wild-wolf') {
            soundFx.playRoar();
        } else if (attacker.isBoss) {
            soundFx.playRoar();
        } else {
            soundFx.playHit();
        }

        if (isCrit || isSpecial) {
            this.triggerShake();
            soundFx.playCrit();
            this.showFloatingNumber(targetContainerId, `-${finalDamage} CRÍTICO!`, 'crit');
            log.addMessage(`💥 GOLPE CRÍTICO! ${attacker.name} usou ${isSpecial ? attacker.specialSkill.name : 'um ataque esmagador'} e causou ${finalDamage} de dano a ${target.name}!`, 'crit');
        } else {
            this.showFloatingNumber(targetContainerId, `-${finalDamage}`, 'normal');
            log.addMessage(`${attacker.name} atacou ${target.name} causando ${finalDamage} de dano.`, isHero ? 'hero' : 'monster');
        }

        // Aplicação de Efeitos de Estado baseados em Classe / Criatura
        if (target.life > 0) {
            if (isHero) {
                if (attacker.characterClass === 'rogue') {
                    if (isSpecial) {
                        this.applyStatus(target, 'poison', 3, 9, attacker);
                    } else if (Math.random() < 0.45) {
                        this.applyStatus(target, 'poison', 2, 7, attacker);
                    }
                } else if (attacker.characterClass === 'sorcerer') {
                    if (isSpecial) {
                        this.applyStatus(target, 'burn', 3, 11, attacker);
                    } else if (Math.random() < 0.40) {
                        this.applyStatus(target, 'burn', 2, 8, attacker);
                    }
                } else if (attacker.characterClass === 'berserker') {
                    if (isSpecial || isCrit) {
                        if (Math.random() < 0.80) this.applyStatus(target, 'bleed', 3, 10, attacker);
                    } else if (Math.random() < 0.35) {
                        this.applyStatus(target, 'bleed', 2, 7, attacker);
                    }
                } else if (attacker.characterClass === 'archer') {
                    if (isSpecial) {
                        this.applyStatus(target, 'bleed', 3, 9, attacker);
                    } else if (isCrit) {
                        this.applyStatus(target, 'bleed', 2, 8, attacker);
                    }
                } else if (attacker.characterClass === 'knight') {
                    if (isSpecial && Math.random() < 0.50) {
                        this.applyStatus(target, 'stun', 1, 0, attacker);
                    } else if (Math.random() < 0.15) {
                        this.applyStatus(target, 'stun', 1, 0, attacker);
                    }
                } else if (attacker.characterClass === 'cleric') {
                    if (isSpecial) {
                        this.applyStatus(attacker, 'holyShield', 2, 0, attacker);
                    }
                }
            } else {
                // Ataques de Monstros
                if (attacker.characterClass === 'wild-wolf' && Math.random() < 0.55) {
                    this.applyStatus(target, 'bleed', 3, 7, attacker);
                } else if (attacker.characterClass === 'little-monster' && Math.random() < 0.45) {
                    this.applyStatus(target, 'poison', 2, 6, attacker);
                } else if (attacker.characterClass === 'big-monster' && Math.random() < 0.45) {
                    this.applyStatus(target, 'burn', 2, 8, attacker);
                } else if (attacker.characterClass === 'skeleton-archer' && Math.random() < 0.40) {
                    this.applyStatus(target, 'bleed', 2, 6, attacker);
                } else if (attacker.characterClass === 'goblin-shaman') {
                    if (Math.random() < 0.50) this.applyStatus(target, 'poison', 2, 7, attacker);
                    else this.applyStatus(target, 'burn', 2, 8, attacker);
                } else if (attacker.characterClass === 'mimic') {
                    if (Math.random() < 0.35) this.applyStatus(target, 'stun', 1, 0, attacker);
                    else this.applyStatus(target, 'bleed', 2, 8, attacker);
                } else if (attacker.characterClass === 'goblin-king') {
                    if (isSpecial) {
                        this.applyStatus(target, 'burn', 2, 8, attacker);
                        this.applyStatus(target, 'poison', 2, 8, attacker);
                    } else if (Math.random() < 0.35) {
                        this.applyStatus(target, 'poison', 2, 6, attacker);
                    }
                } else if (attacker.characterClass === 'ancient-colossus' && isSpecial) {
                    if (target.isDefending) {
                        log.addMessage('🛡️ BLOQUEIO PERFEITO! Sua postura defensiva anulou o atordoamento do Cataclismo Sísmico!', 'heal');
                    } else {
                        this.applyStatus(target, 'stun', 1, 0, attacker);
                    }
                }
            }
        }
    },

    executeHeal(fighter) {
        if (fighter.potions <= 0) return;

        fighter.potions--;
        this.stats.healsUsed++;

        const healAmount = Math.round(fighter.maxLife * 0.35);
        const actualHeal = Math.min(fighter.maxLife - fighter.life, healAmount);
        fighter.life += actualHeal;

        soundFx.playHeal();
        this.showFloatingNumber('charDamageContainer', `+${actualHeal} HP`, 'heal');
        log.addMessage(`🧪 ${fighter.name} usou uma Poção de Vida e recuperou ${actualHeal} de HP! (${fighter.potions} restantes)`, 'heal');
    },

    executeDefend(fighter) {
        fighter.isDefending = true;
        soundFx.playDefend();
        log.addMessage(`🛡️ ${fighter.name} assumiu uma postura defensiva reforçada! (+75% de absorção no próximo ataque)`, 'system');

        // Clérigo e Cavaleiro ativam bênção divina defensiva
        if (fighter.characterClass === 'cleric') {
            this.applyStatus(fighter, 'holyShield', 2, 0, fighter);
        } else if (fighter.characterClass === 'knight') {
            this.applyStatus(fighter, 'holyShield', 1, 0, fighter);
        }
    },

    monsterTurn() {
        if (this.isGameOver) return;

        // 1. Resolução dos Efeitos de Estado no início do turno do Monstro
        const monsterStatus = this.resolveTurnStartStatus(this.fighter2, false);
        if (monsterStatus.died) {
            this.endBattle(true);
            return;
        }

        if (monsterStatus.isStunned) {
            log.addMessage(`💫 ${this.fighter2.name} tentou se mover mas desabou atordoado, perdendo a vez!`, 'system');
            this.fighter1.isDefending = false;
            this.round++;
            this.update();
            setTimeout(() => {
                this.beginPlayerTurn();
            }, 1100);
            return;
        }

        // 2. IA do Colosso Ancestral: Mecânica de Golpe Sísmico Telegrafado
        if (this.fighter2.characterClass === 'ancient-colossus') {
            if (this.fighter2.isTelegraphing) {
                this.fighter2.isTelegraphing = false;
                this.triggerShake();
                log.addMessage(`💥 O COLOSSO ANCESTRAL ESMAGA O CHÃO COM O CATACLISMO DE ROCHA!`, 'boss');
                this.executeAttack(this.fighter2, this.fighter1, true);
            } else {
                if (Math.random() < 0.35 && this.round > 1) {
                    this.fighter2.isTelegraphing = true;
                    soundFx.playBossAlert();
                    log.addMessage(`⚠️ O Colosso ergue seus punhos titânicos preparando um CATACLISMO SÍSMICO! DEFENDA-SE NO PRÓXIMO TURNO!`, 'boss');
                    this.triggerBossNotice('AVISO: CATACLISMO SÍSMICO IMINENTE!');
                } else {
                    this.executeAttack(this.fighter2, this.fighter1, false);
                }
            }
        }
        // IA do Rei dos Goblins: Bombas e Invocação
        else if (this.fighter2.characterClass === 'goblin-king') {
            const roll = Math.random();
            if (roll < 0.35) {
                log.addMessage(`💣 O Rei dos Goblins arremessa uma bomba explosiva tóxica!`, 'boss');
                this.executeAttack(this.fighter2, this.fighter1, true);
            } else {
                this.executeAttack(this.fighter2, this.fighter1, false);
            }
        }
        // IA do Xamã Goblin: Chance de Curar a si mesmo se vida < 40%
        else if (this.fighter2.characterClass === 'goblin-shaman' && (this.fighter2.life / this.fighter2.maxLife) < 0.4 && this.fighter2.potions > 0) {
            this.fighter2.potions--;
            const heal = 25;
            this.fighter2.life = Math.min(this.fighter2.maxLife, this.fighter2.life + heal);
            soundFx.playMagic();
            this.showFloatingNumber('monsterDamageContainer', `+${heal} HP MÁGICO`, 'heal');
            log.addMessage(`✨ O Xamã Goblin entoa um cântico xamânico e recupera ${heal} de HP!`, 'heal');
        }
        // Comportamento Geral de monstros
        else {
            const isDesperate = (this.fighter2.life / this.fighter2.maxLife) < 0.25;
            if (isDesperate && Math.random() < 0.35) {
                log.addMessage(`🔥 ${this.fighter2.name} ataca com fúria desesperada!`, 'monster');
                this.fighter2.attack += 2;
                this.executeAttack(this.fighter2, this.fighter1, false);
                this.fighter2.attack -= 2;
            } else {
                this.executeAttack(this.fighter2, this.fighter1, false);
            }
        }

        this.fighter1.isDefending = false;
        this.update();

        if (this.fighter1.life <= 0) {
            this.endBattle(false);
            return;
        }

        this.round++;
        this.beginPlayerTurn();
    },

    endBattle(isVictory) {
        this.isGameOver = true;
        this.setControlsDisabled(true);

        const modal = document.getElementById('gameModal');
        const modalIcon = document.getElementById('modalIcon');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');
        const modalStats = document.getElementById('modalStats');

        if (isVictory) {
            soundFx.playVictory();
            this.triggerShake();
            if (modalIcon) modalIcon.innerText = this.fighter2.isBoss ? '👑' : '🏆';
            if (modalTitle) modalTitle.innerText = this.fighter2.isBoss ? 'CHEFÃO DERROTADO!' : 'Vitória Épica!';
            if (modalDesc) modalDesc.innerText = `Você subjugou ${this.fighter2.name} e garantiu seu nome na história da Arena dos Campeões!`;
            log.addMessage(`🏆 VITÓRIA! ${this.fighter1.name} conquistou a arena!`, 'crit');

            // SISTEMA DE PROGRESSÃO: Ganho de XP e Level Up
            const xpGained = this.fighter2.xpReward || 50;
            const progResult = progressionSystem.addXp(this.fighter1.characterClass, xpGained);
            progressionSystem.applyToHero(this.fighter1);
            this.update();

            log.addMessage(`⭐ ${this.fighter1.name} recebeu +${xpGained} XP pela vitória!`, 'system');

            if (progResult.leveledUp) {
                setTimeout(() => soundFx.playLevelUp(), 400);
                this.triggerBossNotice(`⭐ LEVEL UP! NÍVEL ${progResult.newLevel}!`);
                log.addMessage(`🎉 LEVEL UP! ${this.fighter1.name} alcançou o Nível ${progResult.newLevel}! (+${progResult.levelsGained * 2} Pontos de Atributo!)`, 'crit');
            }

            if (modalStats) {
                modalStats.innerHTML = `
                    <div><strong>${this.round}</strong> Turnos</div>
                    <div><strong>+${xpGained} XP</strong> Ganho</div>
                    <div><strong>${progResult.leveledUp ? `⭐ Nível ${progResult.newLevel}!` : `Nível ${this.fighter1.level}`}</strong></div>
                    <div><strong>${this.fighter1.unspentPoints}</strong> Pts Disponíveis</div>
                `;
            }
        } else {
            soundFx.playDefeat();
            if (modalIcon) modalIcon.innerText = '💀';
            if (modalTitle) modalTitle.innerText = 'Derrota na Arena...';
            if (modalDesc) modalDesc.innerText = `${this.fighter2.name} aniquilou suas defesas. Forje novas táticas e tente novamente!`;
            log.addMessage(`💀 DERROTA! ${this.fighter1.name} caiu em combate...`, 'monster');

            if (modalStats) {
                modalStats.innerHTML = `
                    <div><strong>${this.round}</strong> Turnos</div>
                    <div><strong>${this.stats.damageDealt}</strong> Dano Causado</div>
                    <div><strong>Nível ${this.fighter1.level}</strong> Herói</div>
                    <div><strong>${this.fighter1.currentXp}/${this.fighter1.neededXp}</strong> XP Atual</div>
                `;
            }
        }

        setTimeout(() => {
            modal?.classList.add('show');
        }, 600);
    }
};
