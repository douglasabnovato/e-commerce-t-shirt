/*
 * Ordenações da vitrine. Os valores são os mesmos aceitos pela API em
 * ?ordem= (ProdutoController::ORDENACOES). Valor desconhecido na URL volta
 * para a padrão, igual ao backend.
 */

export const ORDENACAO_PADRAO = 'recentes'

export const ORDENACOES = [
  { valor: 'recentes', rotulo: 'Mais recentes' },
  { valor: 'menor-preco', rotulo: 'Menor preço' },
  { valor: 'maior-preco', rotulo: 'Maior preço' },
  { valor: 'nome', rotulo: 'Nome (A–Z)' },
]

/**
 * Retorna o valor de ordenação válido para o texto da URL.
 */
export function normalizarOrdenacao(valor) {
  return ORDENACOES.some((opcao) => opcao.valor === valor) ? valor : ORDENACAO_PADRAO
}

/**
 * Query da vitrine ao trocar a ordenação: volta para a página 1 e tira a
 * ordem padrão da URL, para o link ficar curto.
 */
export function queryComOrdenacao(query, valor) {
  const resto = { ...query }
  delete resto.pagina
  delete resto.ordem
  const ordem = normalizarOrdenacao(valor)
  return ordem === ORDENACAO_PADRAO ? resto : { ...resto, ordem }
}

/* Fim de utils/ordenacao.js */
