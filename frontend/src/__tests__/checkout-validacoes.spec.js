/**
 * @vitest-environment node
 *
 * Testes das validações do checkout (Ex. 12): campos vazios e formatos
 * de e-mail, telefone, CEP, cartão (Luhn), titular, vencimento e CVC.
 */

import { describe, expect, it } from 'vitest'
import {
  CAMPOS,
  passaNoLuhn,
  validarCep,
  validarCvc,
  validarEmail,
  validarEstado,
  validarFormulario,
  validarNumero,
  validarNumeroCartao,
  validarTelefone,
  validarTitular,
  validarVencimento,
} from '../utils/checkout/validacoes'

const HOJE = new Date(2026, 8, 25)

const VALIDOS = {
  email: 'cliente@exemplo.com.br',
  telefone: '(32) 99999-1234',
  cep: '36010-000',
  rua: 'Rua Halfeld',
  numero: '100',
  bairro: 'Centro',
  cidade: 'Juiz de Fora',
  estado: 'MG',
  numeroCartao: '4111 1111 1111 1111',
  titular: 'Maria Silva',
  vencimento: '12/28',
  cvc: '123',
}

describe('validações do checkout', () => {
  it('aceita um formulário completo e válido', () => {
    expect(validarFormulario(VALIDOS, HOJE)).toEqual({})
  })

  it('marca todos os campos vazios como obrigatórios', () => {
    const vazios = Object.fromEntries(CAMPOS.map((campo) => [campo, '']))
    expect(Object.keys(validarFormulario(vazios, HOJE))).toEqual(CAMPOS)
  })

  it('valida e-mail', () => {
    expect(validarEmail('nome@dominio.com')).toBe('')
    expect(validarEmail('nome@dominio')).not.toBe('')
    expect(validarEmail('nome dominio.com')).not.toBe('')
  })

  it('valida telefone fixo e celular com DDD', () => {
    expect(validarTelefone('(32) 3215-1234')).toBe('')
    expect(validarTelefone('(32) 99999-1234')).toBe('')
    expect(validarTelefone('(32) 89999-1234')).not.toBe('')
    expect(validarTelefone('(02) 3215-1234')).not.toBe('')
    expect(validarTelefone('3215-1234')).not.toBe('')
  })

  it('valida CEP, número e estado', () => {
    expect(validarCep('36010-000')).toBe('')
    expect(validarCep('3601-000')).not.toBe('')
    expect(validarNumero('12A')).toBe('')
    expect(validarNumero('S/N')).toBe('')
    expect(validarNumero('doze')).not.toBe('')
    expect(validarEstado('mg')).toBe('')
    expect(validarEstado('XX')).not.toBe('')
  })

  it('valida cartão pelo algoritmo de Luhn', () => {
    expect(passaNoLuhn('4111111111111111')).toBe(true)
    expect(passaNoLuhn('4111111111111112')).toBe(false)
    expect(validarNumeroCartao('4111 1111 1111 1111')).toBe('')
    expect(validarNumeroCartao('4111 1111 1111 1112')).toBe('Número de cartão inválido.')
    expect(validarNumeroCartao('4111 1111')).toBe('O número do cartão está incompleto.')
  })

  it('valida titular com nome e sobrenome', () => {
    expect(validarTitular('José da Silva')).toBe('')
    expect(validarTitular('José')).not.toBe('')
    expect(validarTitular('José 2')).not.toBe('')
  })

  it('valida vencimento no formato MM/AA e não vencido', () => {
    expect(validarVencimento('09/26', HOJE)).toBe('')
    expect(validarVencimento('08/26', HOJE)).toBe('Cartão vencido.')
    expect(validarVencimento('13/27', HOJE)).toBe('Mês de vencimento inválido.')
    expect(validarVencimento('1227', HOJE)).toBe('Use o formato MM/AA.')
  })

  it('valida CVC com 3 ou 4 dígitos', () => {
    expect(validarCvc('123')).toBe('')
    expect(validarCvc('1234')).toBe('')
    expect(validarCvc('12')).not.toBe('')
  })
})

/* Fim de checkout-validacoes.spec.js */
