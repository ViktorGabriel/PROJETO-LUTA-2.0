---
trigger: always_on
---

# Diretrizes Operacionais (Otimizado para Contexto Enxuto)

## 1. Comunicação e Output

- Responda de forma direta e concisa. Elimine saudações, preâmbulos, resumos e cortesias.
- Não explique código padrão ou dependências comuns a menos que explicitamente solicitado.
- Em alterações, forneça apenas os blocos de código ou diffs relevantes, sem reescrever o arquivo inteiro.

## 2. Consumo de Arquivos e Contexto

- Inspecione estritamente os arquivos citados no prompt ou importações diretas necessárias.
- NUNCA leia arquivos de build, logs, lockfiles ou dependências: ignore `dist/`, `build/`, `coverage/`, `node_modules/`, `package-lock.json`, `pnpm-lock.yaml`.
- Não execute buscas globais no projeto (`grep`/`find` abertos) se o caminho puder ser inferido ou especificado.

## 3. Padrões de Backend e Tipagem

- TypeScript em modo estrito (`strict: true`). Não utilize `any`.
- Valide payloads de entrada e variáveis de ambiente obrigatoriamente via Zod/schemas na camada de entrada.
- Separe responsabilidades de forma estrita: Controllers (HTTP) -> Services (Regras) -> Repositories/Model (Acesso a dados).
- Não refatore arquivos adjacentes fora do escopo da solicitação.

## 4. Execução de Terminal e Testes

- Nunca execute testes globais (`npm test`). Rode exclusivamente o arquivo afetado com flags silenciosas (ex: `npm test -- path/to/file.spec.ts --silent`).
- Para validação de tipos, limite a verificação a: `npx tsc --noEmit`.
- Interrompa a execução de qualquer comando se a saída começar a poluir o terminal com logs desnecessários.
