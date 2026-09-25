/*
 * Funções de formatação para exibição em pt-BR.
 */

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/**
 * Formata um número como preço em reais (ex.: 79.9 → "R$ 79,90").
 */
export function formatarPreco(valor) {
  return moeda.format(Number(valor) || 0)
}

/* Fim de utils/formatadores.js */
