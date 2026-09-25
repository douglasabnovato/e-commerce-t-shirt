<!--
  Painel "Sua sacola" do checkout (Ex. 12): itens hardcoded da store, com
  imagem, nome, preço e quantidade alterável pelos botões − e + ou pelo
  campo numérico. O total é recalculado a cada mudança e anunciado aos
  leitores de tela.
-->
<script setup>
import { QUANTIDADE_MAXIMA, QUANTIDADE_MINIMA, useSacolaStore } from '@/stores/sacola'
import { formatarPreco } from '@/utils/formatadores'

defineProps({
  bloqueada: { type: Boolean, default: false },
})

const sacola = useSacolaStore()

/**
 * Atualiza a quantidade digitada no campo numérico e devolve ao campo o
 * valor corrigido (limitado entre o mínimo e o máximo).
 */
function aoAlterarQuantidade(item, evento) {
  sacola.definirQuantidade(item.id, evento.target.value)
  evento.target.value = item.quantidade
}
</script>

<template>
  <section class="sacola" aria-labelledby="titulo-sacola">
    <h2 id="titulo-sacola" class="sacola__titulo">Sua sacola</h2>

    <ul class="sacola__lista">
      <li v-for="item in sacola.itens" :key="item.id" class="sacola__item">
        <img :src="item.imagem" alt="" width="96" height="134" class="sacola__imagem" />
        <div class="sacola__detalhes">
          <p class="sacola__nome">{{ item.nome }}</p>
          <p class="sacola__preco">{{ formatarPreco(item.preco) }}</p>

          <div class="sacola__quantidade" role="group" :aria-label="`Quantidade de ${item.nome}`">
            <span class="sacola__rotulo-quantidade" aria-hidden="true">Quantidade</span>
            <div class="sacola__controles">
              <button
                type="button"
                class="sacola__botao"
                :aria-label="`Diminuir quantidade de ${item.nome}`"
                :disabled="bloqueada || item.quantidade <= QUANTIDADE_MINIMA"
                @click="sacola.diminuir(item.id)"
              >
                <span aria-hidden="true">−</span>
              </button>
              <input
                class="sacola__numero"
                type="number"
                inputmode="numeric"
                :min="QUANTIDADE_MINIMA"
                :max="QUANTIDADE_MAXIMA"
                :value="item.quantidade"
                :aria-label="`Quantidade de ${item.nome}`"
                :disabled="bloqueada"
                @change="aoAlterarQuantidade(item, $event)"
              />
              <button
                type="button"
                class="sacola__botao"
                :aria-label="`Aumentar quantidade de ${item.nome}`"
                :disabled="bloqueada || item.quantidade >= QUANTIDADE_MAXIMA"
                @click="sacola.aumentar(item.id)"
              >
                <span aria-hidden="true">+</span>
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <dl class="sacola__totais" aria-live="polite">
      <div>
        <dt>Itens</dt>
        <dd>{{ sacola.quantidadeTotal }}</dd>
      </div>
      <div class="sacola__total">
        <dt>Total</dt>
        <dd>{{ formatarPreco(sacola.subtotal) }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped lang="less">
.sacola {
  padding: @espaco-5;
  background: @cor-painel;

  &__titulo {
    font-size: @texto-grande;
  }

  &__lista {
    margin: 0 0 @espaco-4;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    gap: @espaco-4;
    padding-bottom: @espaco-4;
    margin-bottom: @espaco-4;
    border-bottom: 1px solid @cor-cinza-300;
  }

  &__imagem {
    flex-shrink: 0;
    width: 96px;
    height: 134px;
    object-fit: cover;
    background: @cor-cinza-100;
  }

  &__detalhes p {
    margin: 0 0 @espaco-1;
  }

  &__nome {
    font-family: @fonte-titulo;
    font-size: @texto-medio;
  }

  &__rotulo-quantidade {
    display: block;
    margin: @espaco-2 0 @espaco-1;
    font-size: @texto-pequeno;
  }

  &__controles {
    display: flex;
    align-items: center;
    gap: @espaco-2;
  }

  &__botao {
    width: 2.25rem;
    height: 2.25rem;
    font-size: @texto-medio;
    line-height: 1;
    color: @cor-branco;
    background: @cor-preto;
    border: 0;
    border-radius: @raio;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }
  }

  &__numero {
    width: 3.25rem;
    height: 2.25rem;
    font: inherit;
    text-align: center;
    background: @cor-branco;
    border: 1px solid @cor-preto;
    border-radius: @raio;
    appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      appearance: none;
      margin: 0;
    }
  }

  &__totais {
    margin: 0;

    div {
      display: flex;
      justify-content: space-between;
      padding: @espaco-1 0;
    }

    dd {
      margin: 0;
    }
  }

  &__total {
    font-family: @fonte-titulo;
    font-size: @texto-medio;
    font-weight: 600;
    border-top: 1px solid @cor-preto;
  }
}
</style>
<!-- Fim de SacolaResumo.vue -->
