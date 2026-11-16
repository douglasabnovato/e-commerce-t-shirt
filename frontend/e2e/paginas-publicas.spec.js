/*
 * Páginas públicas sem banco: Teste Técnico (respostas embutidas no build)
 * e checkout (sacola fixa). axe sem violação séria ou crítica e sem
 * rolagem horizontal, em desktop e no celular de 375 px. A API é cortada
 * com 401, como para quem não entrou.
 */

import { expect, test } from '@playwright/test'
import { rolagemHorizontal, violacoesGraves } from './apoio/acessibilidade.js'

test.beforeEach(async ({ page }) => {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (rota) => rota.abort())
  await page.route(/viacep|brasilapi|apicep|correios|widenet/, (rota) => rota.abort())
  await page.route('**/api/**', (rota) =>
    rota.fulfill({ status: 401, contentType: 'application/json', body: '{"message":"Não autenticado."}' }),
  )
})

test('Teste Técnico: código e tabelas focáveis, axe e sem rolagem horizontal', async ({ page }) => {
  await page.goto('/teste-tecnico')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  // Blocos de código e tabelas rolam na horizontal: precisam ser focáveis.
  const blocos = page.locator('.teste__resposta pre, .teste__resposta table')
  expect(await blocos.count()).toBeGreaterThan(1)
  for (const bloco of await blocos.all()) {
    await expect(bloco).toHaveAttribute('tabindex', '0')
  }
  expect(await violacoesGraves(page)).toEqual([])
  expect(await rolagemHorizontal(page)).toBe(0)
})

test('checkout: axe e sem rolagem horizontal', async ({ page }) => {
  await page.goto('/checkout')
  await expect(page.getByRole('button', { name: 'Fechar pedido' })).toBeVisible()
  expect(await violacoesGraves(page)).toEqual([])
  expect(await rolagemHorizontal(page)).toBe(0)
})

/* Fim de paginas-publicas.spec.js */
