/*
 * Ponto de entrada do frontend: estilos globais em LESS, Pinia (estado) e
 * Vue Router (rotas).
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './styles/main.less'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

/* Fim de main.js */
