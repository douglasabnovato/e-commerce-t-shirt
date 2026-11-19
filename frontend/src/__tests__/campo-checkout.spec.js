/**
 * @vitest-environment jsdom
 *
 * O erro de validação do checkout é anunciado junto do campo (#45): com
 * erro, o input fica com aria-invalid="true" e aria-describedby apontando
 * para a mensagem; sem erro, nada disso.
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CampoCheckout from '@/components/checkout/CampoCheckout.vue'

describe('CampoCheckout', () => {
  it('liga a mensagem de erro ao campo com aria-invalid e aria-describedby', () => {
    const campo = mount(CampoCheckout, {
      props: { id: 'checkout-cep', rotulo: 'CEP', erro: 'Informe um CEP válido.' },
      attachTo: document.body,
    })

    const entrada = campo.get('input')
    expect(entrada.attributes('aria-invalid')).toBe('true')
    const descricao = entrada.attributes('aria-describedby')
    expect(descricao).toBe('checkout-cep-erro')
    expect(document.getElementById(descricao).textContent).toBe('Informe um CEP válido.')
    expect(campo.get('label').attributes('for')).toBe('checkout-cep')

    campo.unmount()
  })

  it('sem erro, o campo não aponta para mensagem nenhuma', () => {
    const campo = mount(CampoCheckout, { props: { id: 'checkout-cep', rotulo: 'CEP' } })

    const entrada = campo.get('input')
    expect(entrada.attributes('aria-invalid')).toBe('false')
    expect(entrada.attributes('aria-describedby')).toBeUndefined()
    expect(campo.find('.campo__erro').exists()).toBe(false)
  })
})

/* Fim de campo-checkout.spec.js */
