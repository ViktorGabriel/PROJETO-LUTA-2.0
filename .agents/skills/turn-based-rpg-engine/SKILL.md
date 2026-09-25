---
name: turn-based-rpg-engine
description: Guia de arquitetura, mecânicas de combate e balanceamento para jogos de RPG por turnos em JavaScript. Use ao implementar lógica de combate, cálculo de dano, inteligência artificial de monstros, habilidades especiais e gerenciamento de estado da batalha.
---

# Turn-Based RPG Engine Architecture

Este guia define as melhores práticas para desenvolvimento e evolução de motores de RPG por turnos em JavaScript Vanilla e Moderno.

## 1. Princípios de Arquitetura de Combate
- **Separação de Camadas**: Mantenha o estado dos lutadores (`model`), as regras de cálculo e turnos (`engine/logic`) e a renderização no DOM (`view`) desacoplados.
- **Factory Functions**: Use fábricas de personagens (`createKnight`, `createSorcerer`, `createMonster`) com protótipos imutáveis base e atributos específicos (`life`, `maxLife`, `attack`, `defense`, `speed`, `avatar`, `skills`).
- **Determinismo com Variância**:
  - Dano base = `Atacante.attack * random(0.8, 1.3)`.
  - Redução de defesa = `Defensor.defense * random(0.6, 1.1)`.
  - Dano real = `Math.max(1, Math.round(danoBase - reducaoDefesa))`.
  - Chance de Crítico: ~15% de chance para 1.8x de dano.
  - Chance de Esquiva: ~10% de chance de mitigar todo o dano.

## 2. Fluxo de Turnos & IA de Inimigos
1. **Turno do Jogador**: Ações habilitadas (Ataque Básico, Habilidade Especial, Poção de Cura, Defesa).
2. **Execução da Ação**: Cálculo de dano, aplicação no alvo, emissão de evento de som e animação.
3. **Verificação de Vida**: Se HP <= 0, disparar evento de Derrota/Vitória e desabilitar controles.
4. **Turno do Oponente (IA)**:
   - Adicionar delay humanizado (ex: 800ms a 1200ms) para dar tempo de leitura ao jogador.
   - Decisão da IA: avaliar vida atual; se baixa, chance de cura ou golpe desesperado; caso contrário, ataque normal ou golpe pesado.
   - Retorno do controle ao jogador.

## 3. Sistema de Registro (Combat Log)
- Cada ação deve registrar uma mensagem contextualizada:
  - Ataque bem-sucedido: `⚔️ [Atacante] causou X de dano a [Defensor]!`
  - Crítico: `💥 GOLPE CRÍTICO! [Atacante] causou X de dano devastador!`
  - Esquiva: `💨 [Defensor] esquivou com agilidade do ataque de [Atacante]!`
  - Cura: `🧪 [Personagem] usou uma Poção e recuperou X de HP!`
- Auto-scroll automático para a última mensagem.
