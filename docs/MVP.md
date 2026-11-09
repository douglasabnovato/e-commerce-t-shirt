# MVP — E-commerce T-Shirt

> Fonte única do estado. Criado em 31/10/2026; revisto em 09/11/2026 (ciclo de 07/11/2026, plano em [`PLANO-DE-ACAO.md`](PLANO-DE-ACAO.md)). As tabelas anteriores estão em [Histórico](#histórico).

**Nível:** Vitrine (N2). Valem os 12 critérios.

**Resumo:** 7 de 12 aplicáveis atendidos

**Finalizado:** não

O critério 7 ainda depende de código: com as imagens novas, o LCP local caiu, mas a mediana ficou acima de 2,5 s (#29). Os critérios 2, 3, 5 e 10 dependem do responsável e têm issue com `depende-do-responsavel` (#17, #18, #15, #16); a publicação desta versão e a conversão das imagens do servidor também (#28).

## Problema e hipótese

**Problema e público:** Responde a um teste técnico: quem avalia confere a vitrine, a administração e as respostas pelo link publicado, sem instalar nada.

**Hipótese:** Um avaliador completa o roteiro de 5 minutos do README sem precisar de ajuda. Proposta inicial, para o responsável confirmar ou trocar (#17).

## 1. Critérios

| # | Critério | Como verificar | Situação em 09/11/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Parcial: meta proposta; confirmar é do responsável (#17) |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: vitrine e API respondem (`curl` em 09/11/2026: HTTP 200); roteiro com pessoa de fora com o responsável (#17) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: loja de demonstração, sem pedido real |
| 5 | Medição de uso | A métrica principal é coletada | Não atende: não coleta uso; decidir e criar a conta é do responsável (#18) |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: vitrine, login, administração e checkout têm carregamento, vazio e erro com nova tentativa; upload sem GD com WebP grava o original (teste no CI) |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não atende. No ar: 14,82 s (06/11/2026), muda só depois da publicação pelo responsável (#28). Local, build de produção, 09/11/2026: antes 3,41, 10,27 e 10,00 s (mediana 10,00 s); depois 2,85, 3,94 e 4,49 s (mediana 3,94 s). A espera da imagem caiu de 9,1 s para zero ou 3,8 s; o limite agora é a cadeia JS → API (#29). Detalhes em "Medições de 09/11/2026" |
| 8 | Acessibilidade básica | Lighthouse e teclado | Atende: vitrine com Lighthouse 100 (06/11/2026 no ar; 1,00 nas execuções locais de 09/11/2026). Administração em 09/11/2026 com Playwright 1.56 e axe-core 4.14 (WCAG 2.1 A e AA), API simulada, modo claro e escuro: login, lista, formulário novo e edição sem violações; 4 elementos por Tab no login e 8 na lista e no formulário, todos com foco visível; exclusão por teclado devolve o foco ao título "Produtos" (#19). Leitor de tela não testado |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | Atende: a conta de demonstração é de teste e fica pública por decisão do responsável (#9); `composer audit` sem alertas no CI do PR #27 (09/11/2026) |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial: `main` sem proteção (#15) e deploy manual, sem ligação com o CI (#16) |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: `npx vitest run` com 30 testes e `php artisan test` com 27 testes (119 asserções), nenhum pulado, no CI do PR #27 em 09/11/2026 |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende: README com o passo do comando `produtos:reduzir-imagens` na publicação |

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Primeiros cards sem lazy loading e o primeiro com prioridade alta | Feito (PR #27) |
| 2 | Upload em WebP de até 600 px e comando para as imagens antigas | Feito (PR #27) |
| 3 | Acessibilidade da administração | Feito (PR #27, #19) |
| 4 | Publicar e converter as imagens do servidor | Com o responsável (#28) |
| 5 | Encurtar a cadeia até a primeira imagem | Issue #29 |
| 6 | Imagens em dois tamanhos | Issue #30 |
| 7 | Teste de acessibilidade da administração no CI | Issue #31 |
| 8 | Filtro por faixa de preço | Issue #20 |
| 9 | Teste de ponta a ponta | Issue #21 |

## 3. Fora do MVP

Pagamento, pedidos reais, filtros por cor e tamanho, CDN.

## Medições de 09/11/2026

Lighthouse 12.8.2 local, perfil móvel simulado, `--headless --no-sandbox`, com o build de produção do Vue servido por um servidor local que imita a produção (SPA em `/spa`, `/api/produtos` com 12 produtos e 300 ms de atraso, imagens em `/storage`). O computador estava com a CPU em 100% por outros processos; o bloqueio total (TBT) chegou a 8,8 s em algumas execuções, o que aumenta a variação.

| Versão | Imagens | Execuções | Mediana | Fases do LCP |
|---|---|---|---|---|
| Antes (`main`, 58e059d) | 1º produto em PNG de 1,22 MB (como o publicado), demais JPG do seed | 3,41, 10,27 e 10,00 s | 10,00 s | Espera para baixar a imagem de 9,1 s (o mesmo padrão do site publicado, de 9 a 10 s) |
| Depois (PR #27) | Todas em WebP de 600 px (13 a 23 KB), como depois do `produtos:reduzir-imagens` | 2,85, 3,94 e 4,49 s | 3,94 s | Imagem com `fetchpriority="high"` baixa em 0,13 s; espera até 3,8 s pela cadeia JS → vitrine → API |

Duas execuções do "depois" travaram sem gravar resultado e foram descartadas. O número no ar só muda depois da publicação pelo responsável (#28).

## Histórico

### Tabela de 06/11/2026 (ciclo de 03/11/2026)

| # | Critério | Como verificar | Situação em 06/11/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Parcial: meta proposta; confirmar é do responsável (#17) |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: vitrine e API respondem; login e administração não testados em produção para não alterar dados; roteiro com pessoa de fora com o responsável (#17) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: loja de demonstração, sem pedido real |
| 5 | Medição de uso | A métrica principal é coletada | Não atende: não coleta uso. Em N2 o critério conta; decidir e criar a conta é do responsável (#18) |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: vitrine, login, administração e checkout têm carregamento, vazio e erro com nova tentativa, conferidos no código |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não atende: mediana de 14,82 s no site publicado em 06/11/2026 (14,85, 14,81 e 14,82 s). Em 02/11 a mediana foi 2,19 s, com uma execução de 14,82 s. As imagens têm cerca de 1,1 MB e a do primeiro card usa `loading="lazy"` (#24) |
| 8 | Acessibilidade básica | Lighthouse e teclado | Parcial: vitrine com Lighthouse 100, axe sem violações e foco visível em todos os elementos alcançados por Tab (12 elementos); administração não testada, para não alterar dados; teste local com o seed (#19). O seletor de ordenação novo é `select` nativo com rótulo |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | Atende: a conta de demonstração é de teste e fica pública por decisão do responsável (#9); o risco de alterar os produtos está aceito |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial: `main` sem proteção (#15) e deploy manual, sem ligação com o CI (#16). O CI agora roda também nos PRs para `developer/**` |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 26 testes do frontend e 24 do backend no CI, incluindo a ordenação da vitrine (PR do ciclo de 03/11/2026) |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende |

**Resultado:** 6 de 12 critérios atendidos (1, 4, 6, 9, 11 e 12), 4 parciais (2, 3, 8 e 10) e 2 não atendidos (5 e 7). Em 31/10 a tabela tinha 7: o critério 7 caiu com a medição de 06/11/2026. É um julgamento técnico.

### Medições de 02/11/2026

Mediana do LCP de 2,19 s, desempenho 94, acessibilidade 100. Lighthouse 12.8.2 local, perfil móvel simulado, no site publicado, sem aparelho real.

### Medições de 06/11/2026

Lighthouse 12.8.2 local, perfil móvel simulado, no site publicado: LCP de 14,85, 14,81 e 14,82 s (mediana 14,82 s), desempenho 0,44 a 0,48, acessibilidade 100. Uma quarta execução falhou sem pintar a página (NO_FCP) e foi descartada. Fases do LCP: TTFB de 0,9 a 1,7 s, espera de 9 a 10 s antes de baixar a imagem e 3,7 s de download. A API de produtos respondeu em cerca de 1 s.
