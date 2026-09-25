<!--
  Rodapé com a identificação do projeto, o aviso de loja de demonstração
  (nenhum pedido é processado) e o crédito das imagens (uso permitido pelo
  enunciado do teste).
-->
<template>
  <footer class="rodape">
    <div class="container rodape__conteudo">
      <p>
        Projeto do teste técnico Full Stack (Laravel + Vue.js) ·
        <a href="https://github.com/douglasabnovato/e-commerce-t-shirt" rel="noopener"
          >código no GitHub</a
        >
      </p>
      <p>Loja de demonstração: nenhum pedido é processado ou cobrado.</p>
      <p class="rodape__credito">
        Imagens de produtos: Chico Rei / Uma Penca, usadas apenas para demonstração.
      </p>
    </div>
  </footer>
</template>

<style scoped lang="less">
.rodape {
  padding: @espaco-5 0;
  font-size: @texto-pequeno;
  color: @cor-branco;
  background: @cor-preto;

  p {
    margin: 0 0 @espaco-2;
  }

  &__credito {
    color: @cor-cinza-300;
  }
}
</style>
<!-- Fim de AppFooter.vue -->
