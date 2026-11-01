<!--
  Tela de login (Ex. 10 · autenticação). Envia e-mail e senha para a API;
  a sessão fica em cookie HttpOnly. Mostra as credenciais de demonstração
  para o avaliador testar a administração de produtos.
-->
<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAutenticacaoStore } from '@/stores/autenticacao'
import { extrairErro } from '@/services/api'

const autenticacao = useAutenticacaoStore()
const rota = useRoute()
const router = useRouter()

const formulario = reactive({ email: '', senha: '' })
const errosCampos = ref({})
const erroGeral = ref('')
const enviando = ref(false)

/**
 * Valida o preenchimento no navegador antes de chamar a API.
 */
function validar() {
  const erros = {}
  if (!formulario.email.trim()) {
    erros.email = 'Informe o e-mail.'
  }
  if (!formulario.senha) {
    erros.password = 'Informe a senha.'
  }
  errosCampos.value = erros
  return Object.keys(erros).length === 0
}

/**
 * Faz o login e redireciona para a página pedida antes (ou para o admin).
 */
async function entrar() {
  erroGeral.value = ''
  if (!validar()) {
    return
  }
  enviando.value = true
  try {
    await autenticacao.entrar(formulario.email.trim(), formulario.senha)
    const destino = typeof rota.query.redirecionar === 'string' ? rota.query.redirecionar : ''
    const destinoInterno = destino.startsWith('/') && !destino.startsWith('//')
    await router.replace(destinoInterno ? destino : { name: 'admin-produtos' })
  } catch (falha) {
    const { mensagem, campos } = extrairErro(falha)
    errosCampos.value = campos
    erroGeral.value = campos.email ?? mensagem
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <section class="container login" aria-labelledby="titulo-login">
    <h1 id="titulo-login">Entrar</h1>
    <p>Acesso à administração de produtos (Ex. 10).</p>

    <div class="alerta alerta--info">
      <p><strong>Acesso de demonstração</strong></p>
      <p>E-mail: <code>avaliador@tshirt.test</code> · Senha: <code>Avaliador@2026</code></p>
    </div>

    <div v-if="erroGeral" class="alerta alerta--erro" role="alert">{{ erroGeral }}</div>

    <form novalidate @submit.prevent="entrar">
      <div class="campo">
        <label class="campo__rotulo" for="login-email">E-mail</label>
        <input
          id="login-email"
          v-model="formulario.email"
          class="campo__entrada"
          type="email"
          autocomplete="username"
          required
          :aria-invalid="errosCampos.email ? 'true' : 'false'"
          :aria-describedby="errosCampos.email ? 'login-email-erro' : undefined"
        />
        <p v-if="errosCampos.email" id="login-email-erro" class="campo__erro">
          {{ errosCampos.email }}
        </p>
      </div>

      <div class="campo">
        <label class="campo__rotulo" for="login-senha">Senha</label>
        <input
          id="login-senha"
          v-model="formulario.senha"
          class="campo__entrada"
          type="password"
          autocomplete="current-password"
          required
          :aria-invalid="errosCampos.password ? 'true' : 'false'"
          :aria-describedby="errosCampos.password ? 'login-senha-erro' : undefined"
        />
        <p v-if="errosCampos.password" id="login-senha-erro" class="campo__erro">
          {{ errosCampos.password }}
        </p>
      </div>

      <button
        type="submit"
        class="botao"
        :disabled="enviando"
        :aria-busy="enviando ? 'true' : 'false'"
      >
        {{ enviando ? 'Entrando…' : 'Entrar' }}
      </button>
    </form>
  </section>
</template>

<style scoped lang="less">
.login {
  max-width: 28rem;

  code {
    font-size: @texto-pequeno;
  }

  .alerta p {
    margin: 0;
  }
}
</style>
<!-- Fim de LoginView.vue -->
