---
name: game-ui-animations
description: Padrões e técnicas de animação e UI de combate para jogos web em HTML/CSS/JS. Use para criar efeitos de screenshake, números flutuantes de dano (floating damage numbers), animações de ataque, barras de HP dinâmicas e transições visuais.
---

# Game UI & Combat Animations

Guia para implementar micro-interações, efeitos de impacto e feedback visual cinematográfico para jogos de combate no navegador.

## 1. Números Flutuantes de Dano (Floating Damage Numbers)
- Crie um elemento dinâmico `<span class="floating-damage">` sobre o card do lutador que recebeu o impacto.
- Estilos essenciais:
  - Normal: Cor amarela/branca com sombra escura.
  - Crítico: Cor vermelha/laranja pulsante, tamanho maior (+40%) com ícone `💥`.
  - Cura: Cor verde esmeralda com ícone `+` ou `🧪`.
  - Esquiva / Miss: Cor cinza ou azulada "ESQUIVOU!".
- Animação CSS (`@keyframes floatUpFade`):
  - Inicia em `transform: translateY(0) scale(0.8)`, sobe para `translateY(-40px) scale(1.1)` e desaparece com `opacity: 0` em 800ms.
  - Remove o elemento do DOM via `setTimeout` ou `animationend`.

## 2. Efeitos de Impacto (Screen Shake & Flash)
- **Screen Shake**: Adicione uma classe `.shake` na arena de batalha por 300ms durante ataques pesados ou críticos.
- **Hit Flash**: Adicione `.hit-flash` no card do personagem recebendo dano (filtro de brilho rápido ou overlay avermelhado instantâneo).
- **Attack Dash**: Ao desferir um golpe, o atacante avança em direção ao adversário (`transform: translateX(30px)`) e recua suavemente.

## 3. Barras de Vida Dinâmicas
- Transição CSS: `transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)`.
- Cores dinâmicas de acordo com porcentagem:
  - > 50%: Gradiente Verde Esmeralda (`#10b981` a `#059669`)
  - 25% a 50%: Gradiente Âmbar/Amarelo (`#f59e0b` a `#d97706`)
  - < 25%: Gradiente Vermelho Sangue com pulso (`#ef4444` a `#dc2626`)
