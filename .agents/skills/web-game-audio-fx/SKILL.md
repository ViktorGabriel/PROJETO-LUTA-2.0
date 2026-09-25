---
name: web-game-audio-fx
description: Guia de geração de efeitos sonoros sintéticos para jogos na web usando Web Audio API nativa (sem arquivos de áudio externos). Use para adicionar sons de impacto, espadas, magia, cura, críticos, vitória e derrota de forma instantânea e 100% confiável.
---

# Web Game Audio FX (Web Audio API)

A Web Audio API nativa permite gerar efeitos sonoros retrô e modernos diretamente via código, sem necessidade de carregar arquivos MP3/WAV externos ou lidar com erros de 404 e latência de rede.

## 1. Inicialização do Contexto
O `AudioContext` deve ser inicializado ou resumido na primeira interação do usuário (clique em qualquer botão):

```javascript
const audio = {
    ctx: null,
    muted: false,
    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
};
```

## 2. Sintetizadores de Efeitos Comuns
- **Espada / Golpe Físico (Slash/Hit)**: Rápido white noise ou oscilador sawtooth com queda de frequência abrupta (150Hz para 40Hz em 0.15s).
- **Magia Arcana (Spell/Magic)**: Oscilador sine com modulação em frequência rápida (frequências harmônicas 440Hz -> 880Hz -> 1320Hz com eco/delay).
- **Impacto Pesado / Explosão**: Som grave sawtooth de 80Hz com distorção e envelope de ganho exponencial de 0.3s.
- **Cura / Poção**: Arpeggio ascendente de notas suaves (Sine 523Hz -> 659Hz -> 783Hz).
- **Crítico**: Dois tons rápidos com pitch bend agudo para dar sensação de poder.
- **Vitória (Fanfarra)**: Sucessão triunfal de acordes maiores.
- **Derrota**: Tom descendente melancólico.
