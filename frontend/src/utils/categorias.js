/*
 * Categorias do menu (D4). O Ex. 10 define o produto só com nome,
 * descrição, preço e imagem; por isso a categoria é derivada de um termo
 * de busca no nome, sem criar coluna nova no banco.
 */

export const CATEGORIAS = [
  { slug: 'camisetas', rotulo: 'Camisetas', busca: 'Camiseta' },
  { slug: 'moletons', rotulo: 'Moletons', busca: 'Moletom' },
  { slug: 'acessorios', rotulo: 'Acessórios', busca: 'Sketchbook' },
]

/**
 * Retorna a categoria correspondente ao slug, ou null.
 */
export function buscarCategoria(slug) {
  return CATEGORIAS.find((categoria) => categoria.slug === slug) ?? null
}

/* Fim de utils/categorias.js */
