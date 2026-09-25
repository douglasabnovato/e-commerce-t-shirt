/*
 * Rotas da aplicação.
 * Todas as páginas são carregadas sob demanda (lazy loading), o que reduz o
 * JavaScript baixado na primeira visita. As rotas de administração exigem
 * login (meta.exigeLogin) e redirecionam para /login quando não há sessão.
 * O histórico usa a raiz do site ('/'): os arquivos do build ficam em
 * /spa/, mas as rotas continuam em /, /checkout, /teste-tecnico etc.
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAutenticacaoStore } from '@/stores/autenticacao'

const NOME_DO_SITE = 'T-Shirt Store'

const routes = [
  {
    path: '/',
    name: 'vitrine',
    component: () => import('@/views/VitrineView.vue'),
    meta: { titulo: 'Vitrine' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { titulo: 'Entrar', somenteVisitante: true },
  },
  {
    path: '/admin/produtos',
    name: 'admin-produtos',
    component: () => import('@/views/admin/AdminProdutosView.vue'),
    meta: { titulo: 'Administração de produtos', exigeLogin: true },
  },
  {
    path: '/admin/produtos/novo',
    name: 'admin-produto-novo',
    component: () => import('@/views/admin/ProdutoFormView.vue'),
    meta: { titulo: 'Novo produto', exigeLogin: true },
  },
  {
    path: '/admin/produtos/:id/editar',
    name: 'admin-produto-editar',
    component: () => import('@/views/admin/ProdutoFormView.vue'),
    props: true,
    meta: { titulo: 'Editar produto', exigeLogin: true },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { titulo: 'Finalização do pedido' },
  },
  {
    path: '/teste-tecnico',
    name: 'teste-tecnico',
    component: () => import('@/views/TesteTecnicoView.vue'),
    meta: { titulo: 'Teste Técnico' },
  },
  {
    path: '/:caminho(.*)*',
    name: 'nao-encontrado',
    component: () => import('@/views/NaoEncontradoView.vue'),
    meta: { titulo: 'Página não encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior(destino, _origem, posicaoSalva) {
    if (posicaoSalva) {
      return posicaoSalva
    }
    if (destino.hash) {
      return { el: destino.hash, top: 16 }
    }
    return { top: 0 }
  },
})

/**
 * Antes de cada navegação, verifica a sessão (uma vez) e aplica as regras
 * de acesso: páginas de administração exigem login e a página de login não
 * faz sentido para quem já entrou.
 */
router.beforeEach(async (destino) => {
  const autenticacao = useAutenticacaoStore()
  await autenticacao.verificarSessao()

  if (destino.meta.exigeLogin && !autenticacao.autenticado) {
    return { name: 'login', query: { redirecionar: destino.fullPath } }
  }
  if (destino.meta.somenteVisitante && autenticacao.autenticado) {
    return { name: 'admin-produtos' }
  }
  return true
})

/**
 * Depois de cada navegação, atualiza o título da aba.
 */
router.afterEach((destino) => {
  document.title = destino.meta.titulo ? `${destino.meta.titulo} · ${NOME_DO_SITE}` : NOME_DO_SITE
})

export default router

/* Fim de router/index.js */
