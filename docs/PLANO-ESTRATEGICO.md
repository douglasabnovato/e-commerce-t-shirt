# Plano estratégico — E-commerce T-Shirt

> Criado em 30/10/2026. Diagnóstico em `AVALIACAO.md`. Decisões em `DECISOES.md`.

## Objetivo

Chegar ao nível N2 (vitrine): demo estável, testes rodando no CI e documentação fiel.

## Arquitetura atual

Vue 3 e Vite no `frontend`, Laravel 12 no `backend`. O build do frontend vai para `backend/public/spa`, e o Laravel entrega a aplicação e a API na mesma origem, com autenticação por cookie do Sanctum. As escolhas estão em `DECISOES.md` (D10, D15 e D20).

## Execução

| Etapa | Entrega | Situação |
|---|---|---|
| 1 | CI, testes do frontend funcionando e dependências corrigidas | PR #7 aberto |
| 2 | Avaliação e plano | Este PR |
| 3 | Decidir o acesso de demonstração | Com o responsável |
| 4 | Automatizar o deploy depois do CI verde | Próximo ciclo |
| 5 | Teste de ponta a ponta de vitrine, login e checkout | Próximo ciclo |

## O que você pode melhorar

- **Arquitetura:** restaurar os dados de demonstração periodicamente, ou dar à conta de avaliador um acesso só de leitura.
- **Engenharia:** alinhar o PHP local ao exigido pelo projeto e proteger a `main`.
- **Produto:** o carrinho continua fixo, por exigência do teste técnico. Ligá-lo aos produtos da API é o passo para o projeto parecer uma loja real.
