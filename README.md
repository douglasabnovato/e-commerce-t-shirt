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

## Requisitos do teste técnico

> Transcrição organizada do enunciado original.
> Legenda: **[OBR]** obrigatório · **[SUG]** sugerido · **[AVAL]** critério de avaliação · **[REF]** referência, não obrigatório.
> Um item só é marcado `[x]` quando estiver implementado e verificável no código ou no link de produção.

### Requisitos gerais
- [ ] [OBR] Respostas documentadas em repositório Git (público, ou privado com acesso concedido ao avaliador)
- [ ] [OBR] Boas práticas de programação
- [ ] [OBR] Boas práticas de versionamento
- [ ] [OBR] Boas práticas de organização de código
- [ ] [OBR] README com instruções claras de como rodar o projeto
- [ ] [OBR] README com justificativa das decisões técnicas
- [ ] [OBR] Cada exercício claramente identificado (o teste pode ser feito em um único projeto)

### Questão de front-end (vale para toda a interface)
- [ ] Paleta de cores e fontes: livre escolha
- [ ] Imagens do site da Uma Penca ou da Chico Rei: permitido
- [ ] [SUG] Usar o faker-js (https://github.com/faker-js/faker) para preencher os dados de exemplo
- [ ] Estilos prontos (Bootstrap e afins): permitido
- [ ] [OBR] Personalizar estilos com **LESS** (tamanhos, fontes, cores, espaçamentos etc.)
- [ ] [AVAL] Código limpo e organizado
- [ ] [AVAL] Documentação
- [ ] [AVAL] Princípios de acessibilidade
- [ ] [AVAL] Otimização
- [ ] [AVAL] Criatividade

### Ex. 01 · Vue.js
- [ ] Explicar como funciona o ciclo de vida de um componente em Vue.js
- [ ] Explicar como o ciclo de vida influencia a performance da aplicação

### Ex. 02 · Laravel + Vue.js
- [ ] Qual é a melhor abordagem para autenticação entre frontend e backend
- [ ] Fluxo seguro de login
- [ ] Armazenamento de tokens
- [ ] Comunicação entre as camadas

### Ex. 03 · APIs
- [ ] Técnicas para **identificar** a causa de um endpoint lento no backend
- [ ] Técnicas para **resolver** o problema

### Ex. 04 · Integrações
- [ ] Como o uso de CDN melhora a performance de uma aplicação web

### Ex. 05 · Engenharia de Software e Banco de Dados
- [ ] Por que usar Memcached ou ElastiCache numa aplicação Laravel com MySQL (RDS)
- [ ] Como essas tecnologias ajudam na escalabilidade

### Ex. 06 · Engenharia de Software e Banco de Dados
- [ ] Vantagens do Eloquent
- [ ] Desvantagens do Eloquent
- [ ] Problemas recorrentes, em especial N+1 queries

### Ex. 07 · Engenharia de Software e Banco de Dados
- [ ] Como implementar filas assíncronas no Laravel
- [ ] Para que tipo de funcionalidade essa abordagem é útil

### Ex. 08 · Engenharia de Software e Banco de Dados
- [ ] Quando é interessante usar transactions

### Ex. 09 · Leitura de log
- [ ] Explicar o que o log indica
- Elementos do log a considerar:
  - Data e ambiente: `2018-05-16 01:07:31`, `production.ERROR`
  - Erro: `Call to a member function getImage() on null` em `app/Models/Imagem.php:147` (`FatalThrowableError`)
  - O erro ocorre dentro da closure de `rememberForever('products_667_im...')`, chamada em `Imagem::getThumbs()` (`Imagem.php:157`)
  - `getThumbs()` é chamado por `ImagemTransformer::transform()` (`ImagemTransformer.php:25`)
  - O `ImagemTransformer` é executado pelo include `'capa'` do `ProdutoTransformer` (Fractal)
  - A resposta é montada pelo `ResponseFactory` (`handleItem` → `create`)
  - Tudo roda dentro de outro `rememberForever('products_667_in...')`, em `Api\ProdutoController@info` (`ProdutoController.php:182`)
  - Produto envolvido: id 667
  - Middlewares no caminho: `AuthenticateApi`, `Localize`, `HandleCors`/`HandlePreflight` (barryvdh/laravel-cors), `SubstituteBindings`, `CheckForMaintenanceMode`

### Ex. 10 · Desenvolvimento Full-Stack (Laravel + Vue.js) · CRUD de produtos
- [ ] [OBR] Criação de produtos
- [ ] [OBR] Leitura de produtos
- [ ] [OBR] Atualização de produtos
- [ ] [OBR] Deleção de produtos
- [ ] [OBR] Campos do produto: Nome, Descrição, Preço, Imagem
- [ ] [OBR] Backend Laravel: model
- [ ] [OBR] Backend Laravel: migration
- [ ] [OBR] Backend Laravel: controller
- [ ] [OBR] Backend Laravel: rotas REST para cada ação
- [ ] [OBR] Frontend Vue.js: interface que consome a API
- [ ] [OBR] Frontend Vue.js: exibição dos produtos
- [ ] [OBR] Autenticação: apenas usuários autenticados podem modificar produtos

### Ex. 11 · Crítica de código (transformer de item de pedido)
- [ ] Criticar o código
- [ ] Explicar como poderia ser melhorado
- Fatos do código a considerar:
  - `getProduct()` é chamado 4 vezes (`getName`, `getLinkRewrite`, `isActive`, `getType`)
  - `getSize()` é chamado 3 vezes (`getName`, `getGender`, `getLongGender`)
  - Não há tratamento para `getProduct()` ou `getSize()` retornarem nulo
  - Nomes de chaves misturam português e inglês (`item_pedido_id` e `product_id`)

### Ex. 12 · Front-end · Finalização de compra
- [ ] [OBR] Produtos da sacola hardcoded
- [ ] [OBR] Validação de formato: cartão de crédito
- [ ] [OBR] Validação de formato: data
- [ ] [OBR] Validação de formato: CEP
- [ ] [OBR] Validação de formato: e-mail
- [ ] [OBR] Validação de formato: telefone
- [ ] [OBR] Validação de formato: demais campos ("etc." — titular, CVC, número, rua, bairro, cidade, estado)
- [ ] [OBR] Validação de campos vazios (todos os campos são obrigatórios)
- [ ] [OBR] Alteração da quantidade dos produtos na sacola
- [ ] [OBR] Endereço carregado a partir do CEP com `cep-promise`
- [ ] [OBR] Indicador de carregamento durante qualquer requisição
- [ ] [OBR] Mensagem de sucesso ao fechar o pedido (sucesso = todos os campos válidos)
- [ ] [OBR] `console.log` do objeto final ao fechar o pedido
- [ ] [REF] Layout de exemplo (`docs/assets/checkout-frontend.jpg`): duas colunas; "Finalização do pedido" (Contato, Entrega, Pagamento, botão "Fechar pedido") e "Sua sacola" (imagem, nome, preço, quantidade − e +); preto e branco

### Ex. 13 · Experiência profissional
- [ ] Descrever um projeto desafiador recente como desenvolvedor full-stack, com:
  - [ ] Contexto: propósito e objetivos do projeto
  - [ ] Desafios: técnicos ou de gerenciamento de projeto
  - [ ] Soluções: o que foi implementado e como foram usadas tecnologias como Vue.js, Laravel ou outras da vaga
  - [ ] Impacto: resultados em desempenho da equipe, satisfação do cliente ou melhoria do produto
  - [ ] Lições aprendidas: o que aplicaria em projetos futuros

### Ex. 14 · SQL (usando Eloquent)
Estrutura dada: `clientes (id, nome, email, estado)` e `pedidos (id, cliente_id, data_pedido, valor_total)`, com FK `pedidos.cliente_id → clientes.id`.
- [ ] [OBR] Query **em Eloquent**: estados com maior volume de vendas (soma de `valor_total`)
- [ ] [OBR] Query **em Eloquent**: 5 clientes que mais compraram (por `valor_total`)
- [ ] Melhor forma de otimizar a performance dessas consultas

### Ex. 15 · SQL (usando Eloquent) · produtos, fornecedores e estoque
Dados dados: `produtos` (4 registros), `fornecedores` (4 registros), `estoque` (5 registros).
- [ ] [OBR] Query **em Eloquent**: produtos com estoque abaixo da média geral
- [ ] [OBR] Query **em Eloquent**: fornecedores com produtos cujo preço unitário é maior que a média da sua categoria — exibir nome do fornecedor, nome do produto, categoria e preço; ordenar por categoria e preço unitário
- [ ] [OBR] Query **em Eloquent**: produtos mais recentes, de fornecedores do Brasil, com estoque acima da média de todos os produtos
- [ ] [OBR] Entregar as queries em arquivo `.sql` ou `.txt`, com as explicações necessárias
- [ ] [SUG] Documentar as respostas e justificar as escolhas
- Particularidades dos dados a documentar:
  - [ ] Estoque id 5 referencia `produto_id = 5`, que não existe em `produtos` (registro órfão)
  - [ ] Fornecedor D (Brasil, ativo) não tem produtos
  - [ ] Fornecedor C está inativo (o enunciado não diz se inativos devem ser filtrados)
  - [ ] "Mais recentes" não tem critério definido no enunciado (por data de aquisição; quantidade ou período não especificados)


---

## Decisões técnicas

Todas as decisões, com contexto, alternativas e motivo, estão em [`docs/DECISOES.md`](docs/DECISOES.md).

---

## Créditos de imagens

As imagens de produtos utilizadas são de lojas de moda autorizadas pelo enunciado do teste (Chico Rei / Uma Penca), usadas apenas para fins de demonstração.

---

**Autor:** Douglas Antonio Braga Novato · [github.com/douglasabnovato](https://github.com/douglasabnovato)