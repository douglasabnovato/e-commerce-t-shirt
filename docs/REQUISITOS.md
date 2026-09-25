# REQUISITOS — Teste Técnico Full Stack

> Fonte: documento de requisitos enviado pela empresa
> Status: ⬜ pendente · 🟨 em andamento · ✅ atendido
> "Onde" = caminho no repositório ou rota da aplicação que atende o requisito

## A. Requisitos gerais

| ID | Requisito | Critério de "atendido" | Onde | Status |
|---|---|---|---|---|
| G1 | Respostas documentadas em repositório Git (público ou com acesso ao avaliador) | Repositório criado e acesso testado | github.com/douglasabnovato/e-commerce-t-shirt | 🟨 |
| G2 | Boas práticas de programação, versionamento e organização | Commits pequenos no padrão convencional (docs:, feat:, fix:, chore:); nenhum arquivo gerado ou `.env` versionado | — | 🟨 |
| G3 | README com instruções para rodar e justificativa das decisões técnicas | Passo a passo testado do zero, `.env.example` e link para `docs/DECISOES.md` | README.md | ⬜ |
| G4 | Cada exercício claramente identificado | Índice no README e na página Teste Técnico ligando cada exercício (1–15) ao seu arquivo ou rota | README.md | ⬜ |

## B. Regras do front-end (valem para o ex. 12 e para o front do ex. 10)

| ID | Requisito | Critério de "atendido" | Onde | Status |
|---|---|---|---|---|
| F1 | Paleta e fontes livres | Paleta e fontes definidas em variáveis e documentadas | — | ⬜ |
| F2 | Imagens da Uma Penca ou da Chico Rei (opcional) | Se usadas, origem citada no README | — | ⬜ |
| F3 | Dados de exemplo com fakerjs (sugerido) | `@faker-js/faker` usado com locale pt_BR | — | ⬜ |
| F4 | Framework CSS permitido, com personalização em **LESS** | Pelo menos um arquivo `.less` compilado no build, alterando tamanhos, fontes, cores ou espaçamentos | — | ⬜ |
| F5 | Avaliados: código limpo, documentação, **acessibilidade**, **otimização**, criatividade | Labels em todos os campos, `aria-live` nas mensagens, navegação por teclado, contraste AA, `alt` nas imagens, lazy loading, build minificado, medição Lighthouse registrada no README | — | ⬜ |

## C. Exercícios teóricos (resposta escrita)

| ID | Tema | Critério de "atendido" | Onde | Status |
|---|---|---|---|---|
| E1 | Vue.js: ciclo de vida e performance | Hooks de criação, montagem, atualização e desmontagem; custo de re-render; exemplos (limpeza em `onUnmounted`, `v-once`/`v-memo`, `computed` × `watch`, `KeepAlive`, lazy loading) | docs/respostas/01-*.md | ⬜ |
| E2 | Laravel + Vue: autenticação segura | Compara Sanctum SPA (cookie HttpOnly + CSRF) com token Bearer; fluxo passo a passo; onde **não** guardar token; CORS, expiração, logout. **Mesma estratégia implementada no E10** | docs/respostas/02-*.md | ⬜ |
| E3 | Endpoint lento | Medir (APM, Telescope, log de queries, `EXPLAIN`) → hipóteses (N+1, índices, payload, serviço externo) → correções (eager loading, índices, cache, paginação, filas) → nova medição | docs/respostas/03-*.md | ⬜ |
| E4 | CDN e performance | Latência pela borda, cache de estáticos, descarga da origem, compressão, HTTP/2 e 3, invalidação e versionamento de arquivos | docs/respostas/04-*.md | ⬜ |
| E5 | Memcached / ElastiCache com MySQL (RDS) | Cache de leitura, sessão e resultados; Memcached × Redis; redução de carga no RDS; escala horizontal; invalidação | docs/respostas/05-*.md | ⬜ |
| E6 | Eloquent: vantagens, desvantagens e N+1 | Prós e contras; exemplo de N+1 e correção com `with()`/`load()`; `preventLazyLoading()`; quando usar Query Builder ou SQL puro | docs/respostas/06-*.md | ⬜ |
| E7 | Filas assíncronas no Laravel | Driver (database/Redis/SQS), Job, dispatch, worker e supervisor, retries e `failed_jobs`; casos de uso | docs/respostas/07-*.md | ⬜ |
| E8 | Transactions | Escritas que precisam ser atômicas, `DB::transaction`, locks, transação curta e sem chamadas externas dentro | docs/respostas/08-*.md | ⬜ |
| E9 | Leitura do log | Causa (`getImage()` em null em `Imagem.php:147`, dentro do `rememberForever` ao montar thumbs do produto 667); leitura da pilha (controller → factory → transformer → model); correção (null-safe, relação órfã, dado no banco); risco do `rememberForever` | docs/respostas/09-*.md | ⬜ |
| E11 | Crítica do transformer | Null nas relações (mesmo erro do E9), N+1 em listas, acoplamento, chamadas repetidas; propõe null-safe, eager loading, extração de variáveis e testes | docs/respostas/11-*.md | ⬜ |
| E13 | Experiência profissional | Contexto, desafios, soluções, impacto e lições, com tecnologias e resultados concretos, sem dados confidenciais | docs/respostas/13-*.md | ⬜ |

## D. Exercícios práticos

### E10 — CRUD de produtos (Laravel + Vue)

