/*
 * Apoio dos testes de acessibilidade no navegador: axe (WCAG 2.1 A e AA),
 * varredura de foco por Tab e rolagem horizontal da página. Usado pelos
 * testes com a API simulada e pelo fluxo contra o Laravel de verdade.
 */

import AxeBuilder from '@axe-core/playwright'

/** Roda o axe e devolve as violações sérias ou críticas. */
export async function violacoesGraves(page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
}

/**
 * Percorre a página com Tab a partir do início e devolve os elementos
 * alcançados sem contorno nem sombra de foco. Cada elemento é marcado com
 * data-e2e-visto, para que dois controles com o mesmo nome não encerrem a
 * volta antes do fim; contorno transparente não conta como visível.
 */
export async function semFocoVisivel(page, maximo = 60) {
  await page.evaluate(() => {
    document.querySelectorAll('[data-e2e-visto]').forEach((el) => el.removeAttribute('data-e2e-visto'))
    document.activeElement?.blur()
  })
  await page.locator('body').focus()
  let alcancados = 0
  const falhas = []
  for (let i = 0; i < maximo; i += 1) {
    await page.keyboard.press('Tab')
    const info = await page.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body || el.hasAttribute('data-e2e-visto')) return null
      el.setAttribute('data-e2e-visto', '')
      const estilo = getComputedStyle(el)
      const transparente = (cor) => cor === 'transparent' || /rgba\(.*,\s*0\)$/.test(cor)
      const contorno =
        estilo.outlineStyle !== 'none' &&
        parseFloat(estilo.outlineWidth) > 0 &&
        !transparente(estilo.outlineColor)
      const sombra = estilo.boxShadow && estilo.boxShadow !== 'none'
      const nome = `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40)}"`
      return { nome, visivel: contorno || sombra }
    })
    if (!info) break
    alcancados += 1
    if (!info.visivel) falhas.push(info.nome)
  }
  return { alcancados, falhas }
}

/**
 * Quantos pixels a página rola na horizontal (0 é o esperado). Numa tela
 * de celular, qualquer valor acima de 0 corta conteúdo ou obriga a rolar
 * para os lados.
 */
export async function rolagemHorizontal(page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
}

/* Fim de acessibilidade.js */
