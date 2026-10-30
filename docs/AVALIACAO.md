# Avaliação — E-commerce T-Shirt

> Data: 30/10/2026 · Base: `main` · Complementa `REQUISITOS.md` e `DECISOES.md`.

## Evidências

| Item | Resultado |
|---|---|
| CI | Não existia |
| Testes do frontend | **Não iniciavam**: `vitest.config.js` não aceitava a configuração do Vite em forma de função. Corrigido, 21 passam |
| Testes do backend | 21 passam (84 asserções), no CI com PHP 8.3 |
| Dependências | 4 alertas altos no frontend e 1 médio no backend, corrigidos no PR #7 |
| Site publicado | Responde 200, e a API de produtos devolve dados |

**Não testado:** login e administração no site publicado, para não alterar dados de produção; backend local, porque o PHP desta máquina é 8.1 e o projeto exige 8.2.

## Achados

| # | Severidade | Achado | Encaminhamento |
|---|---|---|---|
| A1 | Alta | Os testes do frontend não rodavam, e nada avisava | PR #7 |
| A2 | Média | Sem CI | PR #7 |
| A3 | Média | Dependências com falhas de segurança | PR #7 |
| A4 | A decidir | A senha de demonstração no README dá acesso à administração em produção: qualquer pessoa pode alterar ou excluir produtos | Decisão do responsável |
| A5 | Baixa | O deploy é manual, sem ligação com o CI | Próximo ciclo |

## Nota

Nota anterior do portfólio: 6,7, sem rodar os testes. **Nota atual: 7,5 com o PR #7.** É um julgamento técnico.
