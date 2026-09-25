/**
 * @vitest-environment node
 *
 * Testes do serviço de produtos e dos formatadores usados na vitrine.
 */

import { describe, expect, it } from 'vitest'
import { montarFormData } from '../services/produtos'
import { formatarPreco } from '../utils/formatadores'

describe('serviço de produtos', () => {
  it('monta o FormData sem imagem quando nenhum arquivo foi escolhido', () => {
    const dados = montarFormData({ nome: 'Camiseta', descricao: 'Descrição longa', preco: '79.90' })
    expect(dados.get('nome')).toBe('Camiseta')
    expect(dados.get('preco')).toBe('79.90')
    expect(dados.has('imagem')).toBe(false)
  })

  it('inclui a imagem quando é um arquivo', () => {
    const imagem = new File(['conteudo'], 'foto.png', { type: 'image/png' })
    const dados = montarFormData({ nome: 'A', descricao: 'B', preco: '1', imagem })
    expect(dados.get('imagem').name).toBe('foto.png')
  })
})

describe('formatação de preço', () => {
  it('usa o padrão brasileiro', () => {
    expect(formatarPreco(79.9).replace(/\s/g, ' ')).toBe('R$ 79,90')
  })
})

/* Fim de produtos.spec.js */
