<!--
  Indicador de carregamento acessível: role="status" faz o leitor de tela
  anunciar o texto, e a animação é só visual (aria-hidden).
-->
<script setup>
defineProps({
  texto: { type: String, default: 'Carregando…' },
  compacto: { type: Boolean, default: false },
})
</script>

<template>
  <div class="carregando" :class="{ 'carregando--compacto': compacto }" role="status">
    <span class="carregando__circulo" aria-hidden="true"></span>
    <span class="carregando__texto">{{ texto }}</span>
  </div>
</template>

<style scoped lang="less">
.carregando {
  display: inline-flex;
  align-items: center;
  gap: @espaco-2;
  padding: @espaco-4 0;

  &--compacto {
    padding: 0;
  }

  &__circulo {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid @cor-cinza-300;
    border-top-color: @cor-preto;
    border-radius: 50%;
    animation: girar 0.8s linear infinite;
  }

  &__texto {
    font-size: @texto-pequeno;
  }
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}
</style>
<!-- Fim de CarregandoIndicador.vue -->
