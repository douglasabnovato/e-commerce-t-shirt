/*
 * Store da sacola (Pinia).
 * O Ex. 12 pede que os produtos da sacola sejam hardcoded: a lista começa
 * fixa e só a quantidade de cada item pode ser alterada. O header usa o
 * total de itens para exibir "Sacola (n)".
 */

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import imagemCamiseta from '@/assets/sacola/camiseta-paulo-freire.jpg'
import imagemMoletom from '@/assets/sacola/moletom-canguru-la-luna.jpg'

export const QUANTIDADE_MINIMA = 1
export const QUANTIDADE_MAXIMA = 10

export const ITENS_INICIAIS = [
  { id: 1, nome: 'Camiseta Paulo Freire', preco: 74.99, imagem: imagemCamiseta, quantidade: 1 },
  { id: 2, nome: 'Moletom Canguru La Luna', preco: 229.99, imagem: imagemMoletom, quantidade: 2 },
]

export const useSacolaStore = defineStore('sacola', () => {
  const itens = ref(ITENS_INICIAIS.map((item) => ({ ...item })))

  const quantidadeTotal = computed(() =>
    itens.value.reduce((total, item) => total + item.quantidade, 0),
  )

  const subtotal = computed(() =>
    itens.value.reduce((total, item) => total + item.preco * item.quantidade, 0),
  )

  /**
   * Define a quantidade de um item, limitada entre o mínimo e o máximo.
   * Valores inválidos são ignorados.
   */
  function definirQuantidade(id, quantidade) {
    const item = itens.value.find((atual) => atual.id === id)
    const numero = Math.trunc(Number(quantidade))
    if (!item || Number.isNaN(numero)) {
      return
    }
    item.quantidade = Math.min(QUANTIDADE_MAXIMA, Math.max(QUANTIDADE_MINIMA, numero))
  }

  /**
   * Soma uma unidade ao item.
   */
  function aumentar(id) {
    const item = itens.value.find((atual) => atual.id === id)
    if (item) {
      definirQuantidade(id, item.quantidade + 1)
    }
  }

  /**
   * Subtrai uma unidade do item, respeitando o mínimo de 1.
   */
  function diminuir(id) {
    const item = itens.value.find((atual) => atual.id === id)
    if (item) {
      definirQuantidade(id, item.quantidade - 1)
    }
  }

  return { itens, quantidadeTotal, subtotal, definirQuantidade, aumentar, diminuir }
})

/* Fim de stores/sacola.js */
