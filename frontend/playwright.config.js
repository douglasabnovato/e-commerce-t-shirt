/*
 * Playwright: teste de acessibilidade da administração (#31).
 * Usa o build de produção servido pelo `vite preview`, com a base em / (o
 * build publicado usa /spa/, servido pelo Laravel). A API é simulada no
 * próprio teste com page.route, sem banco. Porta própria (E2E_PORT) para não
 * colidir com outros servidores locais.
 */

import { defineConfig, devices } from '@playwright/test'

const porta = Number(process.env.E2E_PORT ?? 4193)

export default defineConfig({
  testDir: './e2e',
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
  projects: [
    { name: 'claro', use: { ...devices['Desktop Chrome'], colorScheme: 'light' } },
    { name: 'escuro', use: { ...devices['Desktop Chrome'], colorScheme: 'dark' } },
  ],
  webServer: {
    command: `npx vite build --base / --outDir ../.build-e2e --emptyOutDir && npx vite preview --outDir ../.build-e2e --port ${porta} --strictPort`,
    url: `http://localhost:${porta}/login`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})

/* Fim de playwright.config.js */
