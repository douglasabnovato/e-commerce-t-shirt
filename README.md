# E-commerce T-Shirt

E-commerce de moda desenvolvido como resposta a um teste técnico Full Stack (Laravel + Vue.js). Reúne catálogo de camisetas, moletons e acessórios, administração de produtos com autenticação, página de finalização de compra e uma página com as respostas de todas as questões do teste.

> **Status:** em desenvolvimento. O [plano de ação](#plano-de-ação) mostra o que já está pronto. Um item só recebe `[x]` quando estiver implementado e verificável.

---

## Índice

- [Exercícios do teste](#exercícios-do-teste)
- [Arquitetura](#arquitetura)
- [Fluxo de trabalho](#fluxo-de-trabalho)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Plano de ação](#plano-de-ação)
- [Requisitos do teste técnico](#requisitos-do-teste-técnico)
- [Decisões técnicas](#decisões-técnicas)
- [Créditos de imagens](#créditos-de-imagens)

---

## Exercícios do teste

Todas as respostas também ficam na página **Teste Técnico** da aplicação, com âncora por exercício (`/teste-tecnico#ex-NN`).

| Nº | Tema | Onde fica (planejado) |
|---|---|---|
| 1 | Vue.js: ciclo de vida e performance | `docs/respostas/01.md` |
| 2 | Laravel + Vue: autenticação | `docs/respostas/02.md` |
| 3 | APIs: endpoint lento | `docs/respostas/03.md` |
| 4 | Integrações: CDN | `docs/respostas/04.md` |
| 5 | Memcached / ElastiCache com MySQL (RDS) | `docs/respostas/05.md` |
| 6 | Eloquent e N+1 | `docs/respostas/06.md` |
| 7 | Filas assíncronas | `docs/respostas/07.md` |
| 8 | Transactions | `docs/respostas/08.md` |
| 9 | Leitura de log | `docs/respostas/09.md` |
| 10 | CRUD de produtos (Laravel + Vue) | `backend/` (API) e `frontend/` (tela de administração) · explicação em `docs/respostas/10.md` |
| 11 | Crítica de código | `docs/respostas/11.md` |
| 12 | Página de finalização de compra | `frontend/` (rota do checkout) · explicação em `docs/respostas/12.md` |
| 13 | Experiência profissional | `docs/respostas/13.md` |
| 14 | SQL com Eloquent: clientes e pedidos | `docs/respostas/14.md` |
| 15 | SQL com Eloquent: produtos, fornecedores e estoque | `docs/respostas/15.txt` |

---

## Arquitetura

```text
e-commerce-t-shirt/
├── backend/     Laravel 12 · API REST · autenticação Sanctum (modo SPA)
├── frontend/    Vue 3 · Vite · Vue Router · Pinia · estilos em LESS
└── docs/
    ├── REQUISITOS.md   checklist de requisitos com critério de "atendido"
    ├── DECISOES.md     registro das decisões técnicas
    ├── respostas/      respostas das questões (fonte da página Teste Técnico)
    └── assets/         imagens de referência do teste
```

| Camada | Tecnologia | Decisão |
|---|---|---|
| Backend | Laravel 12 (PHP 8.2+) | [D11](docs/DECISOES.md) |
| Frontend | Vue 3 com Composition API (`<script setup>`), Vue Router, Pinia, JavaScript | [D11](docs/DECISOES.md) |
| Autenticação | Sanctum em modo SPA: cookie de sessão HttpOnly + proteção CSRF | [D10](docs/DECISOES.md) |
| Estilos | LESS próprio, sem framework CSS | [D12](docs/DECISOES.md) |
| Página Teste Técnico | Respostas embutidas no build a partir de `docs/respostas/` | [D13](docs/DECISOES.md) |
| Banco de dados | MySQL | [D19](docs/DECISOES.md) |
| Produção | Origem única: o Laravel serve a API e o build do Vue no mesmo domínio | [D15](docs/DECISOES.md) |

---

## Fluxo de trabalho

| Branch | Papel |
|---|---|
| `feature/fullstack` | Desenvolvimento das funcionalidades |
| `developer-mvp` | Integração e testes: recebe a `feature/fullstack` a cada checkpoint (H12, H24, H36) |
| `main` | Produção: recebe a `developer-mvp` apenas nos deploys |

Commits no padrão convencional: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`.

---

## Como rodar o projeto

> Rascunho. Esta seção será testada do zero, em máquina limpa, antes da entrega.

### Pré-requisitos
- PHP 8.2+ com as extensões `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `curl` e `zip`
- Composer 2
- Node.js 20.19+ e npm
- MySQL 8 ou MariaDB 10.4+

### Backend
```bash
mysql -u root -e "CREATE DATABASE e_commerce_t_shirt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```
API disponível em `http://localhost:8000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Aplicação disponível em `http://localhost:5173`.

### Testes
```bash
cd backend && php artisan test
cd frontend && npm run test:unit
```

---

## Plano de ação

### Bloco 0 · Organização e ambiente
- [x] Repositório criado e ligado ao GitHub
- [x] Checklist de requisitos (`docs/REQUISITOS.md`)
- [x] Registro de decisões (`docs/DECISOES.md`)
- [x] Arquitetura e stack definidas (D10–D18)
- [ ] Banco e localização definidos (D19)
- [x] Projeto Laravel 12 criado, com Sanctum instalado
- [x] Projeto Vue 3 criado, com Router, Pinia, Vitest, ESLint e Prettier

### Bloco A · Fundação
- [ ] Remover as sobras dos templates (App.vue de exemplo, `stores/counter.js`, `App.spec.js`, READMEs padrão)
- [ ] `index.html` com `lang="pt-BR"` e título do projeto
- [ ] `.env.example` com MySQL e locale pt_BR
- [ ] `@faker-js/faker` instalado no frontend
- [ ] Proxy do Vite para `/api` e `/sanctum`
- [ ] Base de estilos em LESS (variáveis, mixins, reset)
- [ ] Header com o menu e as rotas principais

### Bloco A2 · Deploy esqueleto
- [ ] Host de produção definido
- [ ] Aplicação mínima publicada e respondendo
- [ ] Primeiro merge `developer-mvp → main`

### Bloco B · Ex. 10 · Backend
- [ ] Migration, model e factory de produtos
- [ ] Validação com Form Request
- [ ] Resposta com API Resource
- [ ] Controller e rotas REST para cada ação
- [ ] Upload de imagem com remoção da anterior
- [ ] Autenticação Sanctum SPA (login, logout, rotas protegidas)
- [ ] Seeder com usuário de demonstração e produtos
- [ ] Testes de feature da API

### Bloco C · Ex. 10 · Frontend
- [ ] Cliente HTTP da API
- [ ] Estado de autenticação (Pinia) e tela de login
- [ ] Proteção das rotas de administração
- [ ] Listagem de produtos
- [ ] Formulário de criação e edição com preview da imagem
- [ ] Exclusão de produto

### Bloco D · Ex. 12 · Finalização de compra
- [ ] Layout com sacola hardcoded
- [ ] Validações de formato e de campos vazios
- [ ] Alteração de quantidade
- [ ] Endereço pelo CEP com `cep-promise`
- [ ] Indicadores de carregamento
- [ ] Mensagem de sucesso e `console.log` do objeto final
- [ ] Testes unitários das validações

### Bloco E · Respostas teóricas e página Teste Técnico
- [ ] Respostas 01–09, 11 e 13 em `docs/respostas/`
- [ ] Explicações dos exercícios 10 e 12
- [ ] Página "Teste Técnico" com índice e âncoras

### Bloco F · Ex. 14 e 15
- [ ] Queries em Eloquent do exercício 14 e resposta sobre otimização
- [ ] Queries em Eloquent do exercício 15 em `docs/respostas/15.txt`, com explicações

### Bloco G · Extras (somente com os obrigatórios concluídos)
- [ ] Vitrine por categoria
- [ ] Paginação

### Bloco H · Qualidade
- [ ] Revisão de acessibilidade
- [ ] Revisão de otimização (medição Lighthouse registrada)
- [ ] "Como rodar" testado do zero

### Bloco I · Entrega
- [ ] Deploy final
- [ ] Varredura final dos requisitos
- [ ] Acesso do avaliador ao repositório conferido

---

## Requisitos do teste técnico

> Transcrição organizada do enunciado original.
> Legenda: **[OBR]** obrigatório · **[SUG]** sugerido · **[AVAL]** critério de avaliação · **[REF]** referência, não obrigatório.
> O critério de "atendido" e a evidência de cada item ficam em [`docs/REQUISITOS.md`](docs/REQUISITOS.md).

### Requisitos gerais
- [ ] [OBR] Respostas documentadas em repositório Git (público, ou privado com acesso concedido ao avaliador)
- [ ] [OBR] Boas práticas de programação, versionamento e organização de código
- [ ] [OBR] README com instruções claras de como rodar o projeto
- [ ] [OBR] README com justificativa das decisões técnicas
- [ ] [OBR] Cada exercício claramente identificado (o teste pode ser feito em um único projeto)

### Questão de front-end
- [ ] Paleta de cores e fontes: livre escolha
- [ ] Imagens do site da Uma Penca ou da Chico Rei: permitido
- [ ] [SUG] Usar o fakerjs (https://github.com/faker-js/faker) para preencher o conteúdo das páginas
- [ ] Estilos prontos (Bootstrap e afins): permitido
- [ ] [OBR] Personalizar alguma coisa estilizando com **LESS** (tamanhos, fontes, cores, espaçamentos etc.)
- [ ] [AVAL] Código limpo e organizado
- [ ] [AVAL] Documentação
- [ ] [AVAL] Princípios de acessibilidade
- [ ] [AVAL] Otimização
- [ ] [AVAL] Criatividade

### Ex. 01 · Vue.js
- [ ] Explicar como funciona o ciclo de vida de um componente em Vue.js
- [ ] Explicar como isso influencia a performance de uma aplicação

### Ex. 02 · Laravel + Vue.js
- [ ] Qual é a melhor abordagem para lidar com autenticação entre frontend e backend
- [ ] Explicar um fluxo seguro para login
- [ ] Armazenamento de tokens
- [ ] Comunicação entre as camadas

### Ex. 03 · APIs
- [ ] Técnicas para identificar o problema de um endpoint lento no backend
- [ ] Técnicas para resolver o problema

### Ex. 04 · Integrações
- [ ] Como a utilização de CDN melhora a performance de uma aplicação web

### Ex. 05 · Engenharia de Software e Banco de Dados
- [ ] Por que seria interessante usar Memcached ou ElastiCache numa aplicação Laravel com MySQL (RDS)
- [ ] Como essas tecnologias ajudam na escalabilidade

### Ex. 06 · Engenharia de Software e Banco de Dados
- [ ] Vantagens de utilizar o Eloquent
- [ ] Desvantagens de utilizar o Eloquent
- [ ] Problemas recorrentes (N+1 queries)

### Ex. 07 · Engenharia de Software e Banco de Dados
- [ ] Como implementar um sistema de filas assíncronas no Laravel
- [ ] Para que tipo de funcionalidades essa abordagem é útil

### Ex. 08 · Engenharia de Software e Banco de Dados
- [ ] Quando é interessante utilizar transactions

### Ex. 09 · Leitura de log
- [ ] Explicar o que se entende do log apresentado no enunciado (erro `Call to a member function getImage() on null`, produto 667)

### Ex. 10 · Desenvolvimento Full-Stack (Laravel + Vue.js)
- [ ] [OBR] CRUD de produtos: criação, leitura, atualização e deleção
- [ ] [OBR] Cada produto contém: Nome, Descrição, Preço e Imagem
- [ ] [OBR] Backend em Laravel: modelo, migration, controller e rotas REST para cada ação
- [ ] [OBR] Frontend em Vue.js: interface para consumir a API e exibir os produtos
- [ ] [OBR] Autenticação: apenas usuários autenticados podem modificar produtos

### Ex. 11 · Crítica de código
- [ ] Criticar o código apresentado (transformer de item de pedido)
- [ ] Explicar como poderia ser melhorado

### Ex. 12 · Front-end · Finalização de compra
- [ ] [OBR] Produtos na sacola/carrinho hardcoded
- [ ] [OBR] Validação de campos com formatos específicos (cartão de crédito, data, CEP, e-mail, telefone, etc.)
- [ ] [OBR] Validação de campos vazios (todos são obrigatórios)
- [ ] [OBR] Alteração da quantidade dos produtos na sacola/carrinho
- [ ] [OBR] Carregamento do endereço a partir do CEP utilizando o `cep-promise`
- [ ] [OBR] Indicadores de carregamento enquanto a página realizar alguma requisição
- [ ] [OBR] Mensagem de sucesso ao fechar o pedido (sucesso quando todos os campos forem válidos)
- [ ] [OBR] Ao fechar o pedido, exibir o objeto final no console (`console.log`)
- [ ] [REF] Exemplo de layout: `docs/assets/checkout-frontend.jpg`

### Ex. 13 · Experiência profissional
- [ ] Descrever um projeto desafiador recente como desenvolvedor full-stack, incluindo:
  - [ ] Contexto: propósito e objetivos do projeto
  - [ ] Desafios: técnicos ou de gerenciamento de projetos
  - [ ] Soluções: o que foi implementado e como foram usadas tecnologias como Vue.js, Laravel ou outras da vaga
  - [ ] Impacto: resultados em desempenho da equipe, satisfação do cliente ou melhorias no produto
  - [ ] Lições aprendidas: o que aplicaria em projetos futuros

### Ex. 14 · SQL (utilizando o Eloquent do Laravel)
Estrutura dada: `clientes (id, nome, email, estado)` e `pedidos (id, cliente_id, data_pedido, valor_total)`.
- [ ] [OBR] Query em Eloquent: estados com maior volume de vendas (soma de `valor_total`)
- [ ] [OBR] Query em Eloquent: 5 clientes que mais compraram (considerando `valor_total`)
- [ ] Qual seria a melhor forma de otimizar a performance dessas consultas

### Ex. 15 · SQL (utilizando o Eloquent do Laravel)
Dados fornecidos no enunciado: tabelas `produtos`, `fornecedores` e `estoque`.
- [ ] [OBR] Query em Eloquent: produtos que possuem estoque abaixo da média geral
- [ ] [OBR] Query em Eloquent: fornecedores que possuem produtos com preço unitário maior que a média dos preços da sua categoria — exibir nome do fornecedor, nome do produto, categoria e preço; ordenar por categoria e preço unitário
- [ ] [OBR] Query em Eloquent: produtos mais recentes, adquiridos de fornecedores do Brasil, com estoque acima da média de todos os produtos
- [ ] [OBR] Queries escritas em arquivo `.sql` ou `.txt`, com as explicações necessárias
- [ ] [SUG] Documentar as respostas e justificar as escolhas

---

## Decisões técnicas

Todas as decisões, com contexto, alternativas e motivo, estão em [`docs/DECISOES.md`](docs/DECISOES.md).

---

## Créditos de imagens

As imagens de produtos são das lojas Chico Rei e Uma Penca, com uso permitido pelo enunciado do teste, apenas para fins de demonstração.

---

**Autor:** Douglas Antonio Braga Novato · [github.com/douglasabnovato](https://github.com/douglasabnovato)