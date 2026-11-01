# MVP — E-commerce T-Shirt

> Criado em 31/10/2026, com os critérios usados no `movies`. Situação baseada em `AVALIACAO.md` e na conferência deste ciclo.

## Problema e hipótese

**Problema e público:** Responde a um teste técnico: quem avalia confere a vitrine, a administração e as respostas pelo link publicado, sem instalar nada.

**Hipótese:** Um avaliador completa o roteiro de 5 minutos do README sem precisar de ajuda. Proposta inicial, para o responsável confirmar ou trocar. Sem medição, a meta ainda não pode ser conferida.

## 1. Critérios

| # | Critério | Como verificar | Situação em 31/10/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Parcial: meta proposta |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: vitrine e API respondem; login e administração não testados em produção para não alterar dados |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: loja de demonstração, sem pedido real |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica ao objetivo de avaliação; não coleta uso |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Parcial: vitrine e administração têm estados vazios; demais casos não revistos |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não medido neste ciclo |
| 8 | Acessibilidade básica | Lighthouse e teclado | Não medido neste ciclo |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | Parcial: senha retirada em PR; **trocá-la em produção falta** (#9), e ela segue no histórico do Git |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial: deploy manual, sem ligação com o CI |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 21 testes do frontend e 21 do backend no CI |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende |

**Resultado:** 4 de 12 critérios atendidos por inteiro. É um julgamento técnico.

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Retirar a senha de demonstração do código e dos textos | PR aberto |
| 2 | Manter a conta de demonstração acessível, por ser de teste | Decidido pelo responsável (#9) |
| 3 | Conferir o roteiro de 5 minutos em produção | Com o responsável |

## 3. Fora do MVP

Pagamento, pedidos reais e deploy automático. A lista é uma proposta e pode mudar com a decisão do responsável.
