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

    // ============================================================
    // CONTROLES DO MODAL DE ATRIBUTOS (PROGRESSÃO DE NÍVEL)
    // ============================================================
    const attributeModal = document.getElementById('attributeModal');
    const btnOpenAttributes = document.getElementById('btnOpenAttributes');
    const btnCloseAttributes = document.getElementById('btnCloseAttributes');
    const btnResetAttributes = document.getElementById('btnResetAttributes');
    const attrModalHeroName = document.getElementById('attrModalHeroName');
    const attrPointsAvailable = document.getElementById('attrPointsAvailable');

    function renderAttributeModal() {
        if (!currentHero) return;
        const prog = progressionSystem.getHeroProgress(currentHero.characterClass);

        if (attrModalHeroName) {
            attrModalHeroName.innerText = `Atributos: ${currentHero.name} (${currentHero.classTag})`;
        }
        if (attrPointsAvailable) {
            attrPointsAvailable.innerText = prog.unspentPoints;
        }

        const valStr = document.getElementById('valStr');
        const valDef = document.getElementById('valDef');
        const valVit = document.getElementById('valVit');
        const valAgi = document.getElementById('valAgi');

        if (valStr) valStr.innerText = `+${prog.attributes.str}`;
        if (valDef) valDef.innerText = `+${prog.attributes.def}`;
        if (valVit) valVit.innerText = `+${prog.attributes.vit * 8} HP (${prog.attributes.vit})`;
        if (valAgi) valAgi.innerText = `+${prog.attributes.agi * 2}% (${prog.attributes.agi})`;

        // Habilita ou desabilita botões de adição
        const canAdd = prog.unspentPoints > 0;
        document.querySelectorAll('.btn-add-stat').forEach(btn => {
            btn.disabled = !canAdd;
        });
    }

    btnOpenAttributes?.addEventListener('click', () => {
        renderAttributeModal();
        attributeModal?.classList.add('show');
    });

    btnCloseAttributes?.addEventListener('click', () => {
        attributeModal?.classList.remove('show');
    });

    attributeModal?.addEventListener('click', (e) => {
        if (e.target === attributeModal) {
            attributeModal.classList.remove('show');
        }
    });

    document.querySelectorAll('.btn-add-stat').forEach(btn => {
        btn.addEventListener('click', () => {
            const stat = btn.dataset.stat;
            if (currentHero && stat) {
                const ok = progressionSystem.allocatePoint(currentHero.characterClass, stat);
                if (ok) {
                    progressionSystem.applyToHero(currentHero);
                    soundFx.playDefend(); // som suave de alocação
                    renderAttributeModal();
                    stage.update();
                }
            }
        });
    });

    btnResetAttributes?.addEventListener('click', () => {
        if (currentHero) {
            progressionSystem.resetPoints(currentHero.characterClass);
            // Re-instancia o herói para restaurar atributos base e reaplicar
            currentHero = getSelectedHero();
            stage.fighter1 = currentHero;
            soundFx.playHeal();
            renderAttributeModal();
            stage.update();
        }
    });

    // Início imediato da primeira partida
    startNewBattle();
});
