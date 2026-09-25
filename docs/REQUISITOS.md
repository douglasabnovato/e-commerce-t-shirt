# REQUISITOS — Teste Técnico Full Stack

> Fonte: documento de especificação enviado pela empresa. O enunciado é seguido como está escrito.
> Status: ⬜ pendente · 🟨 em andamento · ✅ atendido
> "Onde" = caminho no repositório ou rota da aplicação que atende o requisito. Só é preenchido quando o item existe.

## A. Requisitos gerais

| ID | Requisito (enunciado) | Critério de "atendido" | Onde | Status |
|---|---|---|---|---|
| G1 | Respostas documentadas em repositório Git (público ou privado com acesso concedido ao avaliador) | Repositório criado; se privado, acesso do avaliador concedido e testado | github.com/douglasabnovato/e-commerce-t-shirt | 🟨 |
| G2 | Boas práticas de programação, versionamento e organização de código | Commits no padrão D9; fluxo de branches D14; nenhum `.env`, `vendor/` ou `node_modules/` versionado | — | 🟨 |
| G3 | README com instruções claras de como rodar o projeto | Passo a passo testado do zero; `.env.example` coerente com o passo a passo | README.md | ⬜ |
| G4 | README justificando as decisões técnicas | Seção de arquitetura com link para cada decisão em `docs/DECISOES.md` | README.md | 🟨 |
| G5 | Cada exercício claramente identificado | Índice 1–15 no README e na página Teste Técnico ligando cada exercício ao seu arquivo ou rota | README.md | 🟨 |

## B. Questão de front-end (vale para toda a interface)

| ID | Requisito (enunciado) | Critério de "atendido" | Onde | Status |
|---|---|---|---|---|
| F1 | Paleta de cores e fontes livres | Paleta e fontes definidas em variáveis LESS | — | ⬜ |
| F2 | Pode usar imagens da Uma Penca ou da Chico Rei | Se usadas, origem citada no README | README.md | ⬜ |
| F3 | Sugerido: fakerjs para preencher o conteúdo das páginas | `@faker-js/faker` usado com locale pt_BR nos dados de exemplo | — | ⬜ |
| F4 | Estilos prontos permitidos, mas deve-se personalizar com **LESS** | Arquivos `.less` compilados no build, definindo tamanhos, fontes, cores e espaçamentos | — | ⬜ |
| F5 | Avaliados: código limpo e organizado, documentação, acessibilidade, otimização, criatividade | Labels em todos os campos, `aria-live` nas mensagens, navegação por teclado, contraste AA, `alt` nas imagens, `lang="pt-BR"`, lazy loading, build minificado, medição Lighthouse registrada no README | — | ⬜ |

## C. Exercícios teóricos

| ID | Requisito (enunciado) | Critério de "atendido" | Onde | Status |
|---|---|---|---|---|
| E1 | Ciclo de vida de um componente Vue e como influencia a performance | Explica as fases (criação, montagem, atualização, desmontagem) e liga cada uma a um impacto de performance, com exemplos | docs/respostas/01.md | ⬜ |
| E2 | Melhor abordagem de autenticação Laravel + Vue; fluxo seguro de login; armazenamento de tokens; comunicação entre as camadas | Responde às quatro partes; compara as opções de armazenamento de token; descreve o fluxo implementado no E10 (D10) | docs/respostas/02.md | ⬜ |
| E3 | Técnicas para identificar e resolver um endpoint lento no backend | Responde às duas partes: como identificar e como resolver | docs/respostas/03.md | ⬜ |
| E4 | Como a CDN melhora a performance de uma aplicação web | Explica os mecanismos pelos quais a CDN reduz tempo de resposta e carga na origem | docs/respostas/04.md | ⬜ |
| E5 | Por que usar Memcached ou ElastiCache com Laravel + MySQL (RDS) e como ajudam na escalabilidade | Responde às duas partes | docs/respostas/05.md | ⬜ |
| E6 | Vantagens e desvantagens do Eloquent; problemas recorrentes (N+1) | Responde às três partes, com exemplo de N+1 e sua correção | docs/respostas/06.md | ⬜ |
| E7 | Como implementar filas assíncronas no Laravel e para quais funcionalidades são úteis | Responde às duas partes | docs/respostas/07.md | ⬜ |
| E8 | Quando é interessante utilizar transactions | Casos de uso com justificativa | docs/respostas/08.md | ⬜ |
| E9 | O que se entende do log apresentado | Identifica o erro e o ponto de origem; lê a pilha (dois `rememberForever` aninhados: `ProdutoController@info` e `Imagem::getThumbs()`; transformers Fractal; include `capa`; produto 667); propõe correção | docs/respostas/09.md | ⬜ |
| E11 | Criticar o código do transformer e explicar como melhorar | Aponta os problemas do código (incluindo chamadas repetidas e ausência de tratamento de nulo) e apresenta versão melhorada | docs/respostas/11.md | ⬜ |
| E13 | Projeto desafiador recente: contexto, desafios, soluções, impacto e lições aprendidas | As cinco partes presentes, com tecnologias e resultados concretos | docs/respostas/13.md | ⬜ |

## D. Exercícios práticos

### E10 — CRUD de produtos (Laravel + Vue.js)

| ID | Requisito (enunciado) | Critério de "atendido" | Onde | Status |
|---|---|---|---|---|
| E10.1 | Produto com Nome, Descrição, Preço e Imagem | Migration com os quatro campos e tipos adequados | — | ⬜ |
| E10.2 | Criação, leitura, atualização e deleção | As quatro operações funcionando pela API e pela interface | — | ⬜ |
| E10.3 | Backend: modelo, migration, controller e rotas REST para cada ação | Model, controller de recurso e rotas REST para listar, exibir, criar, atualizar e excluir | — | ⬜ |
| E10.4 | Frontend Vue: interface para consumir a API e exibir os produtos | Tela de listagem e formulário consumindo a API | — | ⬜ |
| E10.5 | Apenas usuários autenticados podem modificar produtos | Criar, atualizar e excluir exigem login; requisição sem login retorna 401 | — | ⬜ |

