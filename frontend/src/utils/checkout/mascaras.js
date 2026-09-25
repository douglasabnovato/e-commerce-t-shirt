/*
 * Máscaras de digitação do checkout (Ex. 12). Cada função recebe o texto
 * digitado e devolve o valor formatado, limitado ao tamanho do campo.
 */

/**
 * Remove tudo o que não é dígito.
 */
export function somenteDigitos(valor) {
  return String(valor ?? '').replace(/\D/g, '')
}

/**
 * CEP: 00000-000
 */
export function mascararCep(valor) {
  const digitos = somenteDigitos(valor).slice(0, 8)
  return digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos
}

/**
 * Telefone: (00) 0000-0000 ou (00) 00000-0000
 */
export function mascararTelefone(valor) {
  const digitos = somenteDigitos(valor).slice(0, 11)
  if (digitos.length <= 2) {
    return digitos.length ? `(${digitos}` : ''
  }
  const ddd = digitos.slice(0, 2)
  const numero = digitos.slice(2)
  const corte = digitos.length === 11 ? 5 : 4
  if (numero.length <= corte) {
    return `(${ddd}) ${numero}`
  }
  return `(${ddd}) ${numero.slice(0, corte)}-${numero.slice(corte)}`
}

/**
 * Cartão: grupos de 4 dígitos, até 19 dígitos.
 */
export function mascararCartao(valor) {
  return somenteDigitos(valor)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

/**
 * Vencimento: MM/AA
 */
export function mascararVencimento(valor) {
  const digitos = somenteDigitos(valor).slice(0, 4)
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos
}

/**
 * CVC: até 4 dígitos.
 */
export function mascararCvc(valor) {
  return somenteDigitos(valor).slice(0, 4)
}

/**
 * Estado: duas letras maiúsculas.
 */
export function mascararEstado(valor) {
  return String(valor ?? '')
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * Esconde o número do cartão, mantendo só os 4 últimos dígitos.
 */
export function ocultarCartao(valor) {
  const digitos = somenteDigitos(valor)
  return digitos.length >= 4 ? `**** **** **** ${digitos.slice(-4)}` : ''
}

/* Fim de utils/checkout/mascaras.js */
