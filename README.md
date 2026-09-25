# E-commerce T-Shirt

E-commerce de moda desenvolvido a partir de requisitos para atender ser catálogo de camisetas, moletons e acessórios, administração de produtos com autenticação, finalização de compra e uma página com as respostas de todas as questões do teste.

### Workflow

Workflow de trabalho com branches

- main: em produção
- developer-mvp: tratar e testar
- feature/fullstack: funcionalidades

> **Status:** em desenvolvimento. O plano de ação abaixo mostra o que já está pronto.

---

## Índice

- [Exercícios do teste](#exercícios-do-teste)
- [Arquitetura](#arquitetura)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Plano de ação](#plano-de-ação)
- [Decisões técnicas](#decisões-técnicas)
- [Créditos de imagens](#créditos-de-imagens)

---

## Exercícios do teste

| Nº | Tema | Onde está |
|---|---|---|
| 1 | Vue.js: ciclo de vida | a definir |
| 2 | Laravel + Vue: autenticação | a definir |
| 3 | APIs: endpoint lento | a definir |
| 4 | Integrações: CDN | a definir |
| 5 | Memcached / ElastiCache | a definir |
| 6 | Eloquent e N+1 | a definir |
| 7 | Filas assíncronas | a definir |
| 8 | Transactions | a definir |
| 9 | Leitura de log | a definir |
| 10 | CRUD de produtos (Laravel + Vue) | a definir |
| 11 | Crítica de código | a definir |
| 12 | Página de finalização de compra | a definir |
| 13 | Experiência profissional | a definir |
| 14 | SQL: clientes e pedidos | a definir |
| 15 | SQL: produtos, fornecedores e estoque | a definir |

---

## Arquitetura

> Seção em construção. As decisões são registradas em [`docs/DECISOES.md`](docs/DECISOES.md) e esta seção é atualizada quando forem aprovadas.

Estrutura planejada do repositório:

```text
e-commerce-t-shirt/
├── backend/     API REST em Laravel
├── frontend/    SPA em Vue.js
└── docs/
    ├── REQUISITOS.md   checklist de requisitos do teste
    ├── DECISOES.md     registro das decisões técnicas
    ├── respostas/      respostas das questões (fonte da página Teste Técnico)
    └── assets/         imagens de referência do teste
```

---

## Como rodar o projeto

> Seção em construção. Será preenchida com pré-requisitos, variáveis de ambiente e comandos testados do zero.

---

## Plano de ação

### Fase 0 — Organização
- [x] Repositório criado e ligado ao GitHub
- [x] Checklist de requisitos (`docs/REQUISITOS.md`)
- [x] Registro de decisões (`docs/DECISOES.md`)
- [ ] Arquitetura e stack definidas

### Fase 1 — Backend (exercício 10)
- [ ] Projeto Laravel criado
- [ ] Migration, model e seeder de produtos
- [ ] Controller e rotas REST
- [ ] Validação com Form Request
- [ ] Upload de imagem
- [ ] Autenticação
- [ ] Testes da API

### Fase 2 — Frontend (exercícios 10 e 12)
- [ ] Projeto Vue criado
- [ ] Layout base com menu do header e estilos em LESS
- [ ] Login e administração de produtos
- [ ] Página de finalização de compra
- [ ] Acessibilidade e otimização revisadas

### Fase 3 — Respostas (exercícios 1–9, 11, 13–15)
- [ ] Respostas teóricas em `docs/respostas/`
- [ ] Queries do exercício 14
- [ ] Queries do exercício 15 (`.sql`)
- [ ] Página "Teste Técnico" exibindo todas as respostas

### Fase 4 — Entrega
- [ ] README completo (como rodar e decisões)
- [ ] Deploy em produção
- [ ] Revisão final dos requisitos

---

## Decisões técnicas

Todas as decisões, com contexto, alternativas e motivo, estão em [`docs/DECISOES.md`](docs/DECISOES.md).

---

## Créditos de imagens

As imagens de produtos utilizadas são de lojas de moda autorizadas pelo enunciado do teste (Chico Rei / Uma Penca), usadas apenas para fins de demonstração.

---

**Autor:** Douglas Antonio Braga Novato · [github.com/douglasabnovato](https://github.com/douglasabnovato)