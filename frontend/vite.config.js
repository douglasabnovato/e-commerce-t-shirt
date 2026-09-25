/*
 * Configuração do Vite.
 * - Proxy de /api, /sanctum e /storage para o Laravel (localhost:8000): o
 *   navegador enxerga uma origem só, o que permite a autenticação por cookie
 *   do Sanctum sem CORS (decisões D10 e D15).
 * - Alias @docs para a pasta docs/ da raiz do repositório: a página Teste
 *   Técnico lê as respostas direto de docs/respostas no build (D13).
 * - Variáveis e mixins LESS injetados em todos os estilos dos componentes.
 */

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const caminho = (relativo) => fileURLToPath(new URL(relativo, import.meta.url))
const backend = 'http://localhost:8000'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': caminho('./src'),
      '@docs': caminho('../docs'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import (reference) "${caminho('./src/styles/tokens.less')}"; @import (reference) "${caminho('./src/styles/mixins.less')}";`,
      },
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
    proxy: {
      '/api': { target: backend, changeOrigin: false },
      '/sanctum': { target: backend, changeOrigin: false },
      '/storage': { target: backend, changeOrigin: false },
    },
  },
})

/* Fim de vite.config.js */
