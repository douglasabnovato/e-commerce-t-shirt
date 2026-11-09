/**
 * Testes do card da vitrine: prioridade de carregamento da imagem (#24).
 * O primeiro card costuma ser o LCP no celular; ele e os demais da primeira
 * linha não podem usar lazy loading.
 */

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ProdutoCard from '../components/produtos/ProdutoCard.vue'

const produto = {
  id: 1,
  nome: 'Camiseta Teste',
  descricao: 'Descrição de teste',
  preco: 79.9,
  imagem_url: '/storage/produtos/camiseta.webp',
}

function imagemDoCard(posicao) {
  const props = posicao === undefined ? { produto } : { produto, posicao }
  return mount(ProdutoCard, { props }).get('img')
}

describe('card de produto', () => {
  it('o primeiro card carrega já e com prioridade alta', () => {
    const imagem = imagemDoCard(0)
    expect(imagem.attributes('loading')).toBe('eager')
    expect(imagem.attributes('fetchpriority')).toBe('high')
  })

  it('os demais cards da primeira linha carregam já, sem prioridade alta', () => {
    for (const posicao of [1, 2, 3]) {
      const imagem = imagemDoCard(posicao)
      expect(imagem.attributes('loading')).toBe('eager')
      expect(imagem.attributes('fetchpriority')).toBe('auto')
    }
  })

  it('a partir da segunda linha, e sem posição, usa lazy loading', () => {
    expect(imagemDoCard(4).attributes('loading')).toBe('lazy')
    expect(imagemDoCard().attributes('loading')).toBe('lazy')
  })

  it('mantém texto alternativo e dimensões', () => {
    const imagem = imagemDoCard(0)
    expect(imagem.attributes('alt')).toBe('Camiseta Teste')
    expect(imagem.attributes('width')).toBe('232')
    expect(imagem.attributes('height')).toBe('325')
  })
})

/* Fim de produto-card.spec.js */