Itens de implementação (decisões D10 e D17, não exigidos literalmente pelo enunciado):

| ID | Item | Critério | Onde | Status |
|---|---|---|---|---|
| E10.6 | Validação no backend | Form Request aplicado no controller | — | ⬜ |
| E10.7 | Upload de imagem | Arquivo salvo via `Storage`; imagem anterior removida ao trocar e ao excluir | — | ⬜ |
| E10.8 | Login e logout na interface | Fluxo Sanctum SPA descrito no E2 | — | ⬜ |
| E10.9 | Testes | Testes de feature: 401 sem login, sucesso com login, 422 com dados inválidos | — | ⬜ |

### E12 — Página de finalização de compra

| ID | Requisito (enunciado) | Critério de "atendido" | Onde | Status |
|---|---|---|---|---|
| E12.1 | Produtos na sacola/carrinho hardcoded | Lista fixa exibida com imagem, nome, preço e quantidade | — | ⬜ |
| E12.2 | Validação de campos com formatos específicos (cartão de crédito, data, CEP, e-mail, telefone, etc.) | Todos os campos do formulário com regra de formato e mensagem por campo | — | ⬜ |
| E12.3 | Validação de campos vazios (todos obrigatórios) | Nenhum campo pode ser enviado vazio; mensagem por campo | — | ⬜ |
| E12.4 | Alteração da quantidade dos produtos | Botões − e +, quantidade mínima 1, totais recalculados | — | ⬜ |
| E12.5 | Endereço a partir do CEP com `cep-promise` | Preenche os campos de endereço; trata CEP inválido ou inexistente | — | ⬜ |
| E12.6 | Indicadores de carregamento durante requisições | Loading visível e anunciado a leitores de tela na busca do CEP e no envio | — | ⬜ |
| E12.7 | Mensagem de sucesso ao fechar o pedido, quando todos os campos forem válidos | Mensagem só aparece com o formulário inteiro válido | — | ⬜ |
| E12.8 | `console.log` do objeto final ao fechar o pedido | Objeto com itens, totais, contato, endereço e pagamento | — | ⬜ |
| E12.9 | Referência: exemplo de layout | Estrutura inspirada em `docs/assets/checkout-frontend.jpg` | — | ⬜ |

## E. Exercícios de SQL com Eloquent

### E14 — Clientes e pedidos

| ID | Requisito (enunciado) | Critério de "atendido" | Onde | Status |
|---|---|---|---|---|
| E14.1 | Query em Eloquent: estados com maior volume de vendas (soma de `valor_total`) | Query em Eloquent com agrupamento por estado e soma em ordem decrescente | docs/respostas/14.md | ⬜ |
| E14.2 | Query em Eloquent: 5 clientes que mais compraram (`valor_total`) | Query em Eloquent com soma por cliente, ordem decrescente e limite 5 | docs/respostas/14.md | ⬜ |
| E14.3 | Melhor forma de otimizar a performance dessas consultas | Proposta justificada | docs/respostas/14.md | ⬜ |

### E15 — Produtos, fornecedores e estoque

| ID | Requisito (enunciado) | Critério de "atendido" | Onde | Status |
|---|---|---|---|---|
| E15.1 | Query em Eloquent: produtos com estoque abaixo da média geral | Query em Eloquent; explica como o registro de estoque sem produto correspondente afeta a média | docs/respostas/15.txt | ⬜ |
| E15.2 | Query em Eloquent: fornecedores com produtos de preço unitário acima da média da categoria; exibir fornecedor, produto, categoria e preço; ordenar por categoria e preço unitário | Query em Eloquent com as quatro colunas e a ordenação pedida | docs/respostas/15.txt | ⬜ |
| E15.3 | Query em Eloquent: produtos mais recentes, de fornecedores do Brasil, com estoque acima da média de todos os produtos | Query em Eloquent; critério de "mais recentes" explicado | docs/respostas/15.txt | ⬜ |
| E15.4 | Queries em arquivo `.sql` ou `.txt`, com as explicações necessárias | Arquivo `15.txt` com as queries e explicações, incluindo as particularidades dos dados fornecidos | docs/respostas/15.txt | ⬜ |
| E15.5 | Sugerido: documentar as respostas e justificar as escolhas | Justificativa de cada escolha no próprio arquivo | docs/respostas/15.txt | ⬜ |

## F. Requisitos adicionais do projeto (decisões, não enunciado)

| ID | Item | Critério | Onde | Status |
|---|---|---|---|---|
| X1 | Página "Teste Técnico" no menu (D3, D13) | Todas as respostas legíveis no link de produção, com índice 1–15 e âncoras, funcionando sem o backend | — | ⬜ |
| X2 | README honesto (D5) | Cada [x] conferido no código | README.md | 🟨 |
| X3 | Autenticação coerente (D6, D10) | Estratégia da resposta do E2 igual à implementada no E10 | — | ⬜ |
| X4 | Link de produção (D15) | Aplicação publicada em origem única: API, interface, página Teste Técnico e imagens persistentes | — | ⬜ |

## G. Dúvidas

1. ~~O exercício 12 pode ficar no mesmo app Vue do exercício 10?~~ Resolvida pelo enunciado: "O teste pode ser realizado em um único projeto".
2. Horário exato de início e fim das 48h. **Em aberto.**