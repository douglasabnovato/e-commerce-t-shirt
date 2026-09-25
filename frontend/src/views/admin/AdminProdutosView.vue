<!--
  Administração de produtos (Ex. 10 · CRUD). Lista os produtos em tabela,
  com ações de editar e excluir, e o botão de novo produto. Acessível só
  com login (meta.exigeLogin no router e auth:sanctum na API).
-->
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CarregandoIndicador from '@/components/ui/CarregandoIndicador.vue'
import PaginacaoLista from '@/components/ui/PaginacaoLista.vue'
import { excluirProduto, listarProdutos } from '@/services/produtos'
import { extrairErro } from '@/services/api'
import { formatarPreco } from '@/utils/formatadores'

const MENSAGENS = {
  criado: 'Produto cadastrado com sucesso.',
  atualizado: 'Produto atualizado com sucesso.',
}

const rota = useRoute()
const router = useRouter()

const produtos = ref([])
const paginacao = ref(null)
const carregando = ref(false)
const excluindoId = ref(null)
const erro = ref('')
const sucesso = ref(MENSAGENS[rota.query.aviso] ?? '')

/**
 * Carrega uma página da lista de produtos.
 */
async function carregar(pagina = 1) {
  carregando.value = true
  erro.value = ''
  try {
    const resultado = await listarProdutos({ pagina, porPagina: 10 })
    produtos.value = resultado.produtos
    paginacao.value = resultado.paginacao
  } catch (falha) {
    erro.value = extrairErro(falha).mensagem
  } finally {
    carregando.value = false
  }
}

/**
 * Pede confirmação e exclui o produto; em seguida recarrega a página atual
 * (ou a anterior, se a atual ficou vazia).
 */
async function excluir(produto) {
  if (!window.confirm(`Excluir o produto "${produto.nome}"? Esta ação não pode ser desfeita.`)) {
    return
  }
  excluindoId.value = produto.id
  erro.value = ''
  sucesso.value = ''
  try {
    await excluirProduto(produto.id)
    sucesso.value = `Produto "${produto.nome}" excluído.`
    const pagina = paginacao.value?.current_page ?? 1
    await carregar(produtos.value.length === 1 && pagina > 1 ? pagina - 1 : pagina)
  } catch (falha) {
    erro.value = extrairErro(falha).mensagem
  } finally {
    excluindoId.value = null
  }
}

onMounted(() => {
  if (rota.query.aviso) {
    router.replace({ query: {} })
  }
  carregar()
})
</script>

<template>
  <section class="container admin" aria-labelledby="titulo-admin">
    <header class="admin__topo">
      <h1 id="titulo-admin">Produtos</h1>
      <RouterLink :to="{ name: 'admin-produto-novo' }" class="botao">Novo produto</RouterLink>
    </header>

    <div aria-live="polite">
      <p v-if="sucesso" class="alerta alerta--sucesso">{{ sucesso }}</p>
    </div>
    <div v-if="erro" class="alerta alerta--erro" role="alert">{{ erro }}</div>

    <CarregandoIndicador v-if="carregando" texto="Carregando produtos…" />

    <p v-else-if="produtos.length === 0" class="alerta alerta--info">Nenhum produto cadastrado.</p>

    <template v-else>
      <div class="admin__tabela-rolagem">
        <table class="admin__tabela">
          <caption class="somente-leitor-de-tela">
            Lista de produtos cadastrados
          </caption>
          <thead>
            <tr>
              <th scope="col">Imagem</th>
              <th scope="col">Nome</th>
              <th scope="col">Preço</th>
              <th scope="col"><span class="somente-leitor-de-tela">Ações</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="produto in produtos" :key="produto.id">
              <td>
                <img
                  v-if="produto.imagem_url"
                  :src="produto.imagem_url"
                  alt=""
                  width="48"
                  height="67"
                  loading="lazy"
                  class="admin__miniatura"
                />
              </td>
              <th scope="row">{{ produto.nome }}</th>
              <td>{{ formatarPreco(produto.preco) }}</td>
              <td class="admin__acoes">
                <RouterLink
                  :to="{ name: 'admin-produto-editar', params: { id: produto.id } }"
                  class="botao botao--secundario botao--pequeno"
                  :aria-label="`Editar ${produto.nome}`"
                >
                  Editar
                </RouterLink>
                <button
                  type="button"
                  class="botao botao--perigo botao--pequeno"
                  :disabled="excluindoId === produto.id"
                  :aria-label="`Excluir ${produto.nome}`"
                  @click="excluir(produto)"
                >
                  {{ excluindoId === produto.id ? 'Excluindo…' : 'Excluir' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <PaginacaoLista
        v-if="paginacao"
        :pagina-atual="paginacao.current_page"
        :ultima-pagina="paginacao.last_page"
        @mudar="carregar"
      />
    </template>
  </section>
</template>

<style scoped lang="less">
.admin {
  &__topo {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: @espaco-3;
    margin-bottom: @espaco-5;

    h1 {
      margin: 0;
    }
  }

  &__tabela-rolagem {
    overflow-x: auto;
  }

  &__tabela {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: @espaco-2 @espaco-3;
      text-align: left;
      vertical-align: middle;
      border-bottom: 1px solid @cor-cinza-300;
    }

    thead th {
      font-family: @fonte-titulo;
      font-weight: 500;
      border-bottom-color: @cor-preto;
    }

    tbody th {
      font-weight: 400;
    }
  }

  &__miniatura {
    width: 48px;
    height: 67px;
    object-fit: cover;
  }

  &__acoes {
    white-space: nowrap;

    .botao + .botao {
      margin-left: @espaco-2;
    }
  }
}
</style>
<!-- Fim de AdminProdutosView.vue -->
