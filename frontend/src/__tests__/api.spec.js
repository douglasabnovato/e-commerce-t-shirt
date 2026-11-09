/**
 * @vitest-environment jsdom
 *
 * Testes do cliente HTTP com fetch (#33), que substituiu o axios: URL e
 * parâmetros, cabeçalhos, cookie CSRF antes de escrita, X-XSRF-TOKEN,
 * repetição única no 419, rejeição com erro.response no 401 e em outros
 * erros, falha de rede e tempo esgotado, e a tradução por extrairErro().
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import api, { extrairErro, garantirCsrf, montarUrl } from '@/services/api'

/** Resposta mínima no formato do fetch. */
function resposta(status, corpo) {
  const texto = corpo === undefined ? '' : JSON.stringify(corpo)
  return Promise.resolve({ ok: status >= 200 && status < 300, status, text: () => Promise.resolve(texto) })
}

function apagarCookies() {
  for (const cookie of document.cookie.split('; ')) {
    const nome = cookie.split('=')[0]
    if (nome) document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  }
}

let fetch

beforeEach(() => {
  apagarCookies()
  fetch = vi.fn()
  vi.stubGlobal('fetch', fetch)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('montarUrl', () => {
  it('prefixa /api e ignora parâmetros vazios', () => {
    expect(montarUrl('/produtos', { page: 2, por_pagina: 12, busca: undefined, ordem: null })).toBe(
      '/api/produtos?page=2&por_pagina=12',
    )
    expect(montarUrl('/user')).toBe('/api/user')
  })
})

describe('leitura', () => {
  it('GET envia os cabeçalhos da API e devolve { data, status }', async () => {
    fetch.mockReturnValue(resposta(200, { data: [1] }))

    const resultado = await api.get('/produtos', { params: { page: 1, busca: 'Camiseta azul' } })

    expect(resultado).toEqual({ data: { data: [1] }, status: 200 })
    const [url, opcoes] = fetch.mock.calls[0]
    expect(url).toBe('/api/produtos?page=1&busca=Camiseta+azul')
    expect(opcoes.method).toBe('GET')
    expect(opcoes.credentials).toBe('include')
    expect(opcoes.headers).toMatchObject({ Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' })
    expect(opcoes.body).toBeUndefined()
  })

  it('401 rejeita com erro.response, e a tela recebe a mensagem de sessão expirada', async () => {
    fetch.mockReturnValue(resposta(401, { message: 'Unauthenticated.' }))

    const erro = await api.get('/user').catch((e) => e)

    expect(erro.response).toEqual({ status: 401, data: { message: 'Unauthenticated.' } })
    expect(extrairErro(erro)).toMatchObject({ status: 401, mensagem: 'Sua sessão expirou. Entre novamente.' })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('422 traz os erros por campo', async () => {
    fetch.mockReturnValue(resposta(422, { message: 'x', errors: { nome: ['Nome obrigatório.', 'outro'] } }))

    const erro = await api.get('/produtos').catch((e) => e)

    expect(extrairErro(erro)).toEqual({
      status: 422,
      mensagem: 'Verifique os campos destacados.',
      campos: { nome: 'Nome obrigatório.' },
    })
  })

  it('500 usa a mensagem do servidor e corpo que não é JSON não quebra', async () => {
    fetch.mockReturnValue(
      Promise.resolve({ ok: false, status: 500, text: () => Promise.resolve('<html>erro</html>') }),
    )

    const erro = await api.get('/produtos').catch((e) => e)

    expect(erro.response.data).toBe('<html>erro</html>')
    expect(extrairErro(erro).mensagem).toBe('Ocorreu um erro inesperado.')
  })

  it('rede fora vira erro sem response e mensagem de conexão', async () => {
    fetch.mockRejectedValue(new TypeError('Failed to fetch'))

    const erro = await api.get('/produtos').catch((e) => e)

    expect(erro.response).toBeUndefined()
    expect(erro.code).toBe('ERR_NETWORK')
    expect(extrairErro(erro).mensagem).toMatch(/Não foi possível conectar/)
  })

  it('aborta depois de 15 s e trata como falha de conexão', async () => {
    vi.useFakeTimers()
    fetch.mockImplementation(
      (_url, { signal }) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener('abort', () => reject(new DOMException('abortado', 'AbortError')))
        }),
    )

    const pedido = api.get('/produtos').catch((e) => e)
    await vi.advanceTimersByTimeAsync(15000)
    const erro = await pedido

    expect(erro.code).toBe('ECONNABORTED')
    expect(extrairErro(erro).status).toBe(0)
  })
})

describe('escrita e CSRF', () => {
  it('sem cookie, busca /sanctum/csrf-cookie antes do POST e envia JSON', async () => {
    fetch.mockImplementation((url) => {
      if (url === '/sanctum/csrf-cookie') {
        document.cookie = 'XSRF-TOKEN=abc%3D%3D; path=/'
        return resposta(204)
      }
      return resposta(200, { usuario: { id: 1 } })
    })

    const { data } = await api.post('/login', { email: 'a@exemplo.test', password: 'x' })

    expect(data).toEqual({ usuario: { id: 1 } })
    expect(fetch.mock.calls.map(([url]) => url)).toEqual(['/sanctum/csrf-cookie', '/api/login'])
    const opcoes = fetch.mock.calls[1][1]
    expect(opcoes.method).toBe('POST')
    expect(opcoes.headers['X-XSRF-TOKEN']).toBe('abc==')
    expect(opcoes.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(opcoes.body)).toEqual({ email: 'a@exemplo.test', password: 'x' })
  })

  it('com cookie, não busca de novo; FormData vai sem Content-Type (multipart)', async () => {
    document.cookie = 'XSRF-TOKEN=tok; path=/'
    fetch.mockReturnValue(resposta(201, { data: { id: 9 } }))
    const dados = new FormData()
    dados.append('nome', 'Camiseta')

    await api.post('/produtos', dados)

    expect(fetch).toHaveBeenCalledTimes(1)
    const opcoes = fetch.mock.calls[0][1]
    expect(opcoes.body).toBe(dados)
    expect(opcoes.headers['Content-Type']).toBeUndefined()
    expect(opcoes.headers['X-XSRF-TOKEN']).toBe('tok')
  })

  it('DELETE com 204 devolve data null', async () => {
    document.cookie = 'XSRF-TOKEN=tok; path=/'
    fetch.mockReturnValue(resposta(204))

    await expect(api.delete('/produtos/3')).resolves.toEqual({ data: null, status: 204 })
    expect(fetch.mock.calls[0][1].method).toBe('DELETE')
  })

  it('419 renova o cookie e repete uma única vez', async () => {
    document.cookie = 'XSRF-TOKEN=velho; path=/'
    let tentativas = 0
    fetch.mockImplementation((url) => {
      if (url === '/sanctum/csrf-cookie') return resposta(204)
      tentativas += 1
      return tentativas === 1 ? resposta(419, { message: 'CSRF token mismatch.' }) : resposta(200, { ok: true })
    })

    await expect(api.post('/logout')).resolves.toEqual({ data: { ok: true }, status: 200 })
    expect(fetch.mock.calls.map(([url]) => url)).toEqual(['/api/logout', '/sanctum/csrf-cookie', '/api/logout'])
  })

  it('419 de novo depois da repetição rejeita, sem laço', async () => {
    document.cookie = 'XSRF-TOKEN=velho; path=/'
    fetch.mockImplementation((url) =>
      url === '/sanctum/csrf-cookie' ? resposta(204) : resposta(419, { message: 'CSRF token mismatch.' }),
    )

    const erro = await api.post('/logout').catch((e) => e)

    expect(erro.response.status).toBe(419)
    expect(fetch).toHaveBeenCalledTimes(3)
  })

  it('garantirCsrf rejeita quando o Sanctum responde com erro', async () => {
    fetch.mockReturnValue(resposta(500))
    await expect(garantirCsrf()).rejects.toMatchObject({ response: { status: 500 } })
  })
})

/* Fim de api.spec.js */
