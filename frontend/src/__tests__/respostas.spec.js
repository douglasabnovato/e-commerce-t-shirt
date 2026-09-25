/**
 * @vitest-environment node
 *
 * Testes da organização das respostas exibidas na página Teste Técnico.
 */

import { describe, expect, it } from 'vitest'
import { montarRespostas, separarTitulo } from '../utils/respostas'

describe('respostas do teste técnico', () => {
  it('ordena pelo número do exercício e ignora arquivos sem número', () => {
    const respostas = montarRespostas({
      '/docs/respostas/10.md': '# CRUD\nTexto',
      '/docs/respostas/02.md': 'Sem título',
      '/docs/respostas/15.txt': 'SELECT 1;',
      '/docs/respostas/.gitkeep': '',
    })
    expect(respostas.map((resposta) => resposta.id)).toEqual(['ex-02', 'ex-10', 'ex-15'])
    expect(respostas[0].titulo).toBe('Laravel + Vue.js: autenticação')
    expect(respostas[1].titulo).toBe('CRUD')
    expect(respostas[2].tipo).toBe('txt')
  })

  it('separa o título "# " do corpo do markdown', () => {
    expect(separarTitulo('# Título\n\nCorpo')).toEqual({ titulo: 'Título', corpo: 'Corpo' })
    expect(separarTitulo('Corpo')).toEqual({ titulo: null, corpo: 'Corpo' })
  })
})

/* Fim de respostas.spec.js */
