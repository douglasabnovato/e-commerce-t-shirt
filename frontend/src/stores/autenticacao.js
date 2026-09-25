/*
 * Store de autenticação (Pinia).
 * Guarda apenas os dados públicos do usuário logado. A credencial em si é o
 * cookie de sessão HttpOnly, que o JavaScript não consegue ler (D10).
 */

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import api, { garantirCsrf } from '@/services/api'

export const useAutenticacaoStore = defineStore('autenticacao', () => {
  const usuario = ref(null)
  const sessaoVerificada = ref(false)
  const autenticado = computed(() => usuario.value !== null)

  /**
   * Consulta GET /api/user uma vez por carregamento da página para saber
   * se já existe sessão ativa.
   */
  async function verificarSessao() {
    if (sessaoVerificada.value) {
      return
    }
    try {
      const { data } = await api.get('/user')
      usuario.value = data.usuario
    } catch {
      usuario.value = null
    } finally {
      sessaoVerificada.value = true
    }
  }

  /**
   * Obtém o cookie CSRF e envia as credenciais. Em caso de erro, a exceção
   * sobe para a tela de login tratar.
   */
  async function entrar(email, senha) {
    await garantirCsrf()
    const { data } = await api.post('/login', { email, password: senha })
    usuario.value = data.usuario
    sessaoVerificada.value = true
  }

  /**
   * Encerra a sessão no servidor e limpa o estado local mesmo que a
   * requisição falhe.
   */
  async function sair() {
    try {
      await api.post('/logout')
    } finally {
      usuario.value = null
    }
  }

  return { usuario, sessaoVerificada, autenticado, verificarSessao, entrar, sair }
})

/* Fim de stores/autenticacao.js */
