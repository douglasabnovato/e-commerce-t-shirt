<!--
  Página exibida para rotas inexistentes.
-->
<template>
  <section class="container" aria-labelledby="titulo-404">
    <h1 id="titulo-404">Página não encontrada</h1>
    <p>O endereço acessado não existe.</p>
    <RouterLink :to="{ name: 'vitrine' }" class="botao">Ir para a vitrine</RouterLink>
  </section>
</template>
<!-- Fim de NaoEncontradoView.vue -->
