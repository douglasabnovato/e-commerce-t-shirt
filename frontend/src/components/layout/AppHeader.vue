<!--
  Cabeçalho com o menu definido na decisão D4:
  [Logo] Camisetas · Moletons · Acessórios | Teste Técnico | Entrar/Admin | Sacola (n).
  Em telas pequenas o menu vira um painel aberto por um botão com
  aria-expanded; a sacola continua sempre visível.
-->
<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAutenticacaoStore } from '@/stores/autenticacao'
import { useSacolaStore } from '@/stores/sacola'
import { CATEGORIAS } from '@/utils/categorias'

const autenticacao = useAutenticacaoStore()
const sacola = useSacolaStore()
const rota = useRoute()
const router = useRouter()
const menuAberto = ref(false)
const saindo = ref(false)

const rotuloSacola = computed(() => {
  const total = sacola.quantidadeTotal
  return `Sacola, ${total} ${total === 1 ? 'item' : 'itens'}`
})

/**
 * Fecha o menu móvel sempre que a rota muda.
 */
watch(
  () => rota.fullPath,
  () => {
    menuAberto.value = false
  },
)

/**
 * Indica se o link de categoria corresponde à vitrine filtrada atual.
 */
function categoriaAtiva(slug) {
  return rota.name === 'vitrine' && rota.query.categoria === slug
}

/**
 * Encerra a sessão e volta para a vitrine.
 */
async function sair() {
  saindo.value = true
  try {
    await autenticacao.sair()
    await router.push({ name: 'vitrine' })
  } finally {
    saindo.value = false
  }
}
</script>

<template>
  <header class="cabecalho">
    <div class="container cabecalho__barra">
      <RouterLink :to="{ name: 'vitrine' }" class="cabecalho__logo">
        T-Shirt<span class="cabecalho__logo-destaque">Store</span>
      </RouterLink>

      <button
        type="button"
        class="cabecalho__alternar"
        :aria-expanded="menuAberto ? 'true' : 'false'"
        aria-controls="menu-principal"
        @click="menuAberto = !menuAberto"
      >
        <span aria-hidden="true">{{ menuAberto ? '✕' : '☰' }}</span>
        <span class="somente-leitor-de-tela">{{ menuAberto ? 'Fechar menu' : 'Abrir menu' }}</span>
      </button>

      <nav
        id="menu-principal"
        class="cabecalho__menu"
        :class="{ 'cabecalho__menu--aberto': menuAberto }"
        aria-label="Menu principal"
      >
        <ul class="cabecalho__lista cabecalho__lista--categorias">
          <li v-for="categoria in CATEGORIAS" :key="categoria.slug">
            <RouterLink
              :to="{ name: 'vitrine', query: { categoria: categoria.slug } }"
              class="cabecalho__link"
              active-class=""
              exact-active-class=""
              :aria-current="categoriaAtiva(categoria.slug) ? 'page' : undefined"
            >
              {{ categoria.rotulo }}
            </RouterLink>
          </li>
        </ul>

        <ul class="cabecalho__lista">
          <li>
            <RouterLink :to="{ name: 'teste-tecnico' }" class="cabecalho__link">
              Teste Técnico
            </RouterLink>
          </li>
          <li v-if="!autenticacao.autenticado">
            <RouterLink :to="{ name: 'login' }" class="cabecalho__link">Entrar</RouterLink>
          </li>
          <template v-else>
            <li>
              <RouterLink :to="{ name: 'admin-produtos' }" class="cabecalho__link"
                >Admin</RouterLink
              >
            </li>
            <li>
              <button
                type="button"
                class="cabecalho__link cabecalho__sair"
                :disabled="saindo"
                @click="sair"
              >
                Sair
              </button>
            </li>
          </template>
        </ul>
      </nav>

      <RouterLink :to="{ name: 'checkout' }" class="cabecalho__sacola" :aria-label="rotuloSacola">
        Sacola
        <span class="cabecalho__contador" aria-hidden="true">{{ sacola.quantidadeTotal }}</span>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped lang="less">
.cabecalho {
  border-bottom: 1px solid @cor-preto;
  background: @cor-branco;

  &__barra {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: @espaco-3;
    min-height: 4rem;
    padding-top: @espaco-2;
    padding-bottom: @espaco-2;

    .acima-de(@bp-desktop, {
      gap: @espaco-3 @espaco-6;
    });
  }

  &__logo {
    font-family: @fonte-titulo;
    font-size: @texto-medio;
    font-weight: 600;
    text-decoration: none;
    letter-spacing: 0.02em;

    .acima-de(@bp-tablet, {
      font-size: @texto-grande;
    });
  }

  &__logo-destaque {
    margin-left: @espaco-1;
    padding: 0 @espaco-1;
    background: @cor-preto;
    color: @cor-branco;
  }

  &__alternar {
    order: 3;
    min-width: 2.75rem;
    min-height: 2.75rem;
    font-size: @texto-medio;
    background: none;
    border: 1px solid @cor-preto;
    border-radius: @raio;
    cursor: pointer;

    .acima-de(@bp-desktop, {
      display: none;
    });
  }

  &__menu {
    display: none;
    order: 4;
    flex-basis: 100%;
    padding: @espaco-3 0;
    border-top: 1px solid @cor-cinza-300;

    &--aberto {
      display: block;
    }

    .acima-de(@bp-desktop, {
      display: flex;
      flex: 1;
      flex-basis: auto;
      order: 2;
      justify-content: space-between;
      padding: 0;
      border-top: 0;
    });
  }

  &__lista {
    display: flex;
    flex-direction: column;
    gap: @espaco-1;
    margin: 0;
    padding: 0;
    list-style: none;

    .acima-de(@bp-desktop, {
      flex-direction: row;
      align-items: center;
      gap: @espaco-5;
    });
  }

  &__lista--categorias {
    margin-bottom: @espaco-3;

    .acima-de(@bp-desktop, {
      margin-bottom: 0;
    });
  }

  &__link {
    display: inline-block;
    padding: @espaco-2 0;
    font-family: @fonte-titulo;
    font-size: @texto-medio;
    text-decoration: none;
    background: none;
    border: 0;
    border-bottom: 2px solid transparent;
    color: inherit;
    cursor: pointer;

    &:hover,
    &.router-link-exact-active,
    &[aria-current='page'] {
      border-bottom-color: @cor-preto;
    }
  }

  &__sacola {
    order: 2;
    display: inline-flex;
    align-items: center;
    gap: @espaco-2;
    margin-left: auto;
    font-family: @fonte-titulo;
    font-size: @texto-medio;
    text-decoration: none;

    .acima-de(@bp-desktop, {
      order: 3;
      margin-left: 0;
    });
  }

  &__contador {
    display: inline-grid;
    place-items: center;
    min-width: 1.75rem;
    height: 1.75rem;
    padding: 0 @espaco-1;
    font-size: @texto-pequeno;
    color: @cor-branco;
    background: @cor-preto;
    border-radius: 999px;
  }
}
</style>
<!-- Fim de AppHeader.vue -->
