<!--
  Página "Teste Técnico" (D3): entregável principal para o avaliador ler
  todas as respostas pelo link de produção.
  As respostas vêm dos arquivos de docs/respostas, embutidos no build com
  import.meta.glob (D13): a página funciona mesmo com a API fora do ar.
  Cada exercício tem âncora própria (/teste-tecnico#ex-09).
-->
<script setup>
import MarkdownIt from 'markdown-it'
import { TITULOS_DOS_EXERCICIOS, montarRespostas, numeroComDoisDigitos } from '@/utils/respostas'

const arquivos = import.meta.glob('@docs/respostas/*.{md,txt}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true })
const respostas = montarRespostas(arquivos)
const numerosRespondidos = new Set(respostas.map((resposta) => resposta.numero))

const TELAS = [
  {
    numero: 10,
    rota: { name: 'admin-produtos' },
    texto: 'Abrir a administração de produtos (login de demonstração na tela de entrada).',
  },
  { numero: 12, rota: { name: 'checkout' }, texto: 'Abrir a página de finalização do pedido.' },
]

/**
 * Converte o markdown de uma resposta em HTML (HTML bruto desativado).
 */
function renderizar(corpo) {
  return markdown.render(corpo)
}
</script>

<template>
  <div class="container teste">
    <header class="teste__topo">
      <h1>Teste Técnico · Full Stack</h1>
      <p>Respostas dos 15 exercícios. Use o índice para ir direto a cada um.</p>
    </header>

    <nav class="teste__indice" aria-label="Índice dos exercícios">
      <h2 class="teste__indice-titulo">Índice</h2>
      <ol>
        <li v-for="(titulo, numero) in TITULOS_DOS_EXERCICIOS" :key="numero">
          <a :href="`#ex-${numeroComDoisDigitos(numero)}`">{{ titulo }}</a>
          <span v-if="!numerosRespondidos.has(Number(numero))" class="teste__pendente">
            (em elaboração)</span
          >
        </li>
      </ol>
    </nav>

    <section class="teste__telas" aria-labelledby="titulo-telas">
      <h2 id="titulo-telas">Exercícios práticos com tela</h2>
      <ul>
        <li v-for="tela in TELAS" :key="tela.numero">
          <RouterLink :to="tela.rota">
            Ex. {{ numeroComDoisDigitos(tela.numero) }} · {{ tela.texto }}
          </RouterLink>
        </li>
      </ul>
    </section>

    <p v-if="respostas.length === 0" class="alerta alerta--info">
      As respostas estão em elaboração.
    </p>

    <article
      v-for="resposta in respostas"
      :id="resposta.id"
      :key="resposta.arquivo"
      class="teste__resposta"
      :aria-labelledby="`${resposta.id}-titulo`"
    >
      <h2 :id="`${resposta.id}-titulo`">
        Ex. {{ numeroComDoisDigitos(resposta.numero) }} · {{ resposta.titulo }}
      </h2>
      <div
        v-if="resposta.tipo === 'md'"
        class="teste__conteudo"
        v-html="renderizar(resposta.corpo)"
      ></div>
      <template v-else>
        <p class="teste__arquivo">
          Arquivo entregue: <code>docs/respostas/{{ resposta.arquivo }}</code>
        </p>
        <pre class="teste__codigo"><code>{{ resposta.corpo }}</code></pre>
      </template>
      <p class="teste__voltar"><a href="#conteudo">Voltar ao topo</a></p>
    </article>
  </div>
</template>

<style scoped lang="less">
.teste {
  max-width: 52rem;

  &__topo {
    margin-bottom: @espaco-5;
  }

  &__indice {
    margin-bottom: @espaco-6;
    padding: @espaco-4 @espaco-5;
    background: @cor-cinza-100;
    border: 1px solid @cor-cinza-300;

    ol {
      margin: 0;
      padding-left: @espaco-5;
      columns: 1;

      column-gap: @espaco-6;

      .acima-de(@bp-tablet, {
        columns: 2;
      });

      li {
        break-inside: avoid;
      }
    }
  }

  &__indice-titulo {
    font-size: @texto-medio;
  }

  &__pendente {
    font-size: @texto-pequeno;
    color: @cor-texto-suave;
  }

  &__telas {
    margin-bottom: @espaco-6;
  }

  &__resposta {
    margin-bottom: @espaco-6;
    padding-top: @espaco-5;
    border-top: 1px solid @cor-preto;
    scroll-margin-top: @espaco-4;
  }

  &__conteudo {
    :deep(pre) {
      overflow-x: auto;
      padding: @espaco-3;
      background: @cor-cinza-100;
    }

    :deep(code) {
      font-size: @texto-pequeno;
    }

    :deep(h1),
    :deep(h2) {
      font-size: @texto-medio;
    }
  }

  &__arquivo {
    font-size: @texto-pequeno;
  }

  &__codigo {
    overflow-x: auto;
    padding: @espaco-3;
    font-size: @texto-pequeno;
    background: @cor-cinza-100;
  }

  &__voltar {
    font-size: @texto-pequeno;
  }
}
</style>
<!-- Fim de TesteTecnicoView.vue -->
