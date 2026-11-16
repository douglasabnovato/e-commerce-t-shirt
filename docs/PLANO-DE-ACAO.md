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

## Ciclo de 09/11/2026

> Branch `feature/2026-11-09` criada a partir de `developer/sprint-2026-11-12`; PR para a sprint. O PR da sprint para a `main` (#32) fica aberto para revisão do responsável. Nível: Vitrine (N2), 12 critérios. Objetivo do ciclo: resolver só o que o código resolve.

### Produto

**Problema e público.** Os mesmos: quem avalia o teste técnico abre a vitrine no celular. Depois do PR #27 o LCP local ficou em 3,94 s, preso na cadeia JS → API (#29).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Script inline depois de `<link rel="stylesheet">` só roda quando o CSS chega | O script que inicia a busca da vitrine fica antes das folhas de estilo; a primeira medição mostrou a busca saindo só quando o CSS do Google Fonts terminava | [web.dev: optimize resource loading](https://web.dev/learn/performance/optimize-resource-loading), [Stefan Judis: stylesheets block JavaScript execution](https://dev.to/stefanjudis/til-stylesheets-do-not-only-block-rendering-but-also-javascript-execution-3dlm) |
| O recurso do LCP deve começar a baixar o mais cedo possível; a espera para começar costuma ser a maior fase em SPA | A primeira página de produtos sai do `index.html`, em paralelo com o JS; a vitrine entra no pacote principal e o `/api/user` não bloqueia páginas públicas | [web.dev: optimize LCP](https://web.dev/optimize-lcp/), [corewebvitals.io: resource load delay](https://www.corewebvitals.io/core-web-vitals/largest-contentful-paint/resource-load-delay) |
| Em diálogo modal, o foco volta para quem o abriu ou para um lugar lógico | Já aplicado na exclusão (#19); agora coberto pelo teste no CI | [W3C APG: dialog (modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Encurtar a cadeia até a primeira imagem | Alto | Baixo | Este ciclo (#29) |
| 2 | Teste de acessibilidade da administração no CI | Médio | Médio | Este ciclo (#31) |
| 3 | Pré-carregar a imagem no HTML (Laravel) e tirar o `axios` do pacote inicial | Alto | Médio | Issue (#33) |
| 4 | Dados iniciais da vitrine escritos no HTML pelo Laravel | Baixo depois deste ciclo | Médio | Avaliado e não feito: a API já sai em paralelo ao JS; o gargalo é o JS. Mudaria o backend, que só roda no CI |

**Fora do escopo.** SSR, publicação (#28), `srcset` (#30).

### Engenharia

**Arquitetura.** O `index.html` tem um script inline, antes das folhas de estilo, que em `/` sem query chama `fetch('/api/produtos?page=1&por_pagina=12')` e guarda a promessa em `window.__vitrineInicial`. `listarProdutos()` consome essa promessa uma vez, só na primeira página sem filtro; se ela falhar, pede de novo pelo axios, e o erro chega à tela como antes. A `VitrineView` é importada direto no router. O guarda de rotas só espera `/api/user` em rotas com `exigeLogin` ou `somenteVisitante`; a store reaproveita o pedido em andamento. O CSS do Google Fonts carrega com `media="print"` e troca para `all` ao terminar.

**Riscos.**
- Se o formato de `/api/produtos` mudar, a busca inicial deixa de ser usada (a função confere `data` e `meta`) e a vitrine volta ao pedido normal.
- O backend não roda localmente (PHP 8.1, Laravel 12): nada do backend mudou neste ciclo.
- Sem o CSS das fontes no primeiro quadro, o texto aparece com a fonte de reserva e troca depois (já acontecia com `display=swap`).

**Qualidade.**
- Testes: Vitest 40 (10 novos em `vitrine-inicial.spec.js`: o script do `index.html` executado com `fetch` simulado, o reaproveitamento único da busca, o descarte da busca quando a primeira chamada tem filtro, ordem ou outra página, o pedido de reserva quando a busca falha e a navegação pública sem esperar `/api/user`); Playwright 2 (claro e escuro).
- Desempenho: mediana local de 4,30 s (sprint) para 3,65 s; detalhes em `MVP.md`.
- Acessibilidade: `npm run test:e2e` no CI.

**Definição de pronto.** Lint, Vitest, Playwright e build passam; CI verde no PR para a sprint; `MVP.md`, plano e README atualizados; comentário no PR #32.

### Plano de ação

**Este ciclo executa.**
1. Busca da primeira página no `index.html`, vitrine no pacote principal e `/api/user` sem bloquear páginas públicas, com testes (#29).
2. Script antes do CSS e CSS das fontes sem bloquear a pintura.
3. Teste de acessibilidade da administração no CI (#31).
4. Medição local com 3 execuções válidas de cada versão.

**Vira issue ou segue em issue.** #33 (imagem no HTML e JS inicial menor); #15, #16, #17, #18 e #28 (responsável); #20, #21, #24 e #30 seguem. #29 e #31 recebem a evidência por comentário e só fecham depois do merge na `main`.

**Revisão independente (09/11/2026).** Um subagente que não viu o código leu só o diff e esta seção. Corrigido: a busca inicial passa a ser descartada na primeira chamada da lista, qualquer que seja (antes, uma primeira chamada com filtro a deixava guardada e ela podia voltar como dado velho); o teste da sessão confere que `/api/user` foi pedido uma vez só depois de a navegação terminar; a varredura de foco marca cada elemento em vez de usar o nome, não aceita contorno transparente e exige um mínimo de elementos nos formulários. Conferido sem mudança: o Laravel não manda Content-Security-Policy (nenhuma ocorrência no backend), então o script inline e o `onload` das fontes funcionam; a URL do `index.html` é a mesma que o axios pede para "recentes" (o serviço omite `ordem` nesse caso).

### 2ª rodada (09/11/2026, PR #35)

> Branch `feature/2026-11-09-2`, criada a partir de `developer/sprint-2026-11-12` atualizada (com o PR #34); PR para a sprint. O PR da sprint para a `main` (#32) segue aberto para o responsável. Objetivo: o critério 7, que ainda dependia de código (#33).

**Antes de mudar código (fases do LCP no JSON).** Nas medições da 1ª rodada o JS inicial era servido sem compressão (161 KB). O site publicado responde com `content-encoding: br` (conferido com `curl` em 09/11/2026), então a série nova usa um servidor local com brotli. Com compressão, a sprint fica em 2,64 a 2,89 s. O elemento do LCP é a 1ª imagem ou um texto `<p>`; o FCP simulado fica em cerca de 2,5 s, e as requisições antes dele incluem o CSS do Google Fonts (mesmo com `media="print"`) e três fontes de `fonts.gstatic.com`, dois domínios externos com conexão própria.

**Pesquisa.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Um invólucro fino sobre `fetch` substitui o axios quando a aplicação usa poucos recursos dele; o que precisa ser refeito à mão é o cabeçalho de CSRF e os interceptadores | Cliente em `services/api.js` com a mesma interface, CSRF do Sanctum, 419 e tempo limite, com testes de cada comportamento | [Kent C. Dodds: replace axios with a simple custom fetch wrapper](https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper), [OpenReplay: migrar de axios para fetch](https://blog.openreplay.com/pt/migrar-app-react-axios-fetch/) |
| Em SPA, o LCP atrasa quando o recurso só é descoberto depois da renderização no cliente; menos JS inicial e recurso descoberto mais cedo ajudam | Preload da 1ª imagem assim que a lista chega, sem esperar o Vue; o JS inicial perde o axios | [web.dev: reduce JavaScript payloads with code splitting](https://web.dev/articles/reduce-javascript-payloads-with-code-splitting), [web.dev: optimize LCP](https://web.dev/optimize-lcp/) |

**O que foi feito.**
1. `axios` trocado por um cliente `fetch` (`services/api.js`): mesma interface, cookie CSRF antes de escrita, `X-XSRF-TOKEN`, repetição única no 419, tempo limite de 15 s para a resposta inteira, `extrairErro` igual. JS inicial: 103,85 → 55,31 KB (gzip 39,6 → 22,1 KB). Decisão D22.
2. CSS do Google Fonts adicionado depois do evento `load` (com `<noscript>` para quem não roda JS). O texto aparece com a fonte de reserva e troca depois, como já acontecia com `display=swap`.
3. A busca inicial do `index.html`, ao receber a lista, adiciona `<link rel="preload" as="image" fetchpriority="high">` com a imagem do 1º produto. O endereço é o mesmo do `src` do card, então o download é reaproveitado (conferido no Playwright: 1 pedido da imagem, sem aviso de preload sem uso).
4. Rotas da administração: já eram carregadas sob demanda, e os `modulepreload` do `dist/index.html` só trazem o chunk do Vue. Nada a mudar.

**Avaliado e não feito.** Injeção do preload pelo Laravel na rota `spa` (segue na #33; mudaria o backend, que só roda no CI, e o preload pelo front já tira a espera do JS). Servir as fontes pelo próprio site (issue #37).

**Qualidade.** Vitest 60 (14 do cliente HTTP, 2 do HTML das fontes, 3 casos novos do preload); Playwright 2 (login, lista, exclusão e formulários com o cliente novo); CI verde no PR #35. Os testes do tempo limite do corpo e das fontes falham sem a correção.

**Resultado.** Mediana local de 2,44 e 2,50 s em duas séries (geral 2,47 s), contra 2,80 s da sprint nas mesmas séries. Critério 7: "Parcial" (no ar depende da publicação, #28). Detalhes em `MVP.md`.

**Revisão independente (09/11/2026).** Um subagente que não viu o código leu só o diff e esta seção. Corrigido: o tempo limite de 15 s terminava quando os cabeçalhos chegavam (no axios vale para a resposta inteira), e o teste "sem imagem" não provava a ausência do preload, porque o `try/catch` do script engolia o erro. Conferido sem mudança: CSRF, 419 sem laço, FormData sem `Content-Type`, 204 com `data: null`, preload sem `crossorigin` como o `<img>` e `href` atribuído como propriedade.

**Vira issue.** #36 (deslocamento do rodapé), #37 (fontes no próprio site). Segue: #33 (preload pelo Laravel), #24 e #28 (medir no ar depois da publicação).

## Ciclo de 16/11/2026

> Branch `feature/2026-11-16`, criada a partir de `developer/sprint-2026-11-19` (que já tem o `laravel/framework` 12.72.0, PR #40); PR #42 para a sprint. O PR da sprint para a `main` (#41) fica aberto para o responsável. Nível: Vitrine (N2), 12 critérios.

### Produto

**Problema e público.** Quem avalia o teste técnico confere vitrine, administração, checkout e respostas pelo link, sem instalar nada. Hipótese, meta e "saberemos quando" em [`MVP.md`](MVP.md).

**O que a análise achou.**
- O `MVP.md` marcava 9 de 12. Dois "Atende" não batiam com a régua: o 9 contava só o audit, com os alertas do Dependabot desligados (API 403 em 16/11/2026); o 8 dizia "modos claro e escuro", mas o CSS não tem `prefers-color-scheme`, então o projeto "escuro" do Playwright repetia a tela clara. O axe também só rodava com a API simulada, nunca com os dados reais.
- A `main` recebeu o PR #32 em 16/11/2026 e o CI ficou vermelho só no `composer audit` (run 43799448144); o PR #40 corrigiu na sprint. #21, #29 e #31 já estão na `main`.
- O site publicado responde 200, mas roda a versão de 06/11/2026: `/api/saude`, rota nova, responde 404 (`curl`, 16/11/2026).

**Pesquisa.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Conteúdo que chega depois desloca o que está abaixo; reservar o espaço antes evita o deslocamento (CLS "bom" até 0,1) | A vitrine reserva a altura da tela para a grade enquanto a lista carrega; teste mede o CLS no navegador | [web.dev: Optimize Cumulative Layout Shift](https://web.dev/articles/optimize-cls) |
| Refluxo: o conteúdo deve caber em 320 CSS px de largura sem rolagem nas duas direções (tabelas e código podem rolar dentro de si) | Projeto "celular" de 375 px no Playwright, com a regra de nenhuma rolagem horizontal da página; caminhos e links longos quebram a linha | [W3C: Understanding SC 1.4.10 Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html) |
| Região que rola precisa ser alcançável pelo teclado | Blocos de código e tabelas do Teste Técnico com `tabindex="0"` | [Deque: scrollable-region-focusable](https://dequeuniversity.com/rules/axe/4.10/scrollable-region-focusable), [Playwright: accessibility testing](https://playwright.dev/docs/accessibility-testing) |
| Os alertas do Dependabot são ligados nas configurações de segurança do repositório | Issue #43 com o passo a passo para o responsável | [GitHub Docs: configuring Dependabot alerts](https://docs.github.com/en/code-security/dependabot/dependabot-alerts/configuring-dependabot-alerts) |

**Backlog priorizado (impacto × esforço).**

| # | Item | Impacto | Esforço | Decisão |
|---|---|---|---|---|
| 1 | Critério 9 honesto e alertas do Dependabot | Alto | Baixo | Este ciclo (documento) e #43 (responsável) |
| 2 | axe com dados reais, em desktop, no job `fluxo` | Alto | Baixo | Este ciclo |
| 3 | Trocar o "escuro" falso pelo celular | Médio | Baixo | Este ciclo |
| 4 | Reservar a área da vitrine (#36) | Médio | Baixo | Este ciclo |
| 5 | Dependências de produção em patch e minor | Médio | Baixo | Este ciclo |
| 6 | Filtro por preço (#20), `srcset` (#30), fontes (#37) | Médio | Médio | Seguem em issue |

**Fora do escopo.** Publicar (#28), ligar a publicação pelo CI (#16) e a conta do GoatCounter (#18): são do responsável. Versões maiores de dependências.

### Engenharia

**Arquitetura.** Sem mudança. Laravel 12 entrega a API e o build do Vue em `/spa/`, na mesma origem. Os testes no navegador ficam em dois grupos: `npm run test:e2e` (build com `vite preview` e API simulada, projetos desktop e celular) e `npm run test:fluxo` (Laravel com SQLite e o seed, desktop). O axe, a varredura de foco e a medida da rolagem horizontal ficam em `frontend/e2e/apoio/acessibilidade.js`, usados pelos dois.

**Riscos.**
- O backend não roda no computador local (PHP 8.1; o projeto pede 8.2+). O `test:fluxo` só roda no CI.
- `min-height: 100vh` na reserva da vitrine: numa categoria com poucos produtos, o rodapé sobe depois que a lista chega; na troca de página, de categoria ou de ordem, a grade some e dá lugar a um bloco da altura da tela. Isso não conta no CLS da carga com a lista cheia, e o teste usa 12 produtos.
- O `content-hash` do `composer.lock` foi mantido igual ao do `composer.json`: a atualização usou `platform.php` 8.3.0 só durante o comando.

**Qualidade.**
- Testes: Vitest 69 (5 novos da vitrine: reserva, lista vazia e erro com nova tentativa); `test:e2e` 8 (desktop e celular: administração, Teste Técnico, checkout e vitrine); `test:fluxo` 3 (1 novo: axe e foco com os dados do seed); `php artisan test` 31. Run 43826555344.
- Acessibilidade: o axe com dados reais achou `scrollable-region-focusable` no Teste Técnico (run 43825133895), e o celular achou 77 px de rolagem lateral. Os dois foram corrigidos, e os testes falham sem a correção.
- Desempenho: CLS da vitrine medido no navegador abaixo de 0,1; o LCP no ar só depois da publicação (#24).
- Segurança: `composer audit` sem avisos (local e no CI) e `npm audit --omit=dev` sem avisos (local, 16/11/2026; o CI não roda esse comando); alertas do Dependabot desligados (#43); avisos moderados só de desenvolvimento: 7 no `npm audit` local e 8 no `npm ci` do run 43826555344 (#44).

**Definição de pronto.** Lint, Vitest, Playwright e build passam; CI verde no PR #42; revisão independente feita e erros corrigidos; `MVP.md`, README, `DEPLOY.md` e este plano atualizados; issues comentadas.

### Plano de ação

**Este ciclo executa.**
1. Segurança: `npm update` de vue, vue-router, pinia e vitest e `npm audit fix` sem versão maior (o lock trouxe junto patch e minor de dependências de desenvolvimento, como `@vue/test-utils` 2.6.0 e `eslint` 10.15); laravel/sanctum 4.4.0; audits de produção limpos.
2. Honestidade: critério 9 em "Parcial"; critério 8 sem o "escuro"; hipótese com "saberemos quando"; cada "Atende" com comando, data e run.
3. Código: axe com dados reais no `fluxo`; projeto celular no lugar do escuro; código e tabelas do Teste Técnico focáveis; sem rolagem lateral no celular.
4. Melhoria de issue antiga: reserva da área da vitrine (#36), com teste de CLS.
5. Documentação: `docs/DEPLOY.md`, ADR D23 da conta de demonstração, README.

**Vira issue ou segue em issue.** Novas: #43 (alertas do Dependabot, responsável), #44 (avisos de desenvolvimento), #45 (leitor de tela), #46 (tabelas com invólucro), #47 (dependências de desenvolvimento). Seguem: #16, #17, #18 e #28 (responsável); #20, #24, #30, #33 e #37. #21, #29 e #31 fecham com a evidência da `main`.

**Revisão independente (16/11/2026).** Um subagente que não viu o raciocínio leu só o diff do PR #42 e os logs do CI. Erros corrigidos: o número de avisos de desenvolvimento não batia com o run (7 no `npm audit` local, 8 no `npm ci` do run 43826555344; agora os dois aparecem) e o `npm audit --omit=dev` não dizia que é local. Sugestões aplicadas: mocks zerados com `vi.resetAllMocks`, varredura de foco do `fluxo` com limite folgado e conferência de que terminou antes dele, Node conforme o `engines`, lista completa do que o `npm update` trouxe e o risco da reserva na troca de página. Ficam como estão: o projeto celular parte do Chrome de desktop (serve para largura e refluxo; o app não detecta celular pelo user agent) e o Tab no celular, que não é usado como evidência de teclado no celular. Teste do `confirm` cancelado pelo teclado vira parte da #45.
