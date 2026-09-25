<!--
  Paginação acessível a partir do objeto "meta" da API do Laravel
  (current_page, last_page). Emite o número da página escolhida.
-->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  paginaAtual: { type: Number, required: true },
  ultimaPagina: { type: Number, required: true },
})

const emit = defineEmits(['mudar'])

const paginas = computed(() =>
  Array.from({ length: props.ultimaPagina }, (_, indice) => indice + 1),
)

/**
 * Emite a troca de página, ignorando páginas fora do intervalo ou a atual.
 */
function irPara(pagina) {
  if (pagina >= 1 && pagina <= props.ultimaPagina && pagina !== props.paginaAtual) {
    emit('mudar', pagina)
  }
}
</script>

<template>
  <nav v-if="ultimaPagina > 1" class="paginacao" aria-label="Paginação">
    <button
      type="button"
      class="botao botao--secundario botao--pequeno"
      :disabled="paginaAtual === 1"
      @click="irPara(paginaAtual - 1)"
    >
      Anterior
    </button>
    <ul class="paginacao__lista">
      <li v-for="pagina in paginas" :key="pagina">
        <button
          type="button"
          class="botao botao--pequeno"
          :class="{ 'botao--secundario': pagina !== paginaAtual }"
          :aria-current="pagina === paginaAtual ? 'page' : undefined"
          :aria-label="`Página ${pagina}`"
          @click="irPara(pagina)"
        >
          {{ pagina }}
        </button>
      </li>
    </ul>
    <button
      type="button"
      class="botao botao--secundario botao--pequeno"
      :disabled="paginaAtual === ultimaPagina"
      @click="irPara(paginaAtual + 1)"
    >
      Próxima
    </button>
  </nav>
</template>

<style scoped lang="less">
.paginacao {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: @espaco-2;
  margin-top: @espaco-6;

  &__lista {
    display: flex;
    gap: @espaco-1;
    margin: 0;
    padding: 0;
    list-style: none;
  }
}
</style>
<!-- Fim de PaginacaoLista.vue -->
