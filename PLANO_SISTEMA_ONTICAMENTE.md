# PLANO DO SISTEMA – ONTICAMENTE (v1.4)

## 1. Objetivo
Sistema pessoal de estudos em Ontopsicologia, com foco em centralizar disciplinas, livros, anotações, IA assistente e funcionalidades dinâmicas.

## 2. Tecnologias
- **Frontend**: Next.js + React
- **Estilização**: Tailwind CSS (com paleta vibrante)
- **Backend**: Supabase (Autenticação e Banco de Dados)
- **Armazenamento**: Supabase Storage (para uploads futuros)

## 3. Estrutura Principal
- **Login** (acesso único com Supabase Auth)
- **Dashboard (/inicio)** (resumo, últimos estudados, links rápidos)
- **Disciplinas** (CRUD completo + arquivamento)
- **Biblioteca** (upload e leitura de livros)
- **Dicionário** (módulo fixo com termos da Ontopsicologia)
- **Professores** (módulo futuro para FOIL)
- **IA Assistente** (módulo futuro flutuante, integrado ao acervo)

## 4. Paleta de Cores Oficial
- Azul (#2563EB)
- Laranja (#F97316)
- Verde (#16A34A)
- Amarelo (#EAB308)
- Branco (#FFFFFF)

## 5. Responsividade
- Design adaptável para notebooks, tablets e iPhone 15 Pro Max.
- Menu lateral fixo em desktop e retrátil (hamburger) no mobile.

## 6. Progresso Atual
- Login 100% finalizado (com logout).
- Dashboard inicial pronto.
- CRUD de Disciplinas e Disciplinas Arquivadas prontos.
- Paleta vibrante aplicada (gradientes e botões destacados).
- Estrutura de Biblioteca criada (sem uploads ainda).

## 7. Próximos Passos
- Completar módulo Biblioteca (CRUD + upload).
- Criar Dicionário.
- Integrar IA flutuante.
- Implementar Lousa Digital.
- Adicionar transcrição de aulas.

## v1.8
- Adicionados botões Acessar/Editar em Disciplinas.
- Criada rota /lousa/[id] (placeholder da lousa).
- Próximos passos: Implementar Lousa Digital, IA flutuante e Dicionário com tooltips.
