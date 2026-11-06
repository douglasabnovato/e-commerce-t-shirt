/**
 * @vitest-environment node
 *
 * Testes da ordenação da vitrine (ciclo de 03/11/2026): valores aceitos,
 * URL ao trocar a ordem e parâmetro enviado à API.
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import api from '../services/api'
import { listarProdutos } from '../services/produtos'
import { ORDENACOES, normalizarOrdenacao, queryComOrdenacao } from '../utils/ordenacao'

afterEach(() => vi.restoreAllMocks())

describe('ordenação da vitrine', () => {
  it('oferece recentes, menor preço, maior preço e nome', () => {
    expect(ORDENACOES.map((opcao) => opcao.valor)).toEqual(['recentes', 'menor-preco', 'maior-preco', 'nome'])
  })

  it('valor desconhecido ou vazio volta para recentes', () => {
    expect(normalizarOrdenacao('maior-preco')).toBe('maior-preco')
    expect(normalizarOrdenacao('preco;drop')).toBe('recentes')
    expect(normalizarOrdenacao(undefined)).toBe('recentes')
  })

  it('trocar a ordem mantém a categoria e volta para a página 1', () => {
    expect(queryComOrdenacao({ categoria: 'moletons', pagina: '3' }, 'menor-preco')).toEqual({
      categoria: 'moletons',
      ordem: 'menor-preco',
    })
  })

  it('a ordem padrão sai da URL', () => {
    expect(queryComOrdenacao({ categoria: 'camisetas', ordem: 'nome', pagina: '2' }, 'recentes')).toEqual({
      categoria: 'camisetas',
    })
  })
})

describe('listarProdutos com ordem', () => {
  const resposta = { data: { data: [], meta: { total: 0 } } }

  it('envia ?ordem= só quando não é a padrão', async () => {
    const get = vi.spyOn(api, 'get').mockResolvedValue(resposta)
    await listarProdutos({ pagina: 2, ordem: 'menor-preco' })
    expect(get).toHaveBeenLastCalledWith('/produtos', {
      params: { page: 2, por_pagina: 12, busca: undefined, ordem: 'menor-preco' },
    })
    await listarProdutos({ ordem: 'recentes' })
    expect(get.mock.lastCall[1].params.ordem).toBeUndefined()
  })
})

/* Fim de ordenacao.spec.js */
