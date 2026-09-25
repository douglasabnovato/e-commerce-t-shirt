/**
 * @vitest-environment node
 *
 * Testes das máscaras e da montagem do objeto final do pedido (Ex. 12).
 */

import { describe, expect, it } from 'vitest'
import {
  mascararCartao,
  mascararCep,
  mascararEstado,
  mascararTelefone,
  mascararVencimento,
  ocultarCartao,
} from '../utils/checkout/mascaras'
import { montarPedido } from '../utils/checkout/pedido'

describe('máscaras do checkout', () => {
  it('formata CEP, telefone, cartão, vencimento e estado', () => {
    expect(mascararCep('36010000')).toBe('36010-000')
    expect(mascararTelefone('32999991234')).toBe('(32) 99999-1234')
    expect(mascararTelefone('3232151234')).toBe('(32) 3215-1234')
    expect(mascararCartao('4111111111111111')).toBe('4111 1111 1111 1111')
    expect(mascararVencimento('1228')).toBe('12/28')
    expect(mascararEstado('mg1')).toBe('MG')
  })

  it('ignora caracteres extras e limita o tamanho', () => {
    expect(mascararCep('36.010-000999')).toBe('36010-000')
    expect(mascararVencimento('12/2899')).toBe('12/28')
  })

  it('oculta o número do cartão', () => {
    expect(ocultarCartao('4111 1111 1111 1234')).toBe('**** **** **** 1234')
  })
})

describe('objeto final do pedido', () => {
  it('monta contato, entrega, pagamento sem dados sensíveis, itens e totais', () => {
    const pedido = montarPedido(
      {
        email: ' cliente@exemplo.com ',
        telefone: '(32) 99999-1234',
        cep: '36010-000',
        rua: 'Rua Halfeld',
        numero: '100',
        bairro: 'Centro',
        cidade: 'Juiz de Fora',
        estado: 'mg',
        numeroCartao: '4111 1111 1111 1111',
        titular: 'Maria Silva',
        vencimento: '12/28',
        cvc: '123',
      },
      [{ id: 1, nome: 'Camiseta', preco: 74.99, quantidade: 2 }],
      new Date('2026-09-25T12:00:00Z'),
    )

    expect(pedido.contato).toEqual({ email: 'cliente@exemplo.com', telefone: '32999991234' })
    expect(pedido.entrega.estado).toBe('MG')
    expect(pedido.pagamento.cartao).toBe('**** **** **** 1111')
    expect(JSON.stringify(pedido)).not.toContain('123"')
    expect(pedido.itens[0].total).toBe(149.98)
    expect(pedido.totais).toEqual({
      quantidadeDeItens: 2,
      subtotal: 149.98,
      frete: 0,
      total: 149.98,
    })
  })
})

/* Fim de checkout-mascaras.spec.js */
