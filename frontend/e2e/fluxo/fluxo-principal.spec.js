/*
 * Fluxo principal do roteiro de 5 minutos (#21): vitrine com produtos do
 * banco, ordenação, login com a conta de demonstração do seed (pública por
 * decisão do responsável), lista da administração e checkout de
 * demonstração até a mensagem de sucesso. Tudo pelo navegador, contra o
 * Laravel de verdade: pega erro de origem, CSRF e cookie que um teste só de
 * API não pega.
 */

import { expect, test } from '@playwright/test'

/** Converte "R$ 1.234,56" em número. */
const paraNumero = (texto) => Number(texto.replace(/[^\d,]/g, '').replace(',', '.'))

test('saúde consulta o banco', async ({ request }) => {
  const resposta = await request.get('/api/saude')
  expect(resposta.status()).toBe(200)
  const corpo = await resposta.json()
  expect(corpo).toMatchObject({ ok: true, banco: 'ok' })
  expect(corpo.produtos).toBeGreaterThan(0)
})

test('vitrine, login, administração e checkout', async ({ page }) => {
  // CEP é serviço de terceiros: resposta fixa no ViaCEP, os demais cortados.
  await page.route(/viacep\.com\.br/, (rota) =>
    rota.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        complemento: '',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP',
      }),
    }),
  )
  await page.route(/brasilapi\.com\.br|apicep\.com|correios\.com\.br|widenet\.host/, (rota) =>
    rota.abort(),
  )

  // 1. Vitrine com os produtos do seed, ordenada por menor preço.
  await page.goto('/')
  const cards = page.locator('.vitrine__grade article')
  await expect(cards.first()).toBeVisible()
  expect(await cards.count()).toBeGreaterThan(1)
  await page.getByLabel('Ordenar por').selectOption('menor-preco')
  await expect(page).toHaveURL(/ordem=menor-preco/)
  await expect
    .poll(async () => {
      const precos = (await page.locator('.card__preco').allTextContents()).map(paraNumero)
      return precos.length > 1 && precos.every((p, i) => i === 0 || precos[i - 1] <= p)
    })
    .toBe(true)

  // 2. Login com a conta de demonstração e lista da administração.
  await page.goto('/login')
  await page.getByLabel('E-mail').fill('avaliador@tshirt.test')
  await page.getByLabel('Senha').fill('Avaliador@2026')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Produtos' })).toBeVisible()
  await expect(page.getByRole('button', { name: /^Excluir / }).first()).toBeVisible()

  // 3. Checkout de demonstração até a mensagem de sucesso.
  await page.goto('/checkout')
  await page.getByRole('button', { name: 'Preencher com dados de exemplo' }).click()
  await expect(page.getByText('Endereço encontrado.', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Fechar pedido' }).click()
  await expect(page.getByText('Pedido realizado com sucesso!')).toBeVisible()
})

/* Fim de fluxo-principal.spec.js */
