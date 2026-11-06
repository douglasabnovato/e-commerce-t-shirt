# MVP — E-commerce T-Shirt

> Criado em 31/10/2026, com os critérios usados no `movies`. Revisto em 06/11/2026 (ciclo de 03/11/2026, plano em [`PLANO-DE-ACAO.md`](PLANO-DE-ACAO.md)).

**Nível:** Vitrine (N2). Valem os 12 critérios.

**Finalizado:** não. Falta o critério 8 na administração (#19), que o agente resolve. Os critérios 2, 3, 5 e 10 dependem do responsável e têm issue com `depende-do-responsavel` (#15, #16, #17, #18).

## Problema e hipótese

**Problema e público:** Responde a um teste técnico: quem avalia confere a vitrine, a administração e as respostas pelo link publicado, sem instalar nada.

**Hipótese:** Um avaliador completa o roteiro de 5 minutos do README sem precisar de ajuda. Proposta inicial, para o responsável confirmar ou trocar (#17).

## 1. Critérios

| # | Critério | Como verificar | Situação em 06/11/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Parcial: meta proposta; confirmar é do responsável (#17) |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: vitrine e API respondem; login e administração não testados em produção para não alterar dados; roteiro com pessoa de fora com o responsável (#17) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: loja de demonstração, sem pedido real |
| 5 | Medição de uso | A métrica principal é coletada | Não atende: não coleta uso. Em N2 o critério conta; decidir e criar a conta é do responsável (#18) |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: vitrine, login, administração e checkout têm carregamento, vazio e erro com nova tentativa, conferidos no código |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Atende na vitrine: mediana de 2,19 s no site publicado (2,18, 14,82 e 2,19 s); a execução de 14,82 s indica variação do servidor |
| 8 | Acessibilidade básica | Lighthouse e teclado | Parcial: vitrine com Lighthouse 100, axe sem violações e foco visível em todos os elementos alcançados por Tab (12 elementos); administração não testada, para não alterar dados; teste local com o seed (#19). O seletor de ordenação novo é `select` nativo com rótulo |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | Atende: a conta de demonstração é de teste e fica pública por decisão do responsável (#9); o risco de alterar os produtos está aceito |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial: `main` sem proteção (#15) e deploy manual, sem ligação com o CI (#16). O CI agora roda também nos PRs para `developer/**` |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 26 testes do frontend e 24 do backend no CI, incluindo a ordenação da vitrine (PR do ciclo de 03/11/2026) |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende |

**Resultado:** 7 de 12 critérios atendidos (1, 4, 6, 7, 9, 11 e 12), 4 parciais (2, 3, 8 e 10) e 1 não atendido (5). É um julgamento técnico.

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Manter o acesso de demonstração no README e no login | Feito (PR #12) |
| 2 | Manter a conta de demonstração acessível, por ser de teste | Decidido pelo responsável (#9) |
| 3 | Conferir o roteiro de 5 minutos em produção | Com o responsável (#17) |
| 4 | Ordenar a vitrine por preço e nome | Feito (ciclo de 03/11/2026) |
| 5 | CI nos PRs para a `developer` | Feito (ciclo de 03/11/2026) |
| 6 | Acessibilidade da administração | Issue #19 |
| 7 | Filtro por faixa de preço | Issue #20 |
| 8 | Teste de ponta a ponta | Issue #21 |

## 3. Fora do MVP

Pagamento, pedidos reais e filtros por cor e tamanho. O deploy automático saiu desta lista: ele é a parte que falta do critério 10 (#16).

## Medições de 02/11/2026

Mediana do LCP de 2,19 s, desempenho 94, acessibilidade 100. Lighthouse 12.8.2 local, perfil móvel simulado, sem aparelho real.
