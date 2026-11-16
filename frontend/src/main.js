/*
 * Ponto de entrada do frontend: estilos globais em LESS, Pinia (estado) e
 * Vue Router (rotas).
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './styles/main.less'
import App from './App.vue'
import router from './router'
import { contarPagina, iniciarMedicao } from './utils/medicao'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

/* Medição de uso só no build de produção e fora de testes automatizados (D5). */
if (
  iniciarMedicao(document, { producao: import.meta.env.PROD, automatizado: navigator.webdriver })
) {
  // O script chega depois da primeira rota: tenta contar até ele carregar.
  const contarQuandoPronto = (caminho, tentativas = 20) => {
    if (contarPagina(caminho) || tentativas === 0) return
    setTimeout(() => contarQuandoPronto(caminho, tentativas - 1), 500)
  }
  // Primeira rota depois que o router fica pronto; as seguintes, a cada troca.
  router.isReady().then(() => {
    contarQuandoPronto(router.currentRoute.value.path)
    router.afterEach((destino, origem) => {
      if (destino.path !== origem.path) contarQuandoPronto(destino.path)
    })
  })
}

/* Fim de main.js */
