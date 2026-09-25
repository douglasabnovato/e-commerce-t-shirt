/*
 * Cliente HTTP da API (axios).
 * Autenticação Sanctum em modo SPA: a sessão viaja em cookie HttpOnly e o
 * axios envia automaticamente o cabeçalho X-XSRF-TOKEN lido do cookie
 * XSRF-TOKEN. Nenhum token é guardado em localStorage (D10).
 */

import axios from 'axios'

const METODOS_DE_ESCRITA = ['post', 'put', 'patch', 'delete']

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

/**
 * Busca o cookie XSRF-TOKEN do Sanctum. Deve ser chamado antes do login e
 * sempre que o cookie ainda não existir.
 */
export async function garantirCsrf() {
  await axios.get('/sanctum/csrf-cookie', { withCredentials: true })
}

/**
 * Indica se o cookie XSRF-TOKEN já está presente no navegador.
 */
function possuiCookieCsrf() {
  return document.cookie.split('; ').some((cookie) => cookie.startsWith('XSRF-TOKEN='))
}

/**
 * Antes de qualquer requisição de escrita, garante que o cookie de CSRF
 * existe.
 */
api.interceptors.request.use(async (config) => {
  if (METODOS_DE_ESCRITA.includes(config.method) && !possuiCookieCsrf()) {
    await garantirCsrf()
  }
  return config
})

/**
 * Se o token CSRF expirou (419), renova o cookie e repete a requisição uma
 * única vez.
 */
api.interceptors.response.use(
  (resposta) => resposta,
  async (erro) => {
    const config = erro.config
    if (erro.response?.status === 419 && config && !config._repetida) {
      config._repetida = true
      await garantirCsrf()
      return api(config)
    }
    return Promise.reject(erro)
  },
)

/**
 * Converte um erro do axios em um objeto simples para a interface:
 * status HTTP, mensagem geral e erros por campo (respostas 422).
 */
export function extrairErro(erro) {
  if (!erro?.response) {
    return {
      status: 0,
      mensagem: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      campos: {},
    }
  }

  const { status, data } = erro.response
  const campos = Object.fromEntries(
    Object.entries(data?.errors ?? {}).map(([campo, mensagens]) => [campo, mensagens[0]]),
  )

  const mensagensPorStatus = {
    401: 'Sua sessão expirou. Entre novamente.',
    403: 'Você não tem permissão para esta ação.',
    404: 'Registro não encontrado.',
    422: 'Verifique os campos destacados.',
    429: data?.message ?? 'Muitas tentativas. Aguarde um minuto.',
  }

  return {
    status,
    mensagem: mensagensPorStatus[status] ?? data?.message ?? 'Ocorreu um erro inesperado.',
    campos,
  }
}

export default api

/* Fim de services/api.js */
