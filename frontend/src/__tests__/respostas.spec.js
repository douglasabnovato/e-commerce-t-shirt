/**
 * @vitest-environment node
 *
 * Testes da organização das respostas exibidas na página Teste Técnico.
 */

import { describe, expect, it } from 'vitest'
import { envolverTabelas, montarRespostas, separarTitulo } from '../utils/respostas'

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

  it('envolve cada tabela num invólucro rolável com nome, sem mexer na tabela (#46)', () => {
    const html = '<p>x</p><table>\n<tr><td>a</td></tr>\n</table><table><tr><td>b</td></tr></table>'
    const resultado = envolverTabelas(html, 3)
    expect(resultado).toBe(
      '<p>x</p>' +
        '<div class="tabela-rolavel" role="region" tabindex="0" aria-label="Tabela 1 do exercício 03"><table>\n<tr><td>a</td></tr>\n</table></div>' +
        '<div class="tabela-rolavel" role="region" tabindex="0" aria-label="Tabela 2 do exercício 03"><table><tr><td>b</td></tr></table></div>',
    )
    expect(envolverTabelas('<p>sem tabela</p>', 1)).toBe('<p>sem tabela</p>')
  })
})

/* Fim de respostas.spec.js */
