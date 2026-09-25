# DECISÕES — Registro de decisões do projeto

> Formato de cada decisão: Contexto · Decisão · Alternativas consideradas · Motivo · Status · Data
> Status: ✅ aprovada · 🟨 em análise · ❌ descartada
> Regra: o que o enunciado determina é requisito e fica em `docs/REQUISITOS.md`. Aqui ficam apenas as escolhas que o enunciado deixa em aberto.

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
- **Contexto:** as respostas precisam estar documentadas e o avaliador deve conseguir lê-las com facilidade.
- **Decisão:** criar uma página no menu da aplicação com todas as respostas, índice 1–15 e âncoras por exercício. A fonte única são os arquivos de `docs/respostas/`. A página não depende do backend.
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

## D6 — Autenticação real no exercício 10
- **Decisão:** autenticação real no CRUD (exercício 10), usando a mesma estratégia descrita na resposta do exercício 2.
- **Motivo:** coerência entre o que é explicado e o que é implementado.
- **Status:** ✅ aprovada · 25/09/2026 (estratégia técnica: D10)

## D7 — Escopo em camadas
- **Decisão:**
  - Camada 0: obrigatórios.
  - Camada 1: página Teste Técnico, vitrine por categoria, paginação.
  - Camada 2: produto com tamanho, adicionar à sacola, cupom, sacola persistida.
  - O checkout continua iniciando com itens fixos, conforme o exercício 12.
- **Situação da entrega:** camadas 0 e 1 concluídas; a camada 2 fica fora desta entrega.
- **Status:** ✅ aprovada · 25/09/2026

## D8 — Criação do projeto
- **Decisão:** backend e frontend criados pelos comandos oficiais. Arquivos da tentativa anterior entram de forma seletiva.
- **Motivo:** versões atuais e histórico de commits limpo.
- **Status:** ✅ aprovada · 25/09/2026

## D9 — Versionamento
- **Decisão:** commits pequenos, um por tarefa, no padrão convencional (`docs:`, `feat:`, `fix:`, `chore:`, `test:`, `refactor:`).
- **Observação:** commits anteriores a esta decisão estão fora do padrão; o histórico já publicado não é reescrito.
- **Status:** ✅ aprovada · 25/09/2026

## D10 — Estratégia de autenticação
- **Contexto:** o exercício 10 exige que apenas usuários autenticados modifiquem produtos, e o exercício 2 pede um fluxo seguro de login e armazenamento de tokens. As duas coisas precisam dizer o mesmo (D6).
- **Decisão:** Laravel Sanctum em modo SPA: autenticação por sessão com cookie HttpOnly e proteção CSRF (`/sanctum/csrf-cookie`).
- **Alternativas:** token Bearer guardado em `localStorage` (legível por qualquer script em caso de XSS); token Bearer apenas em memória (perdido ao recarregar a página).
- **Motivo:** o JavaScript nunca tem acesso à credencial, e o CSRF é tratado pelo próprio framework.
- **Notas de implementação:**
  - O trait `HasApiTokens` sugerido pelo `install:api` não é adicionado ao `User`: ele serve à autenticação por token Bearer. A tabela `personal_access_tokens` fica sem uso.
  - Ativar `statefulApi()` em `bootstrap/app.php` e incluir `localhost:5173` em `SANCTUM_STATEFUL_DOMAINS`.
  - Com o proxy do Vite em desenvolvimento e a origem única em produção (D15), o navegador vê uma origem só: não há CORS a configurar. O cliente axios mantém `withCredentials` e `withXSRFToken` ativos para enviar o cookie de sessão e o cabeçalho `X-XSRF-TOKEN` de forma explícita.
  - `SANCTUM_STATEFUL_DOMAINS`: `localhost:5173` e `localhost:8000` no ambiente local; `douglasabnovato.alwaysdata.net` em produção.
- **Status:** ✅ aprovada · 25/09/2026

## D11 — Versões e stack
- **Contexto:** a tentativa anterior usava Laravel 10, sem suporte de segurança, e Vue com Options API.
- **Decisão:**
  - Backend: Laravel 12 (`^12.0`), compatível com o PHP 8.2 do ambiente local; produção em PHP 8.4.
  - Frontend: Vue 3.5 com Composition API (`<script setup>`), Vue Router, Pinia, Vite, em JavaScript.
  - Ferramentas: Vitest, ESLint e Prettier.
