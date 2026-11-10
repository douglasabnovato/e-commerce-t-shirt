/*
 * Playwright: fluxo principal contra o backend de verdade (#21, critério 3).
 * O Laravel (SQLite, migrado e com o seed de demonstração) entrega a API e o
 * build do Vue em /spa/, na mesma origem, como em produção. Nada da API é
 * simulado; só a busca de CEP, que é de terceiros, recebe resposta fixa.
 * Antes de rodar: build do front em backend/public/spa e banco preparado
 * (ver o job `fluxo` do CI e o README).
 */

import { defineConfig, devices } from '@playwright/test'

const porta = Number(process.env.FLUXO_PORT ?? 8000)

export default defineConfig({
  testDir: './e2e/fluxo',
  timeout: 120000,
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'list' : 'line',
  use: {
    baseURL: `http://127.0.0.1:${porta}`,
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: `php artisan serve --host 127.0.0.1 --port ${porta}`,
    cwd: '../backend',
    url: `http://127.0.0.1:${porta}/api/saude`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})

/* Fim de playwright.fluxo.config.js */
