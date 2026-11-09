/*
 * Acessibilidade da administração (#31, critério 8 do MVP).
 * Percorre login, lista, exclusão e formulários com a API simulada por
 * page.route (sem banco), nos projetos claro e escuro. Falha com violação
 * séria ou crítica do axe (WCAG 2.1 A e AA) ou com elemento alcançado por
 * Tab sem foco visível. As credenciais são fictícias: a API é simulada.
 */

import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// PNG de 1×1 pixel para as miniaturas.
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
)

function produtosIniciais() {
  return [1, 2, 3].map((id) => ({
    id,
    nome: `Camiseta de teste ${id}`,
    descricao: 'Produto simulado para o teste de acessibilidade.',
    preco: 79.9 + id,
    imagem_url: `/storage/produtos/teste-${id}.png`,
    criado_em: null,
  }))
}

/** Simula a API do Laravel para uma página. */
async function simularApi(page) {
  let logado = false
  let produtos = produtosIniciais()
  const json = (route, status, corpo) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(corpo) })

  await page.route('**/sanctum/csrf-cookie', (route) => route.fulfill({ status: 204 }))
  await page.route('**/storage/**', (route) =>
    route.fulfill({ status: 200, contentType: 'image/png', body: PNG }),
  )
  await page.route('**/api/**', (route) => {
    const requisicao = route.request()
    const { pathname } = new URL(requisicao.url())
    const metodo = requisicao.method()
    const usuario = { id: 1, nome: 'Pessoa de teste', email: 'teste@example.test' }

    if (pathname === '/api/user') {
      return logado ? json(route, 200, { usuario }) : json(route, 401, { message: 'Não autenticado.' })
    }
    if (pathname === '/api/login' && metodo === 'POST') {
      logado = true
      return json(route, 200, { usuario })
    }
    if (pathname === '/api/logout') {
      logado = false
      return route.fulfill({ status: 204 })
    }
    if (pathname === '/api/produtos' && metodo === 'GET') {
      return json(route, 200, {
        data: produtos,
        links: {},
        meta: { current_page: 1, last_page: 1, per_page: 10, total: produtos.length },
      })
    }
    const item = pathname.match(/^\/api\/produtos\/(\d+)$/)
    if (item && metodo === 'GET') {
      const produto = produtos.find((p) => p.id === Number(item[1]))
      return produto ? json(route, 200, { data: produto }) : json(route, 404, {})
    }
    if (item && metodo === 'DELETE') {
      produtos = produtos.filter((p) => p.id !== Number(item[1]))
      return route.fulfill({ status: 204 })
    }
    return json(route, 404, { message: 'Rota não simulada.' })
  })
}

/** Roda o axe e devolve as violações sérias ou críticas. */
async function violacoesGraves(page) {
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
async function semFocoVisivel(page, maximo = 60) {
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

test.beforeEach(async ({ page }) => {
  await simularApi(page)
})

test('login, lista, exclusão e formulários sem violações e com foco visível', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible()
  expect(await violacoesGraves(page)).toEqual([])
  const login = await semFocoVisivel(page)
  expect(login.alcancados).toBeGreaterThan(2)
  expect(login.falhas).toEqual([])

  await page.getByLabel('E-mail').fill('teste@example.test')
  await page.getByLabel('Senha').fill('senha-ficticia')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page).toHaveURL(/\/admin\/produtos$/)
  await expect(page.getByRole('row', { name: /Camiseta de teste 1/ })).toBeVisible()
  expect(await violacoesGraves(page)).toEqual([])
  const lista = await semFocoVisivel(page)
  expect(lista.alcancados).toBeGreaterThan(4)
  expect(lista.falhas).toEqual([])

  // Exclusão só pelo teclado: o foco deve ir para o título "Produtos".
  page.once('dialog', (dialogo) => dialogo.accept())
  await page.getByRole('button', { name: 'Excluir Camiseta de teste 1' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText('Produto "Camiseta de teste 1" excluído.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Produtos' })).toBeFocused()
  await expect(page.getByRole('row', { name: /Camiseta de teste 1/ })).toHaveCount(0)

  await page.getByRole('link', { name: 'Novo produto' }).click()
  await expect(page.getByRole('heading', { name: 'Novo produto' })).toBeVisible()
  expect(await violacoesGraves(page)).toEqual([])
  const novo = await semFocoVisivel(page)
  expect(novo.alcancados).toBeGreaterThan(4)
  expect(novo.falhas).toEqual([])

  await page.goto('/admin/produtos/2/editar')
  await expect(page.getByRole('heading', { name: 'Editar produto' })).toBeVisible()
  await expect(page.getByLabel('Nome')).toHaveValue('Camiseta de teste 2')
  expect(await violacoesGraves(page)).toEqual([])
  const edicao = await semFocoVisivel(page)
  expect(edicao.alcancados).toBeGreaterThan(4)
  expect(edicao.falhas).toEqual([])
})

/* Fim de admin-acessibilidade.spec.js */
