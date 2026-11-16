/*
 * Layout da vitrine (#36): com a lista atrasada, o rodapé não pode subir
 * para o meio da tela e descer quando os cards chegam. Mede o CLS no
 * navegador (PerformanceObserver de layout-shift) e confere axe e rolagem
 * horizontal com 12 produtos. API simulada por page.route, sem banco.
 */

import { expect, test } from '@playwright/test'
import { rolagemHorizontal, violacoesGraves } from './apoio/acessibilidade.js'

// PNG de 1×1 pixel para as imagens dos cards.
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
)

// Atraso da lista, como numa rede de celular; o rodapé fica à vista nesse tempo.
const ATRASO_MS = 800

const produtos = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  nome: `Camiseta de teste ${i + 1}`,
  descricao: 'Produto simulado para o teste de layout.',
  preco: 59.9 + i,
  imagem_url: `/storage/produtos/teste-${i + 1}.png`,
  criado_em: null,
}))

test.beforeEach(async ({ page }) => {
  // Soma os deslocamentos de layout sem interação, como o CLS do Lighthouse.
  await page.addInitScript(() => {
    window.__cls = 0
    new PerformanceObserver((lista) => {
      for (const entrada of lista.getEntries()) {
        if (!entrada.hadRecentInput) window.__cls += entrada.value
      }
    }).observe({ type: 'layout-shift', buffered: true })
  })
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (rota) => rota.abort())
  await page.route('**/storage/**', (rota) =>
    rota.fulfill({ status: 200, contentType: 'image/png', body: PNG }),
  )
  await page.route('**/api/**', async (rota) => {
    const { pathname } = new URL(rota.request().url())
    if (pathname === '/api/produtos') {
      await new Promise((pronto) => setTimeout(pronto, ATRASO_MS))
      return rota.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: produtos,
          links: {},
          meta: { current_page: 1, last_page: 1, per_page: 12, total: produtos.length },
        }),
      })
    }
    return rota.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Não autenticado.' }),
    })
  })
})

test('vitrine: rodapé fora da tela durante o carregamento e CLS abaixo de 0,1', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('status')).toContainText('Carregando produtos')

  // Durante o carregamento, o rodapé começa abaixo da dobra.
  const alturaTela = page.viewportSize().height
  const topoDoRodape = await page.locator('footer.rodape').evaluate((el) => el.getBoundingClientRect().top)
  expect(topoDoRodape).toBeGreaterThanOrEqual(alturaTela)

  await expect(page.locator('.vitrine__grade li')).toHaveCount(produtos.length)
  // Espera um quadro a mais para o observador registrar o último deslocamento.
  await page.evaluate(() => new Promise((pronto) => requestAnimationFrame(() => setTimeout(pronto, 300))))
  const cls = await page.evaluate(() => window.__cls)
  expect(cls).toBeLessThan(0.1)

  expect(await violacoesGraves(page)).toEqual([])
  expect(await rolagemHorizontal(page)).toBe(0)
})

/* Fim de vitrine-layout.spec.js */
