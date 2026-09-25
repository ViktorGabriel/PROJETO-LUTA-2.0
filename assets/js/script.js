/* ============================================================
   RPG BATTLE ARENA - INICIALIZAÇÃO E CONTROLE DA APLICAÇÃO
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Referências do DOM
    const heroSelect = document.getElementById('heroSelect');
    const monsterSelect = document.getElementById('monsterSelect');
    const resetBattleBtn = document.getElementById('resetBattleBtn');
    const modalPlayAgainBtn = document.getElementById('modalPlayAgainBtn');
    const soundToggle = document.getElementById('soundToggle');
    const clearLogBtn = document.getElementById('clearLogBtn');
    const gameModal = document.getElementById('gameModal');

    // Botões visuais de seleção rápida com thumbnail
    const heroPickerButtons = document.querySelectorAll('#heroPicker .picker-btn');
    const monsterPickerButtons = document.querySelectorAll('#monsterPicker .picker-btn');

    // Leitura de parâmetros de URL para integração com lore.html
    const urlParams = new URLSearchParams(window.location.search);
    const paramHero = urlParams.get('hero');
    const paramMonster = urlParams.get('monster');

    if (paramHero && heroSelect) {
        heroSelect.value = paramHero;
    }
    if (paramMonster && monsterSelect) {
        monsterSelect.value = paramMonster;
    }

    // Estado da partida atual
    let currentHero = null;
    let currentMonster = null;

    // Fábrica de Herói com base na seleção
    function getSelectedHero() {
        const choice = heroSelect ? heroSelect.value : 'knight';
        switch (choice) {
            case 'sorcerer':
                return createSorcerer('Viktor');
            case 'archer':
                return createArcher('Lyra');
            case 'rogue':
                return createRogue('Sombra');
            case 'cleric':
                return createCleric('Ildor');
            case 'berserker':
                return createBerserker('Krag');
            case 'knight':
            default:
                return createKnight('Viktor');
        }
    }

    // Fábrica de Monstro / Chefe com base na seleção
    function getSelectedMonster() {
        const choice = monsterSelect ? monsterSelect.value : 'bigMonster';
        switch (choice) {
            case 'littleMonster':
                return createLittleMonster();
            case 'skeletonArcher':
                return createSkeletonArcher();
            case 'goblinShaman':
                return createGoblinShaman();
            case 'wildWolf':
                return createWildWolf();
            case 'mimic':
                return createMimic();
            case 'goblinKing':
                return createGoblinKing();
            case 'ancientColossus':
                return createAncientColossus();
            case 'bigMonster':
            default:
                return createBigMonster();
        }
    }

    // Sincroniza o visual dos seletores de thumbnail
    function updatePickerButtons() {
        const heroVal = heroSelect ? heroSelect.value : 'knight';
        heroPickerButtons.forEach(btn => {
            if (btn.dataset.value === heroVal) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const monsterVal = monsterSelect ? monsterSelect.value : 'bigMonster';
        monsterPickerButtons.forEach(btn => {
            if (btn.dataset.value === monsterVal) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Inicialização da partida
    function startNewBattle() {
        if (gameModal) {
            gameModal.classList.remove('show');
        }

        updatePickerButtons();

        currentHero = getSelectedHero();
        currentMonster = getSelectedMonster();

        stage.start(
            currentHero,
            currentMonster,
            document.querySelector('#char'),
            document.querySelector('#monster')
        );
    }

    // Eventos nos botões de miniatura de heróis
    heroPickerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.value;
            if (heroSelect) {
                heroSelect.value = val;
            }
            startNewBattle();
        });
    });

    // Eventos nos botões de miniatura de monstros
    monsterPickerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.value;
            if (monsterSelect) {
                monsterSelect.value = val;
            }
            startNewBattle();
        });
    });

    // Eventos nos selects
    heroSelect?.addEventListener('change', () => {
        startNewBattle();
    });

    monsterSelect?.addEventListener('change', () => {
        startNewBattle();
    });

    // Botões de reinício
    resetBattleBtn?.addEventListener('click', () => {
        startNewBattle();
    });

    modalPlayAgainBtn?.addEventListener('click', () => {
        startNewBattle();
    });

    // Controle de Som Mute/Unmute
    soundToggle?.addEventListener('click', () => {
        const isMuted = soundFx.toggleMute();
        const iconSpan = soundToggle.querySelector('.sound-icon');
        if (iconSpan) {
            iconSpan.innerText = isMuted ? '🔇' : '🔊';
        }
        soundToggle.title = isMuted ? 'Ativar Som' : 'Desativar Som';
    });

    // Limpar Log
    clearLogBtn?.addEventListener('click', () => {
        log.clear();
    });

    // Início imediato da primeira partida
    startNewBattle();
});
