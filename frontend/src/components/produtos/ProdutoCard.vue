<!--
  Card de produto da vitrine. A imagem tem dimensões explícitas (evita que
  o layout "pule" enquanto carrega). Os primeiros cards ficam acima da dobra
  e um deles vira o LCP: por isso carregam já (loading="eager"), e o
  primeiro pede prioridade alta (fetchpriority="high"). Os demais usam
  lazy loading (#24).
-->
<script setup>
import { computed } from 'vue'
import { formatarPreco } from '@/utils/formatadores'

const props = defineProps({
  produto: { type: Object, required: true },
  /** Posição do card na grade, a partir de 0. */
  posicao: { type: Number, default: Infinity },
})

/** Quantos cards carregam sem lazy loading: a primeira linha no desktop. */
const CARDS_ACIMA_DA_DOBRA = 4

const carregamento = computed(() => (props.posicao < CARDS_ACIMA_DA_DOBRA ? 'eager' : 'lazy'))
const prioridade = computed(() => (props.posicao === 0 ? 'high' : 'auto'))
</script>

<template>
  <article class="card">
    <div class="card__imagem">
      <img
        v-if="produto.imagem_url"
        :src="produto.imagem_url"
        :alt="produto.nome"
        width="232"
        height="325"
        :loading="carregamento"
        :fetchpriority="prioridade"
        decoding="async"
      />
      <span v-else class="card__sem-imagem">Sem imagem</span>
    </div>
    <h2 class="card__nome">{{ produto.nome }}</h2>
    <p class="card__descricao">{{ produto.descricao }}</p>
    <p class="card__preco">{{ formatarPreco(produto.preco) }}</p>
  </article>
</template>

<style scoped lang="less">
.card {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__imagem {
    display: grid;
    place-items: center;
    aspect-ratio: 232 / 325;
    margin-bottom: @espaco-3;
    overflow: hidden;
    background: @cor-cinza-100;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__sem-imagem {
    font-size: @texto-pequeno;
    color: @cor-texto-suave;
  }

  &__nome {
    margin-bottom: @espaco-1;
    font-size: @texto-medio;
  }

  &__descricao {
    flex: 1;
    margin-bottom: @espaco-2;
    font-size: @texto-pequeno;
    color: @cor-texto-suave;
  }

  &__preco {
    margin: 0;
    font-family: @fonte-titulo;
    font-size: @texto-medio;
    font-weight: 600;
  }
}
</style>
<!-- Fim de ProdutoCard.vue -->
