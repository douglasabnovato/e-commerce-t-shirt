/*
 * Medição de uso (D5): o GoatCounter só entra no build de produção, fora do
 * Playwright, e página e evento só saem com o contador carregado.
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  ENDERECO_CONTAGEM,
  contarEvento,
  contarPagina,
  deveMedir,
  iniciarMedicao,
} from '@/utils/medicao'

const seletor = 'script[data-goatcounter]'

afterEach(() => {
  document.querySelectorAll(seletor).forEach((s) => s.remove())
})

describe('medição de uso', () => {
  it('não carrega em desenvolvimento nem nos testes', () => {
    expect(iniciarMedicao(document, { producao: import.meta.env.PROD, automatizado: false })).toBe(
      false,
    )
    expect(document.querySelector(seletor)).toBeNull()
  })

  it('não carrega em navegador automatizado, mesmo no build', () => {
    expect(deveMedir({ producao: true, automatizado: true })).toBe(false)
    iniciarMedicao(document, { producao: true, automatizado: true })
    expect(document.querySelector(seletor)).toBeNull()
  })

  it('carrega uma vez no build de produção, com o endereço do portfólio', () => {
    iniciarMedicao(document, { producao: true, automatizado: false })
    iniciarMedicao(document, { producao: true, automatizado: false })
    const scripts = document.querySelectorAll(seletor)
    expect(scripts).toHaveLength(1)
    expect(scripts[0].dataset.goatcounter).toBe(ENDERECO_CONTAGEM)
  })

  it('conta página e evento só com o contador carregado', () => {
    expect(contarPagina('/checkout', {})).toBe(false)
    expect(contarEvento('pedido-fechado', {})).toBe(false)
    const count = vi.fn()
    const janela = { goatcounter: { count } }
    expect(contarPagina('/checkout', janela)).toBe(true)
    expect(contarEvento('pedido-fechado', janela)).toBe(true)
    expect(count).toHaveBeenNthCalledWith(1, { path: '/checkout' })
    expect(count).toHaveBeenNthCalledWith(2, { path: 'pedido-fechado', event: true })
  })
})

/* Fim de medicao.spec.js */
