/*
 * Serviço de produtos (Ex. 10): funções que consomem as rotas REST da API.
 * Criação e edição enviam multipart/form-data por causa da imagem; a edição
 * usa POST com _method=PUT, porque o PHP não lê arquivos enviados em PUT.
 */

import api from './api'

/**
 * Monta o FormData do produto. A imagem só é incluída quando um arquivo
 * novo foi escolhido.
 */
export function montarFormData({ nome, descricao, preco, imagem }) {
  const dados = new FormData()
  dados.append('nome', nome ?? '')
  dados.append('descricao', descricao ?? '')
  dados.append('preco', preco ?? '')
  if (imagem instanceof File) {
    dados.append('imagem', imagem)
  }
  return dados
}

/**
 * Devolve (uma vez só) a busca da primeira página iniciada pelo index.html
 * antes de o Vue carregar (#29), ou null se ela não existir.
 */
export function consumirVitrineInicial() {
  const promessa = globalThis.__vitrineInicial ?? null
  globalThis.__vitrineInicial = undefined
  return promessa
}

/**
 * GET /api/produtos · Lista paginada, com busca opcional por nome e
 * ordenação opcional (recentes, menor-preco, maior-preco, nome).
 * A busca já iniciada pelo index.html é descartada na primeira chamada,
 * seja ela qual for, para nunca voltar depois como dado velho; só é usada
 * se essa chamada for a primeira página sem filtro. Se ela falhou, a lista
 * é pedida de novo pelo axios, para que o erro chegue à tela como sempre.
 */
export async function listarProdutos({ pagina = 1, porPagina = 12, busca, ordem } = {}) {
  const primeiraPaginaSemFiltro =
    pagina === 1 && porPagina === 12 && !busca && (!ordem || ordem === 'recentes')
  const inicial = consumirVitrineInicial()
  if (inicial && primeiraPaginaSemFiltro) {
    try {
      const corpo = await inicial
      if (Array.isArray(corpo?.data) && corpo.meta) {
        return { produtos: corpo.data, paginacao: corpo.meta }
      }
    } catch {
      // segue para o pedido normal abaixo
    }
  }

  const { data } = await api.get('/produtos', {
    params: {
      page: pagina,
      por_pagina: porPagina,
      busca: busca || undefined,
      ordem: ordem && ordem !== 'recentes' ? ordem : undefined,
    },
  })
  return { produtos: data.data, paginacao: data.meta }
}

/**
 * GET /api/produtos/{id} · Um produto.
 */
export async function obterProduto(id) {
  const { data } = await api.get(`/produtos/${id}`)
  return data.data
}

/**
 * POST /api/produtos · Cria um produto (requer login).
 */
export async function criarProduto(campos) {
  const { data } = await api.post('/produtos', montarFormData(campos))
  return data.data
}

/**
 * PUT /api/produtos/{id} · Atualiza um produto (requer login).
 */
export async function atualizarProduto(id, campos) {
  const dados = montarFormData(campos)
  dados.append('_method', 'PUT')
  const { data } = await api.post(`/produtos/${id}`, dados)
  return data.data
}

/**
 * DELETE /api/produtos/{id} · Exclui um produto (requer login).
 */
export async function excluirProduto(id) {
  await api.delete(`/produtos/${id}`)
}

/* Fim de services/produtos.js */
