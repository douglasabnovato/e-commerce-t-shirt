/*
 * Acessibilidade da administração (#31, critério 8 do MVP).
 * Percorre login, lista, exclusão e formulários com a API simulada por
 * page.route (sem banco), na largura de desktop e na de celular (375 px).
 * O app não tem tema escuro próprio (nenhum prefers-color-scheme no CSS),
 * então não há projeto "escuro": ele só repetiria a tela clara. Falha com
 * violação séria ou crítica do axe (WCAG 2.1 A e AA), com elemento
 * alcançado por Tab sem foco visível ou com rolagem horizontal da página.
 * As credenciais são fictícias: a API é simulada.
 */

import { expect, test } from '@playwright/test'
import { rolagemHorizontal, semFocoVisivel, violacoesGraves } from './apoio/acessibilidade.js'

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

test.beforeEach(async ({ page }) => {
  await simularApi(page)
})

test('login, lista, exclusão e formulários sem violações e com foco visível', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible()
  expect(await violacoesGraves(page)).toEqual([])
  expect(await rolagemHorizontal(page)).toBe(0)
  const login = await semFocoVisivel(page)
  expect(login.alcancados).toBeGreaterThan(2)
  expect(login.falhas).toEqual([])

  await page.getByLabel('E-mail').fill('teste@example.test')
  await page.getByLabel('Senha').fill('senha-ficticia')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page).toHaveURL(/\/admin\/produtos$/)
  await expect(page.getByRole('row', { name: /Camiseta de teste 1/ })).toBeVisible()
  expect(await violacoesGraves(page)).toEqual([])
  expect(await rolagemHorizontal(page)).toBe(0)
  const lista = await semFocoVisivel(page)
  expect(lista.alcancados).toBeGreaterThan(4)
  expect(lista.falhas).toEqual([])

  // Cancelar a exclusão pelo teclado (o "Esc" do critério 8: a exclusão usa
  // o confirm do navegador, #45): nada é excluído nem anunciado.
  page.once('dialog', (dialogo) => dialogo.dismiss())
  await page.getByRole('button', { name: 'Excluir Camiseta de teste 1' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('row', { name: /Camiseta de teste 1/ })).toBeVisible()
  await expect(page.getByText(/excluído\./)).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Excluir Camiseta de teste 1' })).toBeFocused()

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
  expect(await rolagemHorizontal(page)).toBe(0)
  const novo = await semFocoVisivel(page)
  expect(novo.alcancados).toBeGreaterThan(4)
  expect(novo.falhas).toEqual([])

  await page.goto('/admin/produtos/2/editar')
  await expect(page.getByRole('heading', { name: 'Editar produto' })).toBeVisible()
  await expect(page.getByLabel('Nome')).toHaveValue('Camiseta de teste 2')
  expect(await violacoesGraves(page)).toEqual([])
  expect(await rolagemHorizontal(page)).toBe(0)
  const edicao = await semFocoVisivel(page)
  expect(edicao.alcancados).toBeGreaterThan(4)
  expect(edicao.falhas).toEqual([])
})

/* Fim de admin-acessibilidade.spec.js */
