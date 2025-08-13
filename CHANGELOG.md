# Changelog - Onticamente

## [v6.41] - 2025-07-26
### Alterações
- Adicionado `framer-motion@11.2.12` para corrigir erro no ChatPanel.tsx.
- `package-lock.json` atualizado.
# Changelog - Onticamente

## [v6.40] - 2025-07-26
### Alterações
- Removido `"type": "module"` do `package.json` para corrigir erro com loaders CSS.
- Preparado para gerar `package-lock.json` estável.
# Changelog - Onticamente

## [v6.39] - 2025-07-26
### Alterações
- Corrigida versão do Fabric.js para 5.3.0 (última versão estável disponível no NPM).
- Garantido que `npm install` funcione sem erro de versão inexistente.
# Changelog - Onticamente

## [v6.38] - 2025-07-26
### Alterações
- Preparado para deploy na Vercel com Next 14.x LTS.
- Dependências travadas em versões estáveis (sem betas).
- Pronto para integração com Supabase.
- Gerar package-lock.json limpo recomendado após npm install.
# Changelog - Onticamente

## [v6.37] - 2025-07-26
### Alterações
- Adicionada seção `overrides` no package.json para forçar uso de versões modernas de pacotes antigos (`glob`, `rimraf`, `npmlog`, etc.).
- Redução máxima de warnings do `npm install`.
- Pronto para gerar `package-lock.json` limpo.
# Changelog - Onticamente

## [v6.36] - 2025-07-26
### Alterações
- Removido ESLint e dependências associadas para evitar pacotes obsoletos.
- Mantidas apenas dependências essenciais (Next.js, React, Tailwind, Supabase, Fabric, jsPDF, Lucide).
- Sistema pronto para instalação rápida e sem `npm WARN deprecated`.
# Changelog - Onticamente

## [v6.35] - 2025-07-26
### Ajustes
- Corrigida incompatibilidade do `eslint@9.x` com `eslint-config-next`.
- Ajustado para `eslint@8.57.0` (versão compatível com Next.js 14).
- Garantido que `npm install` funcione sem `--force` e sem erros de dependência.
# Changelog - Onticamente

## [v6.34] - 2025-07-26
### Alterações
- Recriado `package.json` com dependências modernas, removendo pacotes obsoletos (`inflight`, `npmlog`, `gauge`).
- Atualização de todas as libs para versões sem `npm WARN deprecated`.
- Limpeza completa para evitar vulnerabilidades e problemas de memória.
# Changelog - Onticamente

## [v6.33] - 2025-07-26
### Limpeza total de dependências
- Todas as dependências foram atualizadas para as versões estáveis mais recentes.
- Removidos pacotes depreciados que causavam warnings (`inflight`, `npmlog`, etc.).
- ESLint atualizado para ^9.x (compatível com Node 18+).
- `package.json` reorganizado e scripts ajustados.

# Changelog - Onticamente

## [v6.32] - 2025-07-26
### Atualizações
- Dependências atualizadas e pacotes deprecated removidos/substituídos.
- Substituído `@supabase/auth-helpers-nextjs` por `@supabase/ssr`.
- Atualizado ESLint para evitar avisos.
- Código base estabilizado com suporte a ALT/ALT-GR, exportações e editor de texto+canvas.

## [v6.31] - Correções principais
- Correção do bug após CTRL-C / CTRL-V.
- Implementada máquina de estados (text | draw | objects).
- Exportação PDF/Imagem e limpeza de canvas.

## [v6.29 - v6.30]
- Adição de ferramentas de pincel, cor, espessura e botão Limpar Canvas.
- Paleta de cores no editor de texto.

## [v6.0 - v6.28]
- Sistema base (login, menu, disciplinas, lousa).
- Integração inicial do Fabric.js e editor de texto.
- Estrutura do projeto Next.js + React com Supabase.
