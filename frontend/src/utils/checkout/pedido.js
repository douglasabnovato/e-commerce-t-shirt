/*
 * Montagem do objeto final do pedido (Ex. 12), exibido no console ao
 * fechar o pedido. Por segurança, o número do cartão vai mascarado e o
 * CVC não é incluído: dados sensíveis não devem aparecer em logs.
 */

import { ocultarCartao, somenteDigitos } from './mascaras'

/**
 * Arredonda valores monetários para duas casas decimais.
 */
function emReais(valor) {
  return Math.round(valor * 100) / 100
}

/**
 * Monta o pedido a partir dos dados do formulário e dos itens da sacola.
 */
export function montarPedido(dados, itens, criadoEm = new Date()) {
  const linhas = itens.map((item) => ({
    id: item.id,
    nome: item.nome,
    precoUnitario: item.preco,
    quantidade: item.quantidade,
    total: emReais(item.preco * item.quantidade),
  }))
  const subtotal = emReais(linhas.reduce((soma, linha) => soma + linha.total, 0))

  return {
    contato: {
      email: dados.email.trim(),
      telefone: somenteDigitos(dados.telefone),
    },
    entrega: {
      cep: somenteDigitos(dados.cep),
      rua: dados.rua.trim(),
      numero: dados.numero.trim().toUpperCase(),
      bairro: dados.bairro.trim(),
      cidade: dados.cidade.trim(),
      estado: dados.estado.trim().toUpperCase(),
    },
    pagamento: {
      cartao: ocultarCartao(dados.numeroCartao),
      titular: dados.titular.trim().toUpperCase(),
      vencimento: dados.vencimento,
    },
    itens: linhas,
    totais: {
      quantidadeDeItens: linhas.reduce((soma, linha) => soma + linha.quantidade, 0),
      subtotal,
      frete: 0,
      total: subtotal,
    },
    criadoEm: criadoEm.toISOString(),
  }
}

/* Fim de utils/checkout/pedido.js */