| ID | Requisito | Critério de "atendido" | Onde | Status |
|---|---|---|---|---|
| E10.1 | Produto com Nome, Descrição, Preço e Imagem | Migration com os 4 campos e tipos adequados | — | ⬜ |
| E10.2 | Model, migration, controller e rotas REST | Model, resource controller, `apiResource` com as 5 ações | — | ⬜ |
| E10.3 | Validação no backend | Form Request aplicado no controller (obrigatórios, preço > 0, imagem com tipo e tamanho) | — | ⬜ |
| E10.4 | Upload de imagem | Armazenamento público (ou S3/R2), URL completa na API, arquivo removido ao trocar e ao excluir | — | ⬜ |
| E10.5 | Front Vue consome a API | Listar, criar, editar e excluir funcionando na interface | — | ⬜ |
| E10.6 | Só autenticados modificam | Leitura pública; criar, editar e excluir protegidos; teste com 401 sem login | — | ⬜ |
| E10.7 | Login e logout no front | Tela de login coerente com a resposta do E2 | — | ⬜ |
| E10.8 | Seed com faker | Seeder com produtos de exemplo | — | ⬜ |
| E10.9 | Testes | Testes de feature da API (CRUD e autorização) | — | ⬜ |

### E12 — Página de finalização de compra

| ID | Requisito | Critério de "atendido" | Onde | Status |
|---|---|---|---|---|
| E12.1 | Sacola hardcoded | Lista fixa exibida com imagem, nome, preço e subtotal | — | ⬜ |
| E12.2 | Validação de formato | Cartão (Luhn), validade (MM/AA no futuro), CVC, CEP, e-mail e telefone, com máscaras | — | ⬜ |
| E12.3 | Validação de vazios | Todos obrigatórios, com mensagem por campo | — | ⬜ |
| E12.4 | Alterar quantidade | Botões − e + e campo numérico, mínimo 1, totais recalculados | — | ⬜ |
| E12.5 | Endereço pelo CEP com **cep-promise** | Preenche rua, bairro, cidade e UF; trata CEP inválido ou inexistente | — | ⬜ |
| E12.6 | Indicador de carregamento | Loading visível e acessível na busca do CEP e no envio | — | ⬜ |
| E12.7 | Mensagem de sucesso | Exibida só quando todos os campos forem válidos | — | ⬜ |
| E12.8 | `console.log` do objeto final | Objeto com itens, totais, contato, endereço e pagamento (cartão mascarado) | — | ⬜ |
| E12.9 | Layout de referência | Segue `docs/assets/checkout-frontend.jpg`: 2 colunas; Contato, Entrega (CEP com botão de busca) e Pagamento; botão "Fechar pedido"; "Sua sacola" com quantidade − e + | — | ⬜ |
| E12.10 | LESS, acessibilidade e otimização | Cumpre F4 e F5 | — | ⬜ |

## E. Queries (Eloquent / SQL)

### E14 — Clientes e pedidos

| ID | Requisito | Critério de "atendido" | Onde | Status |
|---|---|---|---|---|
| E14.1 | Estados com maior volume de vendas | Join, `groupBy('estado')`, `SUM(valor_total)`, ordem decrescente | — | ⬜ |
| E14.2 | Top 5 clientes por valor | `SUM(valor_total)` por cliente, ordem decrescente, `limit(5)` | — | ⬜ |
| E14.3 | Otimização | Índices (`pedidos.cliente_id`, `clientes.estado`, composto), `EXPLAIN`, cache, tabela de resumo | — | ⬜ |

### E15 — Produtos, fornecedores e estoque

| ID | Requisito | Critério de "atendido" | Onde | Status |
|---|---|---|---|---|
| E15.1 | Estoque abaixo da média geral | Subquery de média; explicar se a linha órfã (produto 5) entra na média | — | ⬜ |
| E15.2 | Preço acima da média da categoria | Média por categoria; saída com fornecedor, produto, categoria e preço, ordenada por categoria e preço | — | ⬜ |
| E15.3 | Recentes do Brasil com estoque acima da média | Filtro por país, comparação com a média, ordem por `data_aquisicao` decrescente; "mais recentes" definido e justificado | — | ⬜ |
| E15.4 | Entregável .sql/.txt com explicação | Eloquent + SQL equivalente, resultado esperado com os dados fornecidos, notas sobre inconsistências (produto 5 órfão, fornecedor D sem produtos, fornecedor C inativo) | — | ⬜ |

## F. Requisitos adicionais do projeto

| ID | Requisito | Critério de "atendido" | Onde | Status |
|---|---|---|---|---|
| X1 | Página "Teste Técnico" no menu (entregável principal) | Todas as respostas legíveis no link de produção, lidas de `docs/respostas/*.md`, com índice 1–15, âncoras por exercício, funcionando sem o backend | — | ⬜ |
| X2 | README honesto | Descrição + arquitetura + plano de ação em checklist; cada [x] conferido no código | README.md | 🟨 |
| X3 | Autenticação coerente | Estratégia da resposta do E2 = estratégia implementada no E10 | — | ⬜ |
| X4 | Link de produção | Front e página Teste Técnico publicados; API publicada com imagens persistentes | — | ⬜ |

## G. Dúvidas em aberto

1. O exercício 12 pode ficar no mesmo app Vue do exercício 10? (proposta: sim, na rota do checkout)
2. Horário exato de início e fim das 48h.