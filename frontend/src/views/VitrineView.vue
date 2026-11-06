<!--
  Vitrine pública (Ex. 10 · "exibir os produtos"). Lista os produtos da API
  com paginação, filtro por categoria do menu e ordenação. A categoria, a
  ordem e a página ficam na URL (?categoria=…&ordem=…&pagina=…), então o
  resultado pode ser compartilhado e o botão Voltar do navegador funciona.
-->
<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProdutoCard from '@/components/produtos/ProdutoCard.vue'
import CarregandoIndicador from '@/components/ui/CarregandoIndicador.vue'
import PaginacaoLista from '@/components/ui/PaginacaoLista.vue'
import { listarProdutos } from '@/services/produtos'
import { extrairErro } from '@/services/api'
import { buscarCategoria } from '@/utils/categorias'
import { ORDENACOES, normalizarOrdenacao, queryComOrdenacao } from '@/utils/ordenacao'

const rota = useRoute()
const router = useRouter()

const produtos = ref([])
const paginacao = ref(null)
const carregando = ref(false)
const erro = ref('')

const categoria = computed(() => buscarCategoria(rota.query.categoria))
const titulo = computed(() => categoria.value?.rotulo ?? 'Todos os produtos')
const paginaAtual = computed(() => Math.max(1, Number(rota.query.pagina) || 1))
const ordem = computed(() => normalizarOrdenacao(rota.query.ordem))

/**
 * Busca a página atual de produtos na API, aplicando o filtro de categoria.
 */
async function carregar() {
  carregando.value = true
  erro.value = ''
  try {
    const resultado = await listarProdutos({
      pagina: paginaAtual.value,
      busca: categoria.value?.busca,
      ordem: ordem.value,
    })
    produtos.value = resultado.produtos
    paginacao.value = resultado.paginacao
  } catch (falha) {
    erro.value = extrairErro(falha).mensagem
    produtos.value = []
  } finally {
    carregando.value = false
  }
}

/**
 * Troca de página mantendo a categoria na URL.
 */
function mudarPagina(pagina) {
  router.push({ query: { ...rota.query, pagina } })
}

/**
 * Troca a ordenação e volta para a primeira página.
 */
function mudarOrdem(evento) {
  router.push({ query: queryComOrdenacao(rota.query, evento.target.value) })
}

watch(() => [rota.query.categoria, rota.query.pagina, ordem.value], carregar, { immediate: true })
</script>

<template>
  <section class="container vitrine" aria-labelledby="titulo-vitrine">
    <header class="vitrine__topo">
      <h1 id="titulo-vitrine">{{ titulo }}</h1>
      <div class="vitrine__acoes">
        <p v-if="paginacao && !carregando" class="vitrine__total">
          {{ paginacao.total }} {{ paginacao.total === 1 ? 'produto' : 'produtos' }}
        </p>
        <label class="vitrine__ordem" for="ordem-vitrine">
          <span>Ordenar por</span>
          <select
            id="ordem-vitrine"
            class="campo__entrada"
            data-testid="ordem-vitrine"
            :value="ordem"
            @change="mudarOrdem"
          >
            <option v-for="opcao in ORDENACOES" :key="opcao.valor" :value="opcao.valor">
              {{ opcao.rotulo }}
            </option>
          </select>
        </label>
      </div>
    </header>

    <CarregandoIndicador v-if="carregando" texto="Carregando produtos…" />

    <div v-else-if="erro" class="alerta alerta--erro" role="alert">
      <p>{{ erro }}</p>
      <button type="button" class="botao botao--secundario botao--pequeno" @click="carregar">
        Tentar novamente
      </button>
    </div>

    <p v-else-if="produtos.length === 0" class="alerta alerta--info">
      Nenhum produto encontrado nesta categoria.
    </p>

    <template v-else>
      <ul class="vitrine__grade">
        <li v-for="produto in produtos" :key="produto.id">
          <ProdutoCard :produto="produto" />
        </li>
      </ul>
      <PaginacaoLista
        v-if="paginacao"
        :pagina-atual="paginacao.current_page"
        :ultima-pagina="paginacao.last_page"
        @mudar="mudarPagina"
      />
    </template>
  </section>
</template>

<style scoped lang="less">
.vitrine {
  &__topo {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: @espaco-3;
    margin-bottom: @espaco-5;
    padding-bottom: @espaco-3;
    border-bottom: 1px solid @cor-cinza-300;

    h1 {
      margin: 0;
    }
  }

  &__acoes {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: @espaco-3 @espaco-5;
  }

  &__total {
    margin: 0;
    color: @cor-texto-suave;
  }

  &__ordem {
    display: flex;
    align-items: center;
    gap: @espaco-2;
    font-size: @texto-pequeno;

    select {
      width: auto;
    }
  }

  &__grade {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: @espaco-6 @espaco-4;
    margin: 0;
    padding: 0;
    list-style: none;

    .acima-de(@bp-tablet, {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    });

    .acima-de(@bp-desktop, {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: @espaco-6 @espaco-5;
    });
  }
}
</style>
<!-- Fim de VitrineView.vue -->
