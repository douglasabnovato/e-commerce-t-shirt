/*
 * Serviço do checkout (Ex. 12).
 * - buscarEndereco: consulta o CEP com a biblioteca cep-promise, exigida
 *   pelo enunciado. Ela tenta vários provedores (ViaCEP, BrasilAPI…) e
 *   usa o primeiro que responder. É carregada sob demanda.
 * - enviarPedido: envio simulado (decisão D16). O enunciado pede loading,
 *   mensagem de sucesso e console.log do objeto final, sem API de pedidos.
 *   Trocar por uma chamada real afeta só esta função.
 */

import { somenteDigitos } from '@/utils/checkout/mascaras'

const LATENCIA_SIMULADA_MS = 1200

/**
 * Busca o endereço de um CEP e devolve no formato do formulário.
 * Lança um Error com mensagem amigável quando o CEP não existe ou os
 * serviços estão indisponíveis.
 */
export async function buscarEndereco(cep) {
  const { default: cepPromise } = await import('cep-promise')
  try {
    const endereco = await cepPromise(somenteDigitos(cep), { timeout: 8000 })
    return {
      rua: endereco.street ?? '',
      bairro: endereco.neighborhood ?? '',
      cidade: endereco.city ?? '',
      estado: endereco.state ?? '',
    }
  } catch (erro) {
    const naoEncontrado = erro?.type === 'service_error'
    throw new Error(
      naoEncontrado
        ? 'CEP não encontrado. Confira o número ou preencha o endereço manualmente.'
        : 'CEP inválido.',
      { cause: erro },
    )
  }
}

/**
 * Simula o envio do pedido ao servidor e devolve um número de pedido.
 */
export function enviarPedido(pedido) {
  return new Promise((resolver) => {
    setTimeout(() => {
      resolver({ numero: `TS-${Date.now().toString().slice(-6)}`, recebidoEm: pedido.criadoEm })
    }, LATENCIA_SIMULADA_MS)
  })
}

/* Fim de services/checkout.js */
