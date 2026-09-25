<!--
  Componente raiz: link para pular direto ao conteúdo (acessibilidade por
  teclado), cabeçalho, área principal com a página da rota atual e rodapé.
  Ao trocar de página, o foco vai para o conteúdo principal, para que o
  leitor de tela anuncie a nova página.
-->
<script setup>
import { nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const rota = useRoute()
const conteudo = ref(null)

/**
 * Move o foco para o <main> após cada troca de página (exceto quando a
 * navegação é só para uma âncora na mesma página).
 */
watch(
  () => rota.path,
  async (_novo, anterior) => {
    if (anterior === undefined) {
      return
    }
    await nextTick()
    conteudo.value?.focus({ preventScroll: true })
  },
)
</script>

<template>
  <a class="pular-para-conteudo" href="#conteudo">Pular para o conteúdo</a>
  <AppHeader />
  <main id="conteudo" ref="conteudo" class="principal" tabindex="-1">
    <RouterView />
  </main>
  <AppFooter />
</template>

<style lang="less">
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.principal {
  flex: 1;
  padding: @espaco-6 0 @espaco-7;

  &:focus {
    outline: none;
  }
}
</style>
<!-- Fim de App.vue -->
