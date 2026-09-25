/*
 * Organiza as respostas do teste para a página Teste Técnico (D3 e D13).
 * Recebe os arquivos de docs/respostas (nome → conteúdo) e devolve a lista
 * ordenada pelo número do exercício, com âncora (ex-01…ex-15), título e tipo.
 */

export const TITULOS_DOS_EXERCICIOS = {
  1: 'Vue.js: ciclo de vida e performance',
  2: 'Laravel + Vue.js: autenticação',
  3: 'APIs: endpoint lento',
  4: 'Integrações: CDN',
  5: 'Memcached / ElastiCache com MySQL (RDS)',
  6: 'Eloquent: vantagens, desvantagens e N+1',
  7: 'Filas assíncronas no Laravel',
  8: 'Transactions',
  9: 'Leitura de log',
  10: 'CRUD de produtos (Laravel + Vue.js)',
  11: 'Crítica de código',
  12: 'Página de finalização de compra',
  13: 'Experiência profissional',
  14: 'SQL com Eloquent: clientes e pedidos',
  15: 'SQL com Eloquent: produtos, fornecedores e estoque',
}

/**
 * Formata o número do exercício com dois dígitos (1 → "01").
 */
export function numeroComDoisDigitos(numero) {
  return String(numero).padStart(2, '0')
}

/**
 * Separa o título do conteúdo quando o markdown começa com "# Título".
 */
export function separarTitulo(conteudo) {
  const [primeiraLinha, ...resto] = conteudo.split(/\r?\n/)
  if (primeiraLinha?.startsWith('# ')) {
    return { titulo: primeiraLinha.slice(2).trim(), corpo: resto.join('\n').trim() }
  }
  return { titulo: null, corpo: conteudo.trim() }
}

/**
 * Converte o mapa de arquivos do import.meta.glob em lista de respostas.
 * Arquivos cujo nome não começa com número (ex.: .gitkeep) são ignorados.
 */
export function montarRespostas(arquivos) {
  return Object.entries(arquivos)
    .map(([caminho, conteudo]) => {
      const nome = caminho.split('/').pop()
      const correspondencia = nome.match(/^(\d{1,2})\S*\.(md|txt)$/)
      if (!correspondencia) {
        return null
      }
      const numero = Number(correspondencia[1])
      const tipo = correspondencia[2]
      const { titulo, corpo } =
        tipo === 'md' ? separarTitulo(conteudo) : { titulo: null, corpo: conteudo }
      return {
        numero,
        id: `ex-${numeroComDoisDigitos(numero)}`,
        titulo: titulo ?? TITULOS_DOS_EXERCICIOS[numero] ?? `Exercício ${numero}`,
        tipo,
        arquivo: nome,
        corpo,
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.numero - b.numero || a.arquivo.localeCompare(b.arquivo))
}

/* Fim de utils/respostas.js */
