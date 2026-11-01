# E-commerce T-Shirt

E-commerce de moda desenvolvido como resposta a um teste técnico Full Stack (Laravel + Vue.js). Reúne catálogo de camisetas, moletons e acessórios, administração de produtos com autenticação, página de finalização de compra e uma página com as respostas de todas as questões do teste.

**Produção:** https://douglasabnovato.alwaysdata.net

| Acesso de demonstração | |
|---|---|
| E-mail | `avaliador@tshirt.test` |
| Senha | `Avaliador@2026` |

> **Status:** publicado em produção. O [plano de ação](#plano-de-ação) mostra o que está pronto; um item só recebe `[x]` quando está implementado e verificável.
> Loja de demonstração: nenhum pedido é processado ou cobrado.

---

## Índice

- [Como avaliar em 5 minutos](#como-avaliar-em-5-minutos)
- [Exercícios do teste](#exercícios-do-teste)
- [Arquitetura](#arquitetura)
- [Fluxo de trabalho](#fluxo-de-trabalho)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Deploy em produção](#deploy-em-produção)
- [Plano de ação](#plano-de-ação)
- [Requisitos do teste técnico](#requisitos-do-teste-técnico)
- [Decisões técnicas](#decisões-técnicas)
- [Créditos de imagens](#créditos-de-imagens)

---

## Como avaliar em 5 minutos

| # | Onde | O que ver | Exercício |
|---|---|---|---|
| 1 | [Teste Técnico](https://douglasabnovato.alwaysdata.net/teste-tecnico) | Respostas das 15 questões, com índice e âncora por exercício | 1 a 15 |
| 2 | [Vitrine](https://douglasabnovato.alwaysdata.net) | Produtos vindos da API, com paginação e menu por categoria | 10 |
| 3 | [Entrar](https://douglasabnovato.alwaysdata.net/login) → Admin | Login com a conta de demonstração, depois criar, editar e excluir produto com imagem | 10 |
| 4 | [Sacola / Checkout](https://douglasabnovato.alwaysdata.net/checkout) | Sacola hardcoded, quantidade, validações, CEP com `cep-promise`, carregamento, mensagem de sucesso e `console.log` (F12) | 12 |
| 5 | [`docs/respostas/15.txt`](docs/respostas/15.txt) | Queries Eloquent do exercício 15, entregues em `.txt` | 15 |

---

## Exercícios do teste

Todas as respostas também ficam na página **Teste Técnico** da aplicação, com âncora por exercício (`/teste-tecnico#ex-NN`).

| Nº | Tema | Onde fica |
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
| 12 | Página de finalização de compra | `frontend/` (rota `/checkout`) · explicação em `docs/respostas/12.md` |
| 13 | Experiência profissional | `docs/respostas/13.md` |
| 14 | SQL com Eloquent: clientes e pedidos | `docs/respostas/14.md` |
| 15 | SQL com Eloquent: produtos, fornecedores e estoque | `docs/respostas/15.txt` |

---

## Arquitetura

```text
e-commerce-t-shirt/
├── backend/     Laravel 12 · API REST · autenticação Sanctum (modo SPA)
│   └── public/spa/   build do Vue servido pelo Laravel (gerado, fora do Git)
├── frontend/    Vue 3 · Vite · Vue Router · Pinia · estilos em LESS
└── docs/
    ├── REQUISITOS.md   checklist de requisitos com critério de "atendido"
    ├── DECISOES.md     registro das decisões técnicas
    ├── respostas/      respostas das questões (fonte da página Teste Técnico)
    └── assets/         imagens de referência do teste
```

| Camada | Tecnologia | Decisão |
|---|---|---|
| Backend | Laravel 12 (PHP 8.2+; produção em PHP 8.4) | [D11](docs/DECISOES.md) |
| Frontend | Vue 3 com Composition API (`<script setup>`), Vue Router, Pinia, JavaScript | [D11](docs/DECISOES.md) |
| Autenticação | Sanctum em modo SPA: cookie de sessão HttpOnly + proteção CSRF | [D10](docs/DECISOES.md) |
| Estilos | LESS próprio (variáveis, mixins e guards), sem framework CSS | [D12](docs/DECISOES.md) |
| Página Teste Técnico | Respostas embutidas no build a partir de `docs/respostas/` | [D13](docs/DECISOES.md) |
| Checkout | Envio simulado; busca de CEP real com `cep-promise` | [D16](docs/DECISOES.md) |
| Testes | Feature tests (PHPUnit) na API e unitários (Vitest) nas validações do checkout | [D17](docs/DECISOES.md) |
| Banco de dados | MySQL (local: MariaDB do XAMPP; produção: MySQL da alwaysdata) | [D19](docs/DECISOES.md) |
| Produção | Origem única: o Laravel serve a API e o build do Vue no mesmo domínio, na alwaysdata (plano gratuito) | [D15](docs/DECISOES.md) · [D20](docs/DECISOES.md) |

### Como a produção atende o front e a API no mesmo domínio

| Caminho | Quem responde |
|---|---|
| `/api/...` | API Laravel (produtos, login, logout, usuário) |
| `/sanctum/csrf-cookie` | Sanctum (cookie CSRF) |
| `/storage/...` | Imagens dos produtos (disco `public`) |
| `/spa/...` | Arquivos estáticos do build do Vue |
| `/up` | Health check do Laravel |
| Qualquer outro caminho | `index.html` da SPA; o Vue Router decide a página (rota coringa em `backend/routes/web.php`) |

---

## Fluxo de trabalho

| Branch | Papel |
|---|---|
| `feature/fullstack` | Desenvolvimento das funcionalidades |
| `developer-mvp` | Integração e testes: recebe a `feature/fullstack` a cada checkpoint |
| `main` | Produção: recebe a `developer-mvp` apenas nos deploys; corresponde ao link publicado |

Commits no padrão convencional: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`, `build:`.

---

## Como rodar o projeto

### Pré-requisitos
- PHP 8.2+ com as extensões `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `curl` e `zip`
- Composer 2
- Node.js 22.18+ ou 24 (com o 20.19+ também funciona, mas o npm mostra um aviso de versão)
- MySQL 8 ou MariaDB 10.4+

### 1. Backend
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
API disponível em `http://localhost:8000`. O seed cria o usuário de demonstração e 12 produtos com imagem.

### 2. Frontend: modo desenvolvimento
```bash
cd frontend
npm install
npm run dev
```
Aplicação em `http://localhost:5173`. O Vite encaminha `/api`, `/sanctum` e `/storage` para o Laravel na porta 8000.

### 3. Frontend: simulando a produção (opcional)
```bash
cd frontend
npm run build     # gera backend/public/spa
```
Com o `php artisan serve` rodando, abra `http://localhost:8000`: o Laravel entrega o site completo, sem o Vite, como em produção.

### Testes
```bash
cd backend && php artisan test        # 21 testes de feature (API, autenticação e rota da SPA)
cd frontend && npm run test:unit      # 21 testes unitários (sacola, validações e máscaras do checkout, respostas)
```

---

## Deploy em produção

Hospedagem: **alwaysdata, plano gratuito** ([D20](docs/DECISOES.md)). Um único site PHP com raiz em `backend/public`, MySQL gerenciado e HTTPS no subdomínio.

### Primeira publicação (resumo)
1. No painel: banco MySQL criado, PHP 8.4 e acesso SSH ativados.
2. No servidor, via SSH: `git clone -b main` do repositório.
3. No computador local: `npm run build` do frontend e envio de `backend/public/spa` para o servidor com `scp`. O plano gratuito não tem memória suficiente para instalar as dependências do front no servidor.
4. No servidor, em `backend/`: `.env` de produção criado no próprio servidor (`APP_ENV=production`, `APP_DEBUG=false`, `APP_URL` em https, `SESSION_SECURE_COOKIE=true`, `SANCTUM_STATEFUL_DOMAINS` com o domínio), depois `composer install --no-dev --optimize-autoloader`, `php artisan key:generate`, `php artisan migrate --seed --force`, `php artisan storage:link` e `php artisan optimize`.
5. No painel: site do tipo PHP com raiz em `e-commerce-t-shirt/backend/public/` e HTTPS forçado.

### Atualização (depois de cada merge na `main`)
```bash
# computador local, na raiz do projeto, com a branch main atualizada
cd frontend && npm run build && cd ..
scp -r backend/public/spa/* <usuario>@<host-ssh>:~/e-commerce-t-shirt/backend/public/spa/

# servidor, via SSH
cd ~/e-commerce-t-shirt && git pull
cd backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize
```

O `.env` de produção nunca é versionado; a `APP_KEY` de produção é gerada no próprio servidor.

---

## Plano de ação

### Bloco 0 · Organização e ambiente
- [x] Repositório criado e ligado ao GitHub
- [x] Checklist de requisitos (`docs/REQUISITOS.md`)
- [x] Registro de decisões (`docs/DECISOES.md`)
- [x] Arquitetura e stack definidas (D10–D18)
- [x] Banco e localização definidos (D19)
- [x] Projeto Laravel 12 criado, com Sanctum instalado
- [x] Projeto Vue 3 criado, com Router, Pinia, Vitest, ESLint e Prettier

### Bloco A · Fundação
- [x] Remover as sobras dos templates (App.vue de exemplo, `stores/counter.js`, `App.spec.js`)
- [ ] Remover os READMEs padrão de `backend/` e `frontend/`
- [x] `index.html` com `lang="pt-BR"` e título do projeto
- [x] `.env.example` com MySQL e locale pt_BR
- [x] `@faker-js/faker` instalado no frontend
- [x] Proxy do Vite para `/api`, `/sanctum` e `/storage`
- [x] Base de estilos em LESS (variáveis, mixins, reset)
- [x] Header com o menu e as rotas principais

### Bloco A2 · Deploy esqueleto
- [x] Host de produção definido (D20)
- [x] Aplicação publicada e respondendo
- [x] Primeiro merge `developer-mvp → main`

### Bloco B · Ex. 10 · Backend
- [x] Migration, model e factory de produtos
- [x] Validação com Form Request
- [x] Resposta com API Resource
- [x] Controller e rotas REST para cada ação
- [x] Upload de imagem com remoção da anterior
- [x] Autenticação Sanctum SPA (login, logout, rotas protegidas)
- [x] Seeder com usuário de demonstração e produtos
- [x] Testes de feature da API

### Bloco C · Ex. 10 · Frontend
- [x] Cliente HTTP da API
- [x] Estado de autenticação (Pinia) e tela de login
- [x] Proteção das rotas de administração
- [x] Listagem de produtos
- [x] Formulário de criação e edição com preview da imagem
- [x] Exclusão de produto

### Bloco D · Ex. 12 · Finalização de compra
- [x] Layout com sacola hardcoded
- [x] Validações de formato e de campos vazios
- [x] Alteração de quantidade
- [x] Endereço pelo CEP com `cep-promise`
- [x] Indicadores de carregamento
- [x] Mensagem de sucesso e `console.log` do objeto final
- [x] Testes unitários das validações

### Bloco E · Respostas teóricas e página Teste Técnico
- [x] Respostas 01–09, 11 e 13 em `docs/respostas/`
- [ ] Revisão final da resposta do Ex. 13
- [x] Explicações dos exercícios 10 e 12
- [x] Página "Teste Técnico" com índice e âncoras

### Bloco F · Ex. 14 e 15
- [x] Queries em Eloquent do exercício 14 e resposta sobre otimização
- [x] Queries em Eloquent do exercício 15 em `docs/respostas/15.txt`, com explicações

### Bloco G · Extras (somente com os obrigatórios concluídos)
- [x] Vitrine por categoria
- [x] Paginação

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
- [x] [OBR] Respostas documentadas em repositório Git (público, ou privado com acesso concedido ao avaliador)
- [x] [OBR] Boas práticas de programação, versionamento e organização de código
- [x] [OBR] README com instruções claras de como rodar o projeto
- [x] [OBR] README com justificativa das decisões técnicas
- [x] [OBR] Cada exercício claramente identificado (o teste pode ser feito em um único projeto)

### Questão de front-end
- [x] Paleta de cores e fontes: livre escolha (Barlow e Barlow Condensed, paleta preto e branco)
- [x] Imagens do site da Uma Penca ou da Chico Rei: permitido (usadas nos produtos de exemplo)
- [x] [SUG] Usar o fakerjs (https://github.com/faker-js/faker) para preencher o conteúdo das páginas (preenchimento de exemplo no formulário de produto)
- [x] Estilos prontos (Bootstrap e afins): permitido (não utilizado, ver D12)
- [x] [OBR] Personalizar alguma coisa estilizando com **LESS** (tamanhos, fontes, cores, espaçamentos etc.)
- [ ] [AVAL] Código limpo e organizado
- [ ] [AVAL] Documentação
- [ ] [AVAL] Princípios de acessibilidade
- [ ] [AVAL] Otimização
- [ ] [AVAL] Criatividade

> Os itens [AVAL] são marcados após a revisão do Bloco H.

### Ex. 01 · Vue.js
- [x] Explicar como funciona o ciclo de vida de um componente em Vue.js
- [x] Explicar como isso influencia a performance de uma aplicação

### Ex. 02 · Laravel + Vue.js
- [x] Qual é a melhor abordagem para lidar com autenticação entre frontend e backend
- [x] Explicar um fluxo seguro para login
- [x] Armazenamento de tokens
- [x] Comunicação entre as camadas

### Ex. 03 · APIs
- [x] Técnicas para identificar o problema de um endpoint lento no backend
- [x] Técnicas para resolver o problema

### Ex. 04 · Integrações
- [x] Como a utilização de CDN melhora a performance de uma aplicação web

### Ex. 05 · Engenharia de Software e Banco de Dados
- [x] Por que seria interessante usar Memcached ou ElastiCache numa aplicação Laravel com MySQL (RDS)
- [x] Como essas tecnologias ajudam na escalabilidade

### Ex. 06 · Engenharia de Software e Banco de Dados
- [x] Vantagens de utilizar o Eloquent
- [x] Desvantagens de utilizar o Eloquent
- [x] Problemas recorrentes (N+1 queries)

### Ex. 07 · Engenharia de Software e Banco de Dados
- [x] Como implementar um sistema de filas assíncronas no Laravel
- [x] Para que tipo de funcionalidades essa abordagem é útil

### Ex. 08 · Engenharia de Software e Banco de Dados
- [x] Quando é interessante utilizar transactions

### Ex. 09 · Leitura de log
- [x] Explicar o que se entende do log apresentado no enunciado (erro `Call to a member function getImage() on null`, produto 667)

### Ex. 10 · Desenvolvimento Full-Stack (Laravel + Vue.js)
- [x] [OBR] CRUD de produtos: criação, leitura, atualização e deleção
- [x] [OBR] Cada produto contém: Nome, Descrição, Preço e Imagem
- [x] [OBR] Backend em Laravel: modelo, migration, controller e rotas REST para cada ação
- [x] [OBR] Frontend em Vue.js: interface para consumir a API e exibir os produtos
- [x] [OBR] Autenticação: apenas usuários autenticados podem modificar produtos

### Ex. 11 · Crítica de código
- [x] Criticar o código apresentado (transformer de item de pedido)
- [x] Explicar como poderia ser melhorado

### Ex. 12 · Front-end · Finalização de compra
- [x] [OBR] Produtos na sacola/carrinho hardcoded
- [x] [OBR] Validação de campos com formatos específicos (cartão de crédito, data, CEP, e-mail, telefone, etc.)
- [x] [OBR] Validação de campos vazios (todos são obrigatórios)
- [x] [OBR] Alteração da quantidade dos produtos na sacola/carrinho
- [x] [OBR] Carregamento do endereço a partir do CEP utilizando o `cep-promise`
- [x] [OBR] Indicadores de carregamento enquanto a página realizar alguma requisição
- [x] [OBR] Mensagem de sucesso ao fechar o pedido (sucesso quando todos os campos forem válidos)
- [x] [OBR] Ao fechar o pedido, exibir o objeto final no console (`console.log`)
- [x] [REF] Exemplo de layout: `docs/assets/checkout-frontend.jpg` (usado como referência)

### Ex. 13 · Experiência profissional
- [x] Descrever um projeto desafiador recente como desenvolvedor full-stack, incluindo:
  - [x] Contexto: propósito e objetivos do projeto
  - [x] Desafios: técnicos ou de gerenciamento de projetos
  - [x] Soluções: o que foi implementado e como foram usadas tecnologias como Vue.js, Laravel ou outras da vaga
  - [x] Impacto: resultados em desempenho da equipe, satisfação do cliente ou melhorias no produto
  - [x] Lições aprendidas: o que aplicaria em projetos futuros

### Ex. 14 · SQL (utilizando o Eloquent do Laravel)
Estrutura dada: `clientes (id, nome, email, estado)` e `pedidos (id, cliente_id, data_pedido, valor_total)`.
- [x] [OBR] Query em Eloquent: estados com maior volume de vendas (soma de `valor_total`)
- [x] [OBR] Query em Eloquent: 5 clientes que mais compraram (considerando `valor_total`)
- [x] Qual seria a melhor forma de otimizar a performance dessas consultas

### Ex. 15 · SQL (utilizando o Eloquent do Laravel)
Dados fornecidos no enunciado: tabelas `produtos`, `fornecedores` e `estoque`.
- [x] [OBR] Query em Eloquent: produtos que possuem estoque abaixo da média geral
- [x] [OBR] Query em Eloquent: fornecedores que possuem produtos com preço unitário maior que a média dos preços da sua categoria — exibir nome do fornecedor, nome do produto, categoria e preço; ordenar por categoria e preço unitário
- [x] [OBR] Query em Eloquent: produtos mais recentes, adquiridos de fornecedores do Brasil, com estoque acima da média de todos os produtos
- [x] [OBR] Queries escritas em arquivo `.sql` ou `.txt`, com as explicações necessárias
- [x] [SUG] Documentar as respostas e justificar as escolhas

---

## Decisões técnicas

Todas as decisões, com contexto, alternativas e motivo, estão em [`docs/DECISOES.md`](docs/DECISOES.md). As principais:

| Decisão | Resumo |
|---|---|
| D10 | Sanctum em modo SPA: sessão em cookie HttpOnly com CSRF, sem token no navegador |
| D12 | LESS próprio, sem framework CSS |
| D13 | Respostas do teste embutidas no build a partir de `docs/respostas/` |
| D15 | Front e API no mesmo domínio em produção |
| D16 | Checkout com envio simulado e CEP real |
| D19 | MySQL em todos os ambientes e locale pt_BR |
| D20 | Hospedagem gratuita na alwaysdata, com o build do front servido pelo Laravel |

### Fora do escopo do enunciado
- **Histórico de vendas / persistência de pedidos:** o Ex. 12 pede uma página de finalização com envio simulado e `console.log` do pedido; não pede API de pedidos. A evolução natural seria as tabelas `pedidos` e `itens_pedido`, uma rota `POST /api/pedidos` com transaction e uma tela de pedidos no admin.

--- 

## Próximos passos

O que o enunciado pede está entregue. Os itens abaixo são a evolução natural do projeto para um e-commerce real, em ordem de prioridade. Cada um vira uma decisão registrada em [`docs/DECISOES.md`](docs/DECISOES.md) antes de ser implementado.

### 1. Sacola de compras real
Hoje a sacola é **hardcoded**, como pede o Ex. 12: começa com 2 produtos fixos (3 itens), e a única interação é alterar a quantidade (mínimo 1, máximo 10).

Evolução:
- botão **"Adicionar à sacola"** na vitrine e na página do produto;
- **remover item** e esvaziar a sacola;
- **sacola persistida** no navegador (visitante) e no banco (usuário logado), mantida ao recarregar a página;
- preços e disponibilidade conferidos na API no momento do checkout, e não apenas no front.

### 2. Ciclo de vida do produto
Hoje o produto tem os campos pedidos no Ex. 10 (nome, descrição, preço e imagem), e a vitrine filtra por categoria pelo nome do produto (D21).

Evolução:
- **categoria** como campo próprio, com filtro direto na API;
- **variações** (tamanho e cor) com preço e estoque por variação;
- **estoque** com baixa ao confirmar o pedido e aviso de produto esgotado;
- **status** do produto (rascunho, ativo, inativo) para publicar e despublicar sem excluir;
- **exclusão lógica** (*soft delete*), preservando o histórico dos pedidos que citam o produto;
- **galeria** com mais de uma imagem e miniaturas otimizadas.

### 3. Pedidos e histórico de vendas
Hoje o checkout tem envio simulado (D16): o pedido termina na mensagem de sucesso e no `console.log`.

Evolução:
- tabelas `pedidos` e `itens_pedido`, com rota `POST /api/pedidos` gravando tudo numa **transaction** (tema do Ex. 08);
- **status do pedido** (recebido, pago, enviado, entregue, cancelado);
- tela de **pedidos e histórico de vendas** no admin, com filtros por período e indicadores (faturamento, ticket médio, produtos mais vendidos, no espírito do Ex. 14);
- e-mail de confirmação enviado por **fila** (tema do Ex. 07).

### 4. Pagamento
- Integração com um gateway de pagamento, com **tokenização do cartão** no próprio gateway. O cartão nunca passa pelo nosso servidor, e o CVC continua fora de qualquer log.

### 5. Qualidade e segurança
- Medição **Lighthouse** registrada e revisão de acessibilidade (Bloco H do plano de ação);
- testes **end-to-end** dos fluxos de login, CRUD e checkout;
- **Content Security Policy** e cabeçalhos de segurança;
- perfis de acesso (administrador e cliente) com **policies** do Laravel.

### 6. Infraestrutura
- **CI/CD** com GitHub Actions: testes a cada push e deploy automático da `main`, incluindo o build do front (hoje feito no computador local por limite de memória do plano gratuito, ver D20);
- imagens em armazenamento de objetos (S3 ou Cloudflare R2), trocando só a configuração do disco (já previsto na D15);
- cache das consultas da vitrine e CDN para os arquivos estáticos (temas dos Ex. 04 e 05).

---

## Créditos de imagens

As imagens de produtos são das lojas Chico Rei e Uma Penca, com uso permitido pelo enunciado do teste, apenas para fins de demonstração.

---

**Autor:** Douglas Antonio Braga Novato · [github.com/douglasabnovato](https://github.com/douglasabnovato)