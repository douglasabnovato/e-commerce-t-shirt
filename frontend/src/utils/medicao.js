/*
 * Medição de uso (critério 5, decisão D5 de 10/11/2026): GoatCounter, sem
 * cookie e sem dado pessoal. Conta o caminho de cada página (também nas
 * trocas de rota do Vue Router) e o evento "pedido-fechado" no checkout (só o
 * nome; nada do pedido). Só carrega no build de produção e fora de navegador
 * automatizado (Playwright). A conta `douglasabnovato` é do responsável.
 */

export const ENDERECO_CONTAGEM = 'https://douglasabnovato.goatcounter.com/count'
export const SCRIPT_CONTAGEM = 'https://gc.zgo.at/count.js'

/** Diz se a visita deve ser contada. */
export function deveMedir({ producao, automatizado }) {
  return Boolean(producao) && !automatizado
}

/**
 * Acrescenta o script do GoatCounter uma única vez. Com `no_onload`, a
 * primeira visita e as trocas de rota são contadas por `contarPagina`.
 */
export function iniciarMedicao(documento, ambiente) {
  if (!deveMedir(ambiente)) return false
  if (documento.querySelector('script[data-goatcounter]')) return true
  const script = documento.createElement('script')
  script.async = true
  script.src = SCRIPT_CONTAGEM
  script.dataset.goatcounter = ENDERECO_CONTAGEM
  script.dataset.goatcounterSettings = '{"no_onload": true}'
  documento.body.appendChild(script)
  return true
}

/** Conta a página do caminho informado, se o GoatCounter estiver carregado. */
export function contarPagina(caminho, janela = globalThis.window) {
  const contador = janela?.goatcounter
  if (!contador?.count) return false
  contador.count({ path: caminho })
  return true
}

/** Conta um evento pelo nome, se o GoatCounter estiver carregado. */
export function contarEvento(nome, janela = globalThis.window) {
  const contador = janela?.goatcounter
  if (!contador?.count) return false
  contador.count({ path: nome, event: true })
  return true
}

/* Fim de medicao.js */
