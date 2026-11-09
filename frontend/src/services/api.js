/*
 * Cliente HTTP da API, com fetch (#33).
 * Substitui o axios, que era o maior pacote do JavaScript da primeira
 * visita, mantendo o mesmo formato para quem chama: api.get(url, { params }),
 * api.post(url, dados), api.delete(url), resposta em { data, status } e
 * erro com erro.response = { status, data }.
 * Autenticação Sanctum em modo SPA: a sessão viaja em cookie HttpOnly e o
 * cliente envia o cabeçalho X-XSRF-TOKEN lido do cookie XSRF-TOKEN, como o
 * axios fazia. Nenhum token é guardado em localStorage (D10).
 */

const BASE = '/api'
const TEMPO_LIMITE_MS = 15000
const METODOS_DE_ESCRITA = ['post', 'put', 'patch', 'delete']
const CABECALHOS_PADRAO = {
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
}

/**
 * Erro de uma requisição. Sem resposta (rede ou tempo esgotado),
 * `response` fica indefinido; com resposta, traz `status` e `data`.
 */
export class ErroHttp extends Error {
  constructor(mensagem, { config, response, code, cause } = {}) {
    super(mensagem, { cause })
    this.name = 'ErroHttp'
    this.config = config
    this.response = response
    this.code = code
  }
}

/**
 * Lê um cookie pelo nome, já decodificado, ou null se não existir.
 */
function lerCookie(nome) {
  const prefixo = `${nome}=`
  const cookie = document.cookie.split('; ').find((item) => item.startsWith(prefixo))
  return cookie ? decodeURIComponent(cookie.slice(prefixo.length)) : null
}

/**
 * Indica se o cookie XSRF-TOKEN já está presente no navegador.
 */
function possuiCookieCsrf() {
  return lerCookie('XSRF-TOKEN') !== null
}

/**
 * Monta a URL com os parâmetros de busca, ignorando os vazios
 * (undefined ou null), como o axios.
 */
export function montarUrl(url, params) {
  const busca = new URLSearchParams()
  for (const [chave, valor] of Object.entries(params ?? {})) {
    if (valor !== undefined && valor !== null) {
      busca.append(chave, String(valor))
    }
  }
  const consulta = busca.toString()
  return `${BASE}${url}${consulta ? `?${consulta}` : ''}`
}

/**
 * Lê o corpo da resposta: JSON quando possível, texto caso contrário e
 * null quando vazio (204, por exemplo).
 */
async function lerCorpo(resposta) {
  const texto = await resposta.text()
  if (!texto) {
    return null
  }
  try {
    return JSON.parse(texto)
  } catch {
    return texto
  }
}

/**
 * fetch com tempo limite. Rede fora ou tempo esgotado viram ErroHttp sem
 * `response`, que extrairErro() traduz como falha de conexão.
 */
async function buscar(url, opcoes, config) {
  const controle = new AbortController()
  const temporizador = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS)
  try {
    return await fetch(url, { ...opcoes, credentials: 'include', signal: controle.signal })
  } catch (causa) {
    const esgotado = controle.signal.aborted
    throw new ErroHttp(esgotado ? 'Tempo esgotado' : 'Falha de rede', {
      config,
      code: esgotado ? 'ECONNABORTED' : 'ERR_NETWORK',
      cause: causa,
    })
  } finally {
    clearTimeout(temporizador)
  }
}

/**
 * Busca o cookie XSRF-TOKEN do Sanctum. Deve ser chamado antes do login e
 * sempre que o cookie ainda não existir.
 */
export async function garantirCsrf() {
  const config = { method: 'get', url: '/sanctum/csrf-cookie' }
  const resposta = await buscar('/sanctum/csrf-cookie', { headers: CABECALHOS_PADRAO }, config)
  if (!resposta.ok) {
    throw new ErroHttp(`Falha ao obter o cookie CSRF (HTTP ${resposta.status})`, {
      config,
      response: { status: resposta.status, data: await lerCorpo(resposta) },
    })
  }
}

/**
 * Faz uma requisição à API.
 * - Antes de qualquer escrita, garante que o cookie de CSRF existe.
 * - Envia X-XSRF-TOKEN quando o cookie existe.
 * - FormData vai como multipart; objeto comum vai como JSON.
 * - Status fora de 2xx rejeita com ErroHttp (erro.response.status e data).
 * - Se o token CSRF expirou (419), renova o cookie e repete uma única vez.
 */
async function requisitar(config) {
  const metodo = (config.method ?? 'get').toLowerCase()
  if (METODOS_DE_ESCRITA.includes(metodo) && !possuiCookieCsrf()) {
    await garantirCsrf()
  }

  const cabecalhos = { ...CABECALHOS_PADRAO, ...config.headers }
  const tokenCsrf = lerCookie('XSRF-TOKEN')
  if (tokenCsrf) {
    cabecalhos['X-XSRF-TOKEN'] = tokenCsrf
  }

  let corpo
  if (config.data instanceof FormData) {
    corpo = config.data
  } else if (config.data !== undefined) {
    corpo = JSON.stringify(config.data)
    cabecalhos['Content-Type'] = 'application/json'
  }

  const resposta = await buscar(
    montarUrl(config.url, config.params),
    { method: metodo.toUpperCase(), headers: cabecalhos, body: corpo },
    config,
  )
  const data = await lerCorpo(resposta)

  if (resposta.ok) {
    return { data, status: resposta.status }
  }
  if (resposta.status === 419 && !config._repetida) {
    await garantirCsrf()
    return requisitar({ ...config, _repetida: true })
  }
  throw new ErroHttp(`Request failed with status code ${resposta.status}`, {
    config,
    response: { status: resposta.status, data },
  })
}

const api = {
  request: requisitar,
  get: (url, config = {}) => requisitar({ ...config, method: 'get', url }),
  delete: (url, config = {}) => requisitar({ ...config, method: 'delete', url }),
  post: (url, data, config = {}) => requisitar({ ...config, method: 'post', url, data }),
  put: (url, data, config = {}) => requisitar({ ...config, method: 'put', url, data }),
  patch: (url, data, config = {}) => requisitar({ ...config, method: 'patch', url, data }),
}

/**
 * Converte um erro da API em um objeto simples para a interface:
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
