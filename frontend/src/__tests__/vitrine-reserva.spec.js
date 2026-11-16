/**
 * Área reservada da vitrine enquanto a lista carrega (#36): sem ela, o
 * rodapé aparece logo abaixo do topo e desce quando os cards chegam (CLS).
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'

vi.mock('@/services/produtos', () => ({ listarProdutos: vi.fn() }))

const { listarProdutos } = await import('@/services/produtos')
const { default: VitrineView } = await import('../views/VitrineView.vue')

async function montar() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: VitrineView }],
  })
  await router.push('/')
  await router.isReady()
  return mount(VitrineView, { global: { plugins: [router] } })
}

afterEach(() => vi.clearAllMocks())

describe('vitrine: área reservada durante o carregamento', () => {
  it('reserva a área da grade, com o indicador dentro, enquanto a lista não chega', async () => {
    listarProdutos.mockReturnValue(new Promise(() => {}))
    const tela = await montar()
    const reserva = tela.find('[data-testid="vitrine-reserva"]')
    expect(reserva.exists()).toBe(true)
    expect(reserva.classes()).toContain('vitrine__reserva')
    expect(reserva.find('[role="status"]').text()).toContain('Carregando produtos')
    expect(tela.find('.vitrine__grade').exists()).toBe(false)
  })

  it('tira a reserva quando os cards chegam', async () => {
    listarProdutos.mockResolvedValue({
      produtos: [{ id: 1, nome: 'Camiseta', descricao: '', preco: 50, imagem_url: '/x.webp' }],
      paginacao: { current_page: 1, last_page: 1, total: 1 },
    })
    const tela = await montar()
    await flushPromises()
    expect(tela.find('[data-testid="vitrine-reserva"]').exists()).toBe(false)
    expect(tela.findAll('.vitrine__grade li')).toHaveLength(1)
  })

  it('tira a reserva também no erro', async () => {
    listarProdutos.mockRejectedValue(new Error('rede'))
    const tela = await montar()
    await flushPromises()
    expect(tela.find('[data-testid="vitrine-reserva"]').exists()).toBe(false)
    expect(tela.find('[role="alert"]').exists()).toBe(true)
  })
})

describe('vitrine: vazio e erro com nova tentativa (critério 6)', () => {
  it('lista vazia mostra o aviso, sem grade', async () => {
    listarProdutos.mockResolvedValue({
      produtos: [],
      paginacao: { current_page: 1, last_page: 1, total: 0 },
    })
    const tela = await montar()
    await flushPromises()
    expect(tela.text()).toContain('Nenhum produto encontrado nesta categoria.')
    expect(tela.find('.vitrine__grade').exists()).toBe(false)
  })

  it('erro de rede mostra a mensagem, e "Tentar novamente" busca de novo', async () => {
    listarProdutos.mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValueOnce({
      produtos: [{ id: 2, nome: 'Moletom', descricao: '', preco: 120, imagem_url: '/y.webp' }],
      paginacao: { current_page: 1, last_page: 1, total: 1 },
    })
    const tela = await montar()
    await flushPromises()
    const alerta = tela.get('[role="alert"]')
    expect(alerta.text().length).toBeGreaterThan(0)
    await alerta.get('button').trigger('click')
    await flushPromises()
    expect(listarProdutos).toHaveBeenCalledTimes(2)
    expect(tela.find('[role="alert"]').exists()).toBe(false)
    expect(tela.findAll('.vitrine__grade li')).toHaveLength(1)
  })
})

/* Fim de vitrine-reserva.spec.js */
