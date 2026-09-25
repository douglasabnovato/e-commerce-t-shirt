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


## D12 · Renderização das respostas na página Teste Técnico
- **Contexto:** a página Teste Técnico é o entregável principal (D3) e não pode depender do backend.
- **Opção escolhida:** os arquivos `docs/respostas/*.md` e `15.sql` são importados como texto no build do Vite (`import.meta.glob` com `?raw`) e renderizados com `markdown-it`.
- **Alternativas:** servir os arquivos por endpoint do Laravel; buscar por `fetch` em `public/`.
- **Motivo:** o conteúdo vai no bundle, e a página funciona mesmo com a API fora do ar. A fonte continua única (`docs/respostas/`).

## D13 · Framework CSS
- **Requisito (não é decisão):** personalização em LESS é obrigatória pelo enunciado.
- **Decisão:** não usar framework CSS. Os estilos são escritos em LESS próprio (tokens de cor, tipografia e espaçamento; mixins de foco e breakpoints; reset).
- **Alternativas:** Bootstrap 5 (escrito em Sass, deixaria o LESS como camada artificial); Material Design Lite (descontinuado).
- **Motivo:** o LESS aparece de forma real no código, e o controle total do CSS garante os critérios de acessibilidade (foco visível, contraste, rótulos).

## D14 · Deploy em origem única
- **Contexto:** a autenticação usa cookie de sessão (D11), que exige mesma origem ou configuração de domínios compartilhados.
- **Opção escolhida:** em produção, o Laravel serve a API e o build do Vue no mesmo domínio. Em desenvolvimento, o Vite faz proxy de `/api` e `/sanctum` para o Laravel. Imagens via `Storage` em disco persistente (trocável para S3/R2 por configuração). MySQL gerenciado.
- **Alternativas:** front estático em um host e API em outro (exige domínio próprio, CORS com credenciais e SameSite).
- **Motivo:** elimina a principal fonte de falha de autenticação SPA e reduz o deploy a um único serviço.

## D16 · Envio do checkout
- **Contexto:** o ex. 12 exige loading, mensagem de sucesso e `console.log` do objeto final; não exige API de pedidos.
- **Opção escolhida:** envio simulado num serviço isolado (`checkoutService`), com latência artificial. A busca de CEP é real via `cep-promise`.
- **Alternativas:** endpoint `POST /api/pedidos` no Laravel.
- **Motivo:** atende ao requisito sem acrescentar ~2h ao bloco de maior risco. O ponto de troca por uma API real fica isolado em um arquivo.

## D18 · Deploy esqueleto
- **Contexto:** o deploy é o maior risco técnico (host, PHP, banco, cookie, imagens).
- **Opção escolhida:** subir uma versão mínima em produção por volta de H8–H10 (`developer-mvp → main`), além do deploy final.
- **Alternativas:** deploy único no fim, com 3–4h reservadas.
- **Motivo:** problemas de infraestrutura são descobertos com mais de 30h de margem, e o deploy final vira uma atualização.