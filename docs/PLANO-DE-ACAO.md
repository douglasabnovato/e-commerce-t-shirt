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
| 11 | Imagens menores e LCP da vitrine (14,82 s em 06/11) | Alto | Médio | Issue (#24) |

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
- Desempenho: Lighthouse móvel em 06/11/2026 deu mediana de 14,82 s; imagens de cerca de 1,1 MB e a primeira com `loading="lazy"` (#24).
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

**Vira issue.** #15, #16, #17, #18 (responsável); #19, #20, #21, #24 (agente).

## Ciclo de 07/11/2026

> Branch `feature/2026-11-07` → `developer/sprint-2026-11-12` → `main` (o PR para a `main` fica aberto para revisão do responsável). Nível: Vitrine (N2), 12 critérios.

### Produto

**Problema e público.** Os mesmos do ciclo anterior: quem avalia o teste técnico abre o link publicado no celular ou no computador. A vitrine é a primeira tela e levava 14,82 s para mostrar o maior elemento no celular (06/11/2026).

**Hipótese e meta.** Sem mudança; confirmar é do responsável (#17).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| A imagem do LCP não pode ter lazy loading | Os 4 primeiros cards (a primeira linha no desktop) carregam já; os demais seguem com `loading="lazy"` | [Chrome for Developers: optimize image priority](https://developer.chrome.com/docs/modern-web-guidance/guides/performance/optimize-image-priority) |
| `fetchpriority="high"` adianta a imagem principal | O primeiro card pede prioridade alta | [Addy Osmani: fetch priority](https://addyosmani.com/blog/fetch-priority/) |
| Reduzir e trocar o formato antes de gravar, com fallback | O upload grava WebP de até 600 px (qualidade 80) com GD; sem GD com WebP, grava o original. É preciso conferir o suporte no PHP de produção | [Laravel: images](https://laravel.com/docs/images), [DEV: image uploads in Laravel](https://dev.to/devops-make-it-run/ultra-fast-image-uploads-and-on-the-fly-display-optimization-in-laravel-and-php-4nho) |
| Depois de uma ação que remove o elemento em foco, o foco precisa ir para um lugar previsível | Depois de excluir um produto, o foco vai para o título "Produtos" | [W3C APG: dialog (modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Primeiros cards sem lazy loading, primeiro com prioridade alta | Alto | Baixo | Este ciclo (#24) |
| 2 | Upload em WebP de até 600 px e comando para as imagens antigas | Alto | Médio | Este ciclo (#24) |
| 3 | Acessibilidade da administração por teclado e axe | Médio | Baixo | Este ciclo (#19) |
| 4 | Publicar e rodar `produtos:reduzir-imagens` no servidor | Alto | Baixo | Responsável (#16, #24) |
| 5 | Teste de ponta a ponta no CI | Médio | Médio | Issue (#21) |
| 6 | Filtro por faixa de preço | Médio | Médio | Issue (#20) |

**Fora do escopo.** CDN, `srcset` com vários tamanhos, pagamento e pedidos reais.

### Engenharia

**Arquitetura.** `App\Support\ImagemVitrine` converte o binário da imagem com GD (`imagescale` até 600 px e `imagewebp` com qualidade 80). O `ProdutoController` usa a conversão no cadastro e na edição. O comando `produtos:reduzir-imagens` (em `routes/console.php`) reprocessa as imagens já salvas e mantém os originais, salvo com `--apagar-originais`. No front, `ProdutoCard` recebe a posição na grade e decide `loading` e `fetchpriority`.

**Riscos.**
- O PHP de produção pode não ter GD com WebP: o upload volta a gravar o original e o comando avisa sem alterar nada.
- O PHP local (8.1, sem GD) não roda o Laravel 12: os testes do backend rodam só no CI, que tem GD.
- O número no ar só muda depois da publicação manual e do comando no servidor, feitos pelo responsável.

**Qualidade.**
- Testes: 30 do frontend (4 novos do card) e 29 do backend (5 novos: upload em WebP de 600 × 840 px a partir de 1200 × 1680, comando que mantém o original, comando com `--apagar-originais`, imagem acima de 16 megapixels e conteúdo que não é imagem ficam no original), sem testes pulados no log do CI.
- Desempenho: LCP local com o build de produção e API simulada, mediana de 10,00 s antes e 3,94 s depois (ver `MVP.md`); a imagem deixou de ser o gargalo, que passou a ser a cadeia JS → API (#29).
- Acessibilidade: administração testada com Playwright 1.56 e axe-core 4.14, API simulada, modos claro e escuro: 0 violações e foco visível em todos os elementos alcançados por Tab (ver `MVP.md`; levar ao CI é a #31).

**Definição de pronto.** Lint, Vitest, build e `php artisan test` passam; CI verde nos PRs; `docs/MVP.md` e README atualizados; o PR para a `main` aberto com `revisao-responsavel`.

### Plano de ação

**Este ciclo executa.**
1. Primeiros cards com `loading="eager"` e o primeiro com `fetchpriority="high"`, com teste.
2. Upload em WebP de até 600 px e o comando `produtos:reduzir-imagens`, com testes.
3. Foco no título depois de excluir um produto e teste de acessibilidade da administração.
4. Medição local do LCP antes e depois, com o build de produção.
5. `docs/MVP.md` com uma tabela só e README com o ciclo.

**Vira issue ou segue em issue.** #15, #16, #17, #18 e #28 (responsável, com o passo a passo na #28); #20, #21, #29 (cadeia JS → API), #30 (`srcset`) e #31 (acessibilidade da administração no CI) (agente); #24 fica aberta até a medição no site publicado.

**Revisão independente (09/11/2026).** Um subagente que não viu o código leu só o diff e esta seção. Corrigido: rotação EXIF das fotos JPEG, limite de 16 megapixels antes de decodificar (o erro de memória do PHP é fatal e não cai no original) e remoção do WebP órfão se a gravação no banco falhar. Registrado sem mudança: `--apagar-originais` só vale para as imagens convertidas na mesma execução (documentado no README); WebP animado perde a animação (GIF não é aceito no upload). A rotação EXIF não tem teste automático, porque montar um JPEG com EXIF no teste exige um arquivo de exemplo.
