/**
 * @vitest-environment node
 *
 * Testes da store da sacola (Ex. 12): itens hardcoded, limites de
 * quantidade e totais.
 */

import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { QUANTIDADE_MAXIMA, useSacolaStore } from '../stores/sacola'

describe('store da sacola', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('começa com os itens fixos e calcula quantidade e subtotal', () => {
    const sacola = useSacolaStore()
    expect(sacola.itens).toHaveLength(2)
    expect(sacola.quantidadeTotal).toBe(3)
    expect(sacola.subtotal).toBeCloseTo(74.99 + 229.99 * 2, 2)
  })

  it('aumenta e diminui a quantidade sem passar de 1', () => {
    const sacola = useSacolaStore()
    sacola.aumentar(1)
    expect(sacola.itens[0].quantidade).toBe(2)
    sacola.diminuir(1)
    sacola.diminuir(1)
    expect(sacola.itens[0].quantidade).toBe(1)
  })

  it('limita a quantidade ao máximo e ignora valores inválidos', () => {
    const sacola = useSacolaStore()
    sacola.definirQuantidade(2, 999)
    expect(sacola.itens[1].quantidade).toBe(QUANTIDADE_MAXIMA)
    sacola.definirQuantidade(2, 'abc')
    expect(sacola.itens[1].quantidade).toBe(QUANTIDADE_MAXIMA)
  })
})

/* Fim de sacola.spec.js */