- **Alternativas:** Laravel 10 com PHP 8.1; Vue com Options API; TypeScript.
- **Motivo:** versões com suporte. A Composition API e a separação de regras em funções puras (`utils/checkout/`) permitem testar validação, máscaras e montagem do pedido sem a tela. JavaScript evita horas de tipagem que o teste não pede, e o código reaproveitado já está em JS.
- **Status:** ✅ aprovada · 25/09/2026

## D12 — Framework CSS
- **Requisito (não é decisão):** o enunciado exige personalização de estilos em LESS.
- **Decisão:** não usar framework CSS. Os estilos são escritos em LESS próprio: variáveis de cor, tipografia e espaçamento; mixins de foco visível e de breakpoints; reset.
- **Alternativas:** Bootstrap 5 (escrito em Sass, o LESS viraria camada artificial); Material Design Lite (descontinuado).
- **Motivo:** o LESS aparece de forma real no código, e o controle total do CSS sustenta os critérios de acessibilidade (foco visível, contraste, rótulos).
- **Status:** ✅ aprovada · 25/09/2026

## D13 — Renderização das respostas na página Teste Técnico
- **Contexto:** a página Teste Técnico é o entregável principal (D3) e não pode depender do backend.
- **Decisão:** os arquivos de `docs/respostas/` (`.md` e o `15.txt`) são importados como texto no build do Vite (`import.meta.glob` com `?raw`). O markdown é renderizado com `markdown-it`; o `.txt` é exibido como bloco de código.
- **Alternativas:** servir os arquivos por endpoint do Laravel; buscar por `fetch` em `public/`.
- **Motivo:** o conteúdo vai no bundle, e a página funciona mesmo com a API fora do ar. A fonte continua única.
- **Status:** ✅ aprovada · 25/09/2026

## D14 — Estrutura do repositório e branches
- **Contexto:** projeto individual, com prazo de 48h, avaliado também pelas boas práticas de versionamento.
- **Decisão:**
  - Monorepo: `backend/`, `frontend/` e `docs/`.
  - `feature/fullstack`: desenvolvimento.
  - `developer-mvp`: integração e testes; recebe a `feature/fullstack` a cada checkpoint (H12, H24, H36), após a conferência do checklist.
  - `main`: produção; recebe a `developer-mvp` apenas nos deploys.
- **Alternativas:** commits direto na `main`; uma branch por bloco de trabalho.
- **Motivo:** separa o que está em construção, o que está validado e o que está publicado. A `main` sempre corresponde ao link de produção.
- **Status:** ✅ aprovada · 25/09/2026

## D15 — Deploy em origem única
- **Contexto:** a autenticação usa cookie de sessão (D10), que exige mesma origem ou domínios compartilhados.
- **Decisão:** em produção, o Laravel serve a API e o build do Vue no mesmo domínio. Em desenvolvimento, o Vite faz proxy de `/api`, `/sanctum` e `/storage` para o Laravel. Imagens via `Storage` em disco persistente (trocável para S3/R2 por configuração). Banco MySQL gerenciado.
- **Alternativas:** front estático em um host e API em outro (exige domínio próprio, CORS com credenciais e ajuste de SameSite).
- **Motivo:** elimina a principal fonte de falha da autenticação SPA e reduz o deploy a um único serviço.
- **Status:** ✅ aprovada · 25/09/2026 (host definido na D20)

## D16 — Envio do checkout
- **Contexto:** o exercício 12 exige loading, mensagem de sucesso e `console.log` do objeto final; não exige API de pedidos.
- **Decisão:** envio simulado num serviço isolado (`frontend/src/services/checkout.js`, função `enviarPedido`), com latência artificial e número de pedido gerado no front. A busca de CEP é real, via `cep-promise`.
- **Alternativas:** endpoint `POST /api/pedidos` no Laravel.
- **Motivo:** atende ao requisito sem acrescentar ~2h ao bloco de maior risco. A troca por uma API real fica isolada em um arquivo.
- **Status:** ✅ aprovada · 25/09/2026

## D17 — Testes
- **Contexto:** boas práticas são avaliadas, e o prazo não permite cobertura ampla.
- **Decisão:** testes de feature no CRUD do exercício 10 (401 sem login, sucesso com login, 422 com dados inválidos) e testes unitários com Vitest nas validações do exercício 12.
- **Situação atual:**
  - Backend: 21 testes (`ProdutoApiTest`, `AutenticacaoTest`, `SpaTest` e os exemplos do Laravel), em SQLite em memória.
  - Frontend: 21 testes (validações, máscaras, sacola, serviço de produtos e montagem das respostas).
