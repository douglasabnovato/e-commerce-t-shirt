/**
 * @vitest-environment node
 *
 * O CSS das fontes do Google não entra no caminho da primeira pintura (#33):
 * fora do <noscript>, nenhuma folha de estilo externa no HTML; um script a
 * adiciona depois do evento load.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { runInNewContext } from 'node:vm'
import { describe, expect, it, vi } from 'vitest'

const html = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../../index.html'), 'utf8')
// Comentários citam "<noscript>" e confundiriam a remoção abaixo.
const semNoscript = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<noscript>[\s\S]*?<\/noscript>/g, '')

describe('fontes no index.html', () => {
  it('não tem folha de estilo externa fora do <noscript>', () => {
    expect(semNoscript).not.toMatch(/<link[^>]*rel="stylesheet"/)
    expect(html).toMatch(/<noscript>\s*<link\s+rel="stylesheet"\s+href="https:\/\/fonts\.googleapis\.com/)
  })

  it('adiciona o CSS das fontes só depois do evento load', () => {
    const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
      .map((m) => m[1])
      .find((codigo) => codigo.includes('fonts.googleapis.com'))
    const ouvintes = {}
    const adicionados = []
    const window = { addEventListener: vi.fn((evento, fn) => (ouvintes[evento] = fn)) }
    const document = {
      createElement: () => ({}),
      head: { appendChild: (el) => adicionados.push(el) },
    }

    runInNewContext(script, { window, document })
    expect(adicionados).toHaveLength(0)

    ouvintes.load()
    expect(adicionados).toHaveLength(1)
    expect(adicionados[0].rel).toBe('stylesheet')
    expect(adicionados[0].href).toMatch(/^https:\/\/fonts\.googleapis\.com\/css2\?family=Barlow/)
  })
})

/* Fim de index-html.spec.js */
