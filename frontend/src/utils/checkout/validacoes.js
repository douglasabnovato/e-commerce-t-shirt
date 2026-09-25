/*
 * Regras de validação do checkout (Ex. 12).
 * Todos os campos são obrigatórios e cada um tem uma regra de formato.
 * Cada validador devolve a mensagem de erro ou string vazia quando o
 * valor é válido. Funções puras, testadas sem precisar da tela.
 */

import { somenteDigitos } from './mascaras'

export const UFS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]

export const CAMPOS = [
  'email',
  'telefone',
  'cep',
  'rua',
  'numero',
  'bairro',
  'cidade',
  'estado',
  'numeroCartao',
  'titular',
  'vencimento',
  'cvc',
]

/**
 * Algoritmo de Luhn: confirma o dígito verificador de números de cartão.
 */
export function passaNoLuhn(numero) {
  const digitos = somenteDigitos(numero)
  let soma = 0
  for (let posicao = 0; posicao < digitos.length; posicao++) {
    let digito = Number(digitos[digitos.length - 1 - posicao])
    if (posicao % 2 === 1) {
      digito *= 2
      if (digito > 9) {
        digito -= 9
      }
    }
    soma += digito
  }
  return digitos.length > 0 && soma % 10 === 0
}

/**
 * Indica se o texto está vazio (ou só com espaços).
 */
function vazio(valor) {
  return String(valor ?? '').trim() === ''
}

/**
 * E-mail no formato nome@dominio.ext.
 */
export function validarEmail(valor) {
  if (vazio(valor)) return 'Informe o e-mail.'
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim()) ? '' : 'Informe um e-mail válido.'
}

/**
 * Telefone com DDD: 10 dígitos (fixo) ou 11 dígitos começando com 9
 * após o DDD (celular).
 */
export function validarTelefone(valor) {
  if (vazio(valor)) return 'Informe o telefone.'
  const digitos = somenteDigitos(valor)
  const dddValido = /^[1-9][1-9]/.test(digitos)
  const fixo = digitos.length === 10 && /^[2-5]/.test(digitos[2])
  const celular = digitos.length === 11 && digitos[2] === '9'
  return dddValido && (fixo || celular) ? '' : 'Informe um telefone válido com DDD.'
}

/**
 * CEP com 8 dígitos.
 */
export function validarCep(valor) {
  if (vazio(valor)) return 'Informe o CEP.'
  return somenteDigitos(valor).length === 8 ? '' : 'O CEP deve ter 8 dígitos.'
}

/**
 * Texto obrigatório com tamanho mínimo (rua, bairro, cidade).
 */
export function validarTexto(valor, rotulo, minimo = 2) {
  if (vazio(valor)) return `Informe ${rotulo}.`
  return valor.trim().length >= minimo ? '' : `Informe ${rotulo} completo(a).`
}

/**
 * Número do endereço: dígitos (com letra opcional, ex.: 12A) ou "S/N".
 */
export function validarNumero(valor) {
  if (vazio(valor)) return 'Informe o número.'
  return /^(\d{1,6}[a-zA-Z]?|s\/?n)$/i.test(valor.trim()) ? '' : 'Use apenas números (ou S/N).'
}

/**
 * Estado: sigla de UF existente.
 */
export function validarEstado(valor) {
  if (vazio(valor)) return 'Informe o estado.'
  return UFS.includes(valor.trim().toUpperCase()) ? '' : 'Informe a sigla do estado (ex.: MG).'
}

/**
 * Número do cartão: 13 a 19 dígitos e dígito verificador válido (Luhn).
 */
export function validarNumeroCartao(valor) {
  if (vazio(valor)) return 'Informe o número do cartão.'
  const digitos = somenteDigitos(valor)
  if (digitos.length < 13 || digitos.length > 19) return 'O número do cartão está incompleto.'
  return passaNoLuhn(digitos) ? '' : 'Número de cartão inválido.'
}

/**
 * Titular: nome e sobrenome, somente letras.
 */
export function validarTitular(valor) {
  if (vazio(valor)) return 'Informe o nome do titular.'
  const nome = valor.trim()
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' ]+$/.test(nome)) return 'Use apenas letras no nome do titular.'
  return nome.split(/\s+/).length >= 2 ? '' : 'Informe nome e sobrenome, como no cartão.'
}

/**
 * Vencimento MM/AA: mês de 01 a 12, cartão não vencido e no máximo 20
 * anos à frente. A data de referência pode ser injetada nos testes.
 */
export function validarVencimento(valor, hoje = new Date()) {
  if (vazio(valor)) return 'Informe a data de vencimento.'
  const correspondencia = String(valor).match(/^(\d{2})\/(\d{2})$/)
  if (!correspondencia) return 'Use o formato MM/AA.'
  const mes = Number(correspondencia[1])
  const ano = 2000 + Number(correspondencia[2])
  if (mes < 1 || mes > 12) return 'Mês de vencimento inválido.'
  const fimDoMes = new Date(ano, mes, 0, 23, 59, 59)
  if (fimDoMes < hoje) return 'Cartão vencido.'
  if (ano > hoje.getFullYear() + 20) return 'Data de vencimento inválida.'
  return ''
}

/**
 * CVC: 3 ou 4 dígitos.
 */
export function validarCvc(valor) {
  if (vazio(valor)) return 'Informe o CVC.'
  return /^\d{3,4}$/.test(String(valor).trim()) ? '' : 'O CVC deve ter 3 ou 4 dígitos.'
}

const VALIDADORES = {
  email: (dados) => validarEmail(dados.email),
  telefone: (dados) => validarTelefone(dados.telefone),
  cep: (dados) => validarCep(dados.cep),
  rua: (dados) => validarTexto(dados.rua, 'a rua', 3),
  numero: (dados) => validarNumero(dados.numero),
  bairro: (dados) => validarTexto(dados.bairro, 'o bairro'),
  cidade: (dados) => validarTexto(dados.cidade, 'a cidade'),
  estado: (dados) => validarEstado(dados.estado),
  numeroCartao: (dados) => validarNumeroCartao(dados.numeroCartao),
  titular: (dados) => validarTitular(dados.titular),
  vencimento: (dados, hoje) => validarVencimento(dados.vencimento, hoje),
  cvc: (dados) => validarCvc(dados.cvc),
}

/**
 * Valida um campo específico do formulário.
 */
export function validarCampo(campo, dados, hoje = new Date()) {
  return VALIDADORES[campo]?.(dados, hoje) ?? ''
}

/**
 * Valida o formulário inteiro e devolve só os campos com erro.
 */
export function validarFormulario(dados, hoje = new Date()) {
  return Object.fromEntries(
    CAMPOS.map((campo) => [campo, validarCampo(campo, dados, hoje)]).filter(([, erro]) => erro),
  )
}

/* Fim de utils/checkout/validacoes.js */
