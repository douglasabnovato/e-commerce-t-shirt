# Plano de ação — E-commerce T-Shirt

> Plano por ciclo. O estado dos critérios fica só em [`MVP.md`](MVP.md). O plano de 30/10/2026 segue em [`PLANO-ESTRATEGICO.md`](PLANO-ESTRATEGICO.md).

## Ciclo de 03/11/2026

> Branch `feature/2026-11-03` → `developer/sprint-2026-11-05` → `main`. Nível: Vitrine (N2), 12 critérios.

### Produto

**Problema e público.** Quem avalia o teste técnico precisa conferir a vitrine, a administração e as respostas pelo link publicado, sem instalar nada.

**Hipótese e meta.** Um avaliador completa o roteiro de 5 minutos do README sem ajuda. A meta segue proposta; confirmar é do responsável (#17).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Ordenação é ferramenta básica de lista | Lojas costumam oferecer ordenar por preço e por novidade, e muitas falham nisso. Virou o seletor "Ordenar por" da vitrine (recentes, menor preço, maior preço, nome) | [Baymard: product list research](https://baymard.com/research/ecommerce-product-lists), [Baymard: sorting tool](https://baymard.com/ecommerce-design-examples/40-sorting-tool) |
| Ordenar e filtrar se completam | Usuários querem os dois: filtro corta, ordenação reorganiza. O filtro de preço virou issue (#20) | [Baymard: category-specific sorting](https://baymard.com/research-articles/category-specific-sorting) |
| Preço, cor e tamanho são filtros essenciais em vestuário | Os produtos ainda não têm cor e tamanho. Ficou fora; o preço entra primeiro (#20) | [Baymard: apparel size filter](https://baymard.com/research-articles/apparel-put-size-filter-near-top-and-expand-for-sidebar-filtering) |
| Coluna de ordenação não passa por binding | O PDO não protege nomes de coluna. A API aceita só valores de uma lista fixa e cai na padrão quando não reconhece | [Datadog: Laravel SQL injection](https://docs.datadoghq.com/security/code_security/static_analysis/static_analysis_rules/php-security/laravel-sql-injection/) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | CI também nos PRs para a `developer` | Alto | Baixo | Este ciclo |
| 2 | Ordenação da vitrine (API e tela) | Médio | Baixo | Este ciclo |
| 3 | Resumo do `MVP.md` batendo com a tabela | Alto | Baixo | Este ciclo |
| 4 | Proteger a `main` | Alto | Baixo | Responsável (#15) |
| 5 | Deploy pelo CI | Alto | Médio | Responsável (#16) |
| 6 | Roteiro com pessoa de fora e meta | Alto | Baixo | Responsável (#17) |
| 7 | Acessibilidade da administração | Médio | Baixo | Issue (#19) |
| 8 | Filtro por faixa de preço | Médio | Médio | Issue (#20) |
| 9 | Teste de ponta a ponta | Médio | Médio | Issue (#21) |
| 10 | Medição de uso | Baixo | Baixo | Responsável (#18) |

**Fora do escopo.** Pagamento, pedidos reais, sacola ligada à API, filtros por cor e tamanho.

### Engenharia

**Arquitetura.** Vue 3 e Vite no `frontend`; Laravel 12 no `backend`, que entrega a SPA e a API na mesma origem, com Sanctum por cookie. A ordenação vive em `ProdutoController::ORDENACOES` (API) e em `frontend/src/utils/ordenacao.js` (tela), com os mesmos valores. A ordem fica na URL (`?ordem=`), junto com a categoria e a página.

**Riscos.**
- Ordenar por coluna com valor repetido (preço) pode repetir item entre páginas. O id desempata, com teste.
- Os valores de ordenação existem em dois lugares (API e tela). Um valor novo precisa entrar nos dois; o valor desconhecido cai na padrão nos dois lados.
- Sem proteção na `main`, um push direto publica sem CI (#15). O deploy segue manual (#16).
- O PHP local (8.1) é mais antigo que o exigido (8.2). Os testes do backend rodam no CI.

**Qualidade.**
- Testes: 26 do frontend (Vitest) e 24 do backend (PHPUnit), incluindo ordenação, valor inválido e empate entre páginas.
- CI: agora também em PR e push para `developer/**`.
- Acessibilidade: o seletor tem rótulo visível ligado por `for`/`id` e é um `select` nativo.
- Segurança: o `composer audit` do CI passou a falhar com 7 alertas de 04/11/2026 em `symfony/http-foundation`, `http-kernel`, `routing` e `yaml`. Os quatro foram para 7.4.23, sem trocar de versão maior. Coluna de ordenação só da lista fixa; a conta de demonstração é de teste, por decisão do responsável (#9).

**Definição de pronto.** Lint, Vitest, build e `php artisan test` passam; CI verde no PR; `docs/MVP.md` e README atualizados.

### Plano de ação

**Este ciclo executa.**
1. CI nos PRs para a `developer`.
2. Atualização dos pacotes Symfony com alerta de segurança.
3. Ordenação da vitrine na API e na tela, com testes.
4. `docs/MVP.md` com o resumo batendo com a tabela e a régua N2.
5. README com a seção do ciclo e os próximos passos.

**Vira issue.** #15, #16, #17, #18 (responsável); #19, #20, #21 (agente).
