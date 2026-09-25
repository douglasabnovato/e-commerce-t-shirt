# DECISÕES — Registro de decisões do projeto

> Formato de cada decisão: Contexto · Decisão · Alternativas consideradas · Motivo · Status · Data
> Status: ✅ aprovada · 🟨 em análise · ❌ descartada

---

## D1 — Base técnica do projeto
- **Contexto:** existia uma tentativa anterior deste mesmo teste (mar/2026) com CRUD parcial em Laravel 10 + Vue 3, e dois projetos de 2023 do mesmo domínio (e-commerce de moda).
- **Decisão:** usar a tentativa anterior como base técnica, adaptando só os arquivos úteis. Os projetos de 2023 servem de inspiração para funcionalidades extras, sem reaproveitar código.
- **Alternativas:** começar tudo do zero; copiar o projeto anterior inteiro.
- **Motivo:** economiza tempo nas partes que já funcionavam (migration, validação, upload) sem herdar documentação incorreta nem código desatualizado.
- **Status:** ✅ aprovada · 25/09/2026

## D2 — Prioridade do escopo
- **Contexto:** prazo de 48h para 15 exercícios.
- **Decisão:** todos os requisitos obrigatórios têm prioridade absoluta. Extras só entram depois.
- **Alternativas:** desenvolver obrigatórios e extras em paralelo.
- **Motivo:** garantir a entrega completa do que é avaliado.
- **Status:** ✅ aprovada · 25/09/2026

## D3 — Página "Teste Técnico" na aplicação
- **Contexto:** as respostas teóricas precisam estar documentadas e o avaliador deve conseguir lê-las com facilidade.
- **Decisão:** criar uma página no menu da aplicação com todas as respostas, índice 1–15 e âncoras por exercício. A fonte única são os arquivos `docs/respostas/*.md` do repositório. A página não depende do backend.
- **Alternativas:** respostas só em arquivos no GitHub; texto duplicado na página e no repositório.
- **Motivo:** o avaliador lê tudo pelo link de produção, sem abrir o GitHub; fonte única evita divergência; a página demonstra Vue em uso real.
- **Status:** ✅ aprovada · 25/09/2026

## D4 — Menu do header
- **Decisão:** [Logo] Camisetas · Moletons · Acessórios | Teste Técnico | Entrar/Admin | Sacola (n).
- **Motivo:** navegação de loja de moda com acesso direto às entregas do teste.
- **Status:** ✅ aprovada · 25/09/2026

## D5 — README
- **Decisão:** README com descrição do projeto, arquitetura e plano de ação em checklist. Um item só recebe [x] quando estiver pronto no código.
- **Motivo:** documentação que corresponde exatamente ao que foi entregue.
- **Status:** ✅ aprovada · 25/09/2026

## D6 — Autenticação
- **Decisão:** autenticação real no CRUD (exercício 10), usando a mesma estratégia descrita na resposta teórica do exercício 2.
- **Motivo:** coerência entre o que é explicado e o que é implementado.
- **Status:** ✅ aprovada · 25/09/2026 (estratégia técnica: ver D10)

## D7 — Escopo em camadas
- **Decisão:**
  - Camada 0: obrigatórios.
  - Camada 1: página Teste Técnico, vitrine por categoria, paginação.
  - Camada 2: produto com tamanho, adicionar à sacola, cupom, sacola persistida.
  - O checkout continua iniciando com itens fixos, conforme o exercício 12.
- **Status:** ✅ aprovada · 25/09/2026

## D8 — Criação do projeto
- **Decisão:** backend e frontend criados pelos comandos oficiais. Arquivos da tentativa anterior entram de forma seletiva.
- **Motivo:** versões atuais e histórico de commits limpo.
- **Status:** ✅ aprovada · 25/09/2026

## D9 — Versionamento
- **Decisão:** commits pequenos, um por tarefa, no padrão convencional (`docs:`, `feat:`, `fix:`, `chore:`, `test:`, `refactor:`).
- **Status:** ✅ aprovada · 25/09/2026

---

## Decisões técnicas pendentes

| ID | Tema | Status |
|---|---|---|
| D10 | Estratégia de autenticação (Sanctum SPA com cookie + CSRF ou token Bearer) | 🟨 |
| D11 | Versões (Laravel, Vue Options ou Composition API) | 🟨 |
| D12 | Framework CSS e uso do LESS | 🟨 |
| D13 | Renderização dos `.md` na página Teste Técnico sem backend | 🟨 |
| D14 | Estrutura do repositório e estratégia de branches | 🟨 |
| D15 | Deploy (front estático + API com imagens persistentes) | 🟨 |