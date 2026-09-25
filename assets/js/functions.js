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
    }
};

// ------------------------------------------------------------
// 2. CLASSES DE PERSONAGENS (POO ES6 COMPLETO)
// ------------------------------------------------------------

class Character {
    constructor(name) {
        this.name = name;
        this.type = 'hero';
        this.characterClass = 'knight';
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
// 3. FACTORY FUNCTIONS (PADRÃO FUNCIONAL COMPATÍVEL)
// ------------------------------------------------------------
const createKnight = (name) => new Knight(name);
const createSorcerer = (name) => new Sorcerer(name);
const createArcher = (name) => new Archer(name);
const createRogue = (name) => new Rogue(name);
const createCleric = (name) => new Cleric(name);
const createBerserker = (name) => new Berserker(name);

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
        this.update();
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
        const critChance = attacker.critChance || 0.18;
        const isCrit = Math.random() < critChance;
        const critMultiplier = isCrit ? 1.75 : 1.0;

        let baseAttack = attacker.attack;

        // Bônus passivo do Berserker quando perde HP
        if (attacker.characterClass === 'berserker') {
            const missingHpPct = (1 - (attacker.life / attacker.maxLife));
            baseAttack += Math.round(missingHpPct * 12);
        }

        let attackPower = baseAttack * (0.85 + Math.random() * 0.35);

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
    },

    monsterTurn() {
        if (this.isGameOver) return;

        // IA do Colosso Ancestral: Mecânica de Golpe Sísmico Telegrafado
        if (this.fighter2.characterClass === 'ancient-colossus') {
            if (this.fighter2.isTelegraphing) {
                this.fighter2.isTelegraphing = false;
                this.triggerShake();
                log.addMessage(`💥 O COLOSSO ANCESTRAL ESMAGA O CHÃO COM O CATACLISMO DE ROCHA!`, 'boss');
                this.executeAttack(this.fighter2, this.fighter1, true);
            } else {
                // 30% de chance de preparar ataque mortal
                if (Math.random() < 0.35 && this.round > 1) {
                    this.fighter2.isTelegraphing = true;
                    soundFx.playBossAlert();
                    log.addMessage(`⚠️ O Colosso ergue seus punhos titânicos preparando um CATACLISMO SÍSMICO! DEFEDA-SE NO PRÓXIMO TURNO!`, 'boss');
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
                log.addMessage(`💣 O Rei dos Goblins arremessa uma bomba de fumaça e ordena investida de seus asseclas!`, 'boss');
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
        this.isPlayerTurn = true;
        this.update();
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
        } else {
            soundFx.playDefeat();
            if (modalIcon) modalIcon.innerText = '💀';
            if (modalTitle) modalTitle.innerText = 'Derrota na Arena...';
            if (modalDesc) modalDesc.innerText = `${this.fighter2.name} aniquilou suas defesas. Forje novas táticas e tente novamente!`;
            log.addMessage(`💀 DERROTA! ${this.fighter1.name} caiu em combate...`, 'monster');
        }

        if (modalStats) {
            modalStats.innerHTML = `
                <div><strong>${this.round}</strong> Turnos</div>
                <div><strong>${this.stats.damageDealt}</strong> Dano Causado</div>
                <div><strong>${this.stats.critsLanded}</strong> Críticos</div>
                <div><strong>${this.stats.healsUsed}</strong> Poções Usadas</div>
            `;
        }

        setTimeout(() => {
            modal?.classList.add('show');
        }, 600);
    }
};