- **Alternativas:** sem testes; testes end-to-end.
- **Motivo:** cobre os dois pontos de maior risco pelo menor custo.
- **Status:** ✅ aprovada · 25/09/2026

## D18 — Deploy esqueleto
- **Contexto:** o deploy é o maior risco técnico (host, PHP, banco, cookie, imagens).
- **Decisão:** publicar uma versão mínima por volta de H8–H10 (`developer-mvp → main`), além do deploy final.
- **Alternativas:** deploy único no fim, com 3–4h reservadas.
- **Motivo:** problemas de infraestrutura aparecem com mais de 30h de margem, e o deploy final vira uma atualização.
- **Status:** ✅ aprovada · 25/09/2026 · executada em 25/09/2026 (Bloco A2): https://douglasabnovato.alwaysdata.net

## D19 — Banco de dados e localização
- **Contexto:** o enunciado trata de MySQL (exercícios 5 e 14); o Laravel 12 vem configurado com SQLite e locale em inglês.
- **Decisão:**
  - MySQL em todos os ambientes (local: MariaDB 10.4 do XAMPP; produção: MySQL gerenciado). O `.env.example` passa a refletir essa configuração.
  - Locale `pt_BR` no Laravel (`APP_LOCALE`, `APP_FAKER_LOCALE`) e no faker-js do frontend.
- **Alternativas:** SQLite local e MySQL em produção.
- **Motivo:** uma consulta que roda localmente roda igual em produção, e os dados de exemplo ficam em português.
- **Status:** ✅ aprovada · 25/09/2026

## D20 — Hospedagem de produção
- **Contexto:** o projeto não tem orçamento; a hospedagem precisa ser gratuita e atender à D15 (origem única), à D19 (MySQL) e ao upload de imagens do exercício 10.
- **Decisão:** alwaysdata, plano Free (PHP 8.4, MySQL, SSH, HTTPS no subdomínio `douglasabnovato.alwaysdata.net`).
  - Um único site PHP com raiz em `backend/public`.
  - O build do Vue vai para `backend/public/spa` (base `/spa/`, fora do Git). Ele é **gerado no computador local e enviado ao servidor com `scp`**: no primeiro deploy, o `npm ci` foi encerrado por falta de memória (`Killed`) nos 256 MB de RAM do plano Free.
  - No servidor rodam apenas `git pull`, `composer install --no-dev --optimize-autoloader`, `php artisan migrate --force` e `php artisan optimize`. O `.env` de produção e a `APP_KEY` existem só no servidor.
  - Uma rota coringa no `routes/web.php` entrega o `index.html` da SPA para tudo que não é `api`, `sanctum`, `storage`, `spa` ou `up`.
  - `trustProxies('*')` para o Laravel reconhecer o HTTPS do proxy.
  - Aviso de loja de demonstração no rodapé (o plano Free não permite uso comercial).
- **Alternativas:** Render Free + Aiven MySQL (hiberna após 15 min e perde as imagens enviadas); Koyeb Free (mesmos limites); Oracle Cloud Always Free (exige cartão e configuração completa do servidor); Cloudflare Tunnel do computador local (depende do PC ligado); Vercel/Netlify (não executam PHP).
- **Motivo:** única opção gratuita que mantém PHP, MySQL, imagens persistentes e site sempre ativo no mesmo domínio, sem Docker.
- **Status:** ✅ aprovada · 25/09/2026

## D21 — Vitrine por categoria
- **Contexto:** o menu da D4 tem Camisetas, Moletons e Acessórios, mas o produto do exercício 10 tem só os campos pedidos pelo enunciado (nome, descrição, preço e imagem), sem categoria.
- **Decisão:** cada item do menu filtra a vitrine pelo parâmetro `?busca=` da API (`where nome like`), com o termo da categoria: Camiseta, Moletom e Sketchbook (Acessórios). O mapa fica em `frontend/src/utils/categorias.js`.
- **Alternativas:** coluna `categoria` na tabela de produtos, com campo no formulário do admin.
- **Motivo:** mantém o produto exatamente como o enunciado pede e entrega o extra da camada 1 sem migration nova. Se a categoria virar requisito, a troca fica restrita à API e ao `categorias.js`.
- **Status:** ✅ implementada · 25/09/2026 (registrada após a implementação)
