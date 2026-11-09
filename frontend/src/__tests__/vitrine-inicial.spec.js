/**
 * @vitest-environment jsdom
 *
 * Testes da cadeia curta até a primeira página da vitrine (#29): a busca
 * iniciada pelo index.html antes do Vue, o reaproveitamento dela em
 * listarProdutos() e a navegação pública que não espera /api/user.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'
import { dirname, join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const get = vi.fn()

vi.mock('@/services/api', () => ({
  default: { get: (...args) => get(...args) },
  extrairErro: () => ({ mensagem: 'erro' }),
  garantirCsrf: vi.fn(),
}))

const { listarProdutos } = await import('@/services/produtos')

const corpo = {
  data: [{ id: 1, nome: 'Camiseta', preco: 79.9 }],
  meta: { current_page: 1, last_page: 1, per_page: 12, total: 1 },
}

/** Executa o script inline do index.html com location e fetch simulados. */
function rodarScriptDoIndex({ pathname, search, fetch }) {
  const html = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../../index.html'),
    'utf8',
  )
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1]
  const janela = { fetch }
  runInNewContext(script, { window: janela, location: { pathname, search }, fetch })
  return janela
}

describe('busca inicial no index.html', () => {
  it('pede a mesma URL da página 1 quando a vitrine abre sem filtro', async () => {
    const fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(corpo) }))
    const janela = rodarScriptDoIndex({ pathname: '/', search: '', fetch })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toBe('/api/produtos?page=1&por_pagina=12')
    await expect(janela.__vitrineInicial).resolves.toEqual(corpo)
  })

  it('não pede nada em outras páginas nem com filtro na URL', () => {
    const fetch = vi.fn()
    rodarScriptDoIndex({ pathname: '/checkout', search: '', fetch })
    rodarScriptDoIndex({ pathname: '/', search: '?categoria=camisetas', fetch })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('pré-carrega a imagem do primeiro produto quando a lista chega (#33)', async () => {
    const comImagem = {
      ...corpo,
      data: [{ id: 1, imagem_url: 'http://loja.test/storage/produtos/a.webp' }, { id: 2, imagem_url: 'b.webp' }],
    }
    const adicionados = []
    const document = {
      createElement: () => ({ setAttribute(nome, valor) { this[nome] = valor } }),
      head: { appendChild: (el) => adicionados.push(el) },
    }
    const fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(comImagem) }))
    const html = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../../index.html'), 'utf8')
    const script = html.match(/<script>([\s\S]*?)<\/script>/)[1]
    const janela = { fetch }
    runInNewContext(script, { window: janela, location: { pathname: '/', search: '' }, fetch, document })

    await expect(janela.__vitrineInicial).resolves.toEqual(comImagem)
    expect(adicionados).toHaveLength(1)
    expect(adicionados[0]).toMatchObject({
      rel: 'preload',
      as: 'image',
      href: 'http://loja.test/storage/produtos/a.webp',
      fetchpriority: 'high',
    })
  })

  it('sem imagem no primeiro produto, não pré-carrega nada e devolve a lista', async () => {
    const janela = rodarScriptDoIndex({
      pathname: '/',
      search: '',
      fetch: vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(corpo) })),
    })
    // Sem document no contexto: se o script tentasse criar o <link>, a promessa rejeitaria
    await expect(janela.__vitrineInicial).resolves.toEqual(corpo)
  })

  it('rejeita quando a API responde com erro', async () => {
    const fetch = vi.fn(() => Promise.resolve({ ok: false, status: 500 }))
    const janela = rodarScriptDoIndex({ pathname: '/', search: '', fetch })
    await expect(janela.__vitrineInicial).rejects.toThrow('HTTP 500')
  })
})

describe('listarProdutos com a busca inicial', () => {
  beforeEach(() => {
    get.mockReset()
    get.mockResolvedValue({ data: { data: [], meta: { total: 0 } } })
  })

  afterEach(() => {
    globalThis.__vitrineInicial = undefined
  })

  it('reaproveita a busca inicial na primeira página, uma vez só', async () => {
    globalThis.__vitrineInicial = Promise.resolve(corpo)

    const primeira = await listarProdutos({ pagina: 1, ordem: 'recentes' })
    expect(primeira).toEqual({ produtos: corpo.data, paginacao: corpo.meta })
    expect(get).not.toHaveBeenCalled()

    await listarProdutos({ pagina: 1 })
    expect(get).toHaveBeenCalledTimes(1)
  })

  it.each([{ pagina: 2 }, { pagina: 1, busca: 'Camiseta' }, { pagina: 1, ordem: 'menor-preco' }])(
    'ignora e descarta a busca inicial quando a primeira chamada é %o',
    async (parametros) => {
      globalThis.__vitrineInicial = Promise.resolve(corpo)

      await listarProdutos(parametros)
      expect(get).toHaveBeenCalledTimes(1)
      expect(globalThis.__vitrineInicial).toBeUndefined()

      // Voltar depois à primeira página sem filtro pede a lista de novo
      await listarProdutos({ pagina: 1 })
      expect(get).toHaveBeenCalledTimes(2)
    },
  )

  it('pede de novo pelo cliente da API quando a busca inicial falhou', async () => {
    globalThis.__vitrineInicial = Promise.reject(new Error('HTTP 500'))
    get.mockResolvedValue({ data: corpo })

    const resultado = await listarProdutos({ pagina: 1 })

    expect(get).toHaveBeenCalledTimes(1)
    expect(resultado.produtos).toEqual(corpo.data)
  })

  it('deixa o erro do cliente da API chegar à tela se o segundo pedido também falhar', async () => {
    globalThis.__vitrineInicial = Promise.reject(new Error('HTTP 500'))
    get.mockRejectedValue(new Error('rede'))

    await expect(listarProdutos({ pagina: 1 })).rejects.toThrow('rede')
  })
})

describe('navegação e sessão', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    get.mockReset()
  })

  it('abre a vitrine sem esperar /api/user e pede a sessão uma vez só', async () => {
    let responderSessao
    get.mockImplementation((url) =>
      url === '/user'
        ? new Promise((resolve, reject) => {
            responderSessao = () => reject(new Error('401'))
          })
        : Promise.resolve({ data: { data: [], meta: { total: 0 } } }),
    )
    const { default: router } = await import('@/router')
    const { useAutenticacaoStore } = await import('@/stores/autenticacao')

    await router.push('/')
    expect(router.currentRoute.value.name).toBe('vitrine')

    const destino = router.push('/admin/produtos')
    await Promise.resolve()
    expect(get.mock.calls.filter(([url]) => url === '/user')).toHaveLength(1)

    responderSessao()
    await destino
    // Se a verificação não fosse reaproveitada, o guarda teria feito um 2º pedido
    expect(get.mock.calls.filter(([url]) => url === '/user')).toHaveLength(1)
    expect(router.currentRoute.value.name).toBe('login')
    expect(useAutenticacaoStore().sessaoVerificada).toBe(true)
  })
})

/* Fim de vitrine-inicial.spec.js */
