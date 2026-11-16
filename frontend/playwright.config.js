/*
 * Playwright: acessibilidade da administração (#31) e layout da vitrine (#36).
 * Usa o build de produção servido pelo `vite preview`, com a base em / (o
 * build publicado usa /spa/, servido pelo Laravel). A API é simulada no
 * próprio teste com page.route, sem banco. Porta própria (E2E_PORT) para não
 * colidir com outros servidores locais.
 */

import { defineConfig, devices } from '@playwright/test'

const porta = Number(process.env.E2E_PORT ?? 4193)

export default defineConfig({
  testDir: './e2e',
  // O fluxo contra o backend de verdade tem config própria (playwright.fluxo.config.js).
  testIgnore: 'fluxo/**',
  timeout: 120000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'list' : 'line',
  use: {
    baseURL: `http://localhost:${porta}`,
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  // O app não tem tema escuro próprio (nenhum prefers-color-scheme no CSS):
  // um projeto "escuro" repetiria a tela clara. O segundo projeto é o celular.
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'celular',
      use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true },
    },
  ],
  webServer: {
    command: `npx vite build --base / --outDir ../.build-e2e --emptyOutDir && npx vite preview --outDir ../.build-e2e --port ${porta} --strictPort`,
    url: `http://localhost:${porta}/login`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})

/* Fim de playwright.config.js */
