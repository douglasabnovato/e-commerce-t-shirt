<!--
  Formulário de criação e edição de produto (Ex. 10 · CRUD).
  Campos exigidos pelo enunciado: nome, descrição, preço e imagem. Valida no
  navegador o essencial e exibe, ao lado de cada campo, os erros de
  validação devolvidos pela API (422). Tem um botão que preenche dados de
  exemplo com o faker-js (sugestão do enunciado), carregado sob demanda.
-->
<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import CarregandoIndicador from '@/components/ui/CarregandoIndicador.vue'
import { atualizarProduto, criarProduto, obterProduto } from '@/services/produtos'
import { extrairErro } from '@/services/api'

const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp']
const TAMANHO_MAXIMO = 2 * 1024 * 1024

const props = defineProps({
  id: { type: String, default: null },
})

const router = useRouter()
const editando = computed(() => props.id !== null)

const formulario = reactive({ nome: '', descricao: '', preco: '', imagem: null })
const imagemAtual = ref(null)
const previa = ref(null)
const erros = ref({})
const erroGeral = ref('')
const carregando = ref(false)
const salvando = ref(false)

/**
 * No modo edição, carrega o produto e preenche o formulário.
 */
async function carregarProduto() {
  carregando.value = true
  try {
    const produto = await obterProduto(props.id)
    formulario.nome = produto.nome
    formulario.descricao = produto.descricao
    formulario.preco = Number(produto.preco).toFixed(2).replace('.', ',')
    imagemAtual.value = produto.imagem_url
  } catch (falha) {
    erroGeral.value = extrairErro(falha).mensagem
  } finally {
    carregando.value = false
  }
}

/**
 * Libera a URL temporária usada na pré-visualização da imagem.
 */
function liberarPrevia() {
  if (previa.value) {
    URL.revokeObjectURL(previa.value)
    previa.value = null
  }
}

/**
 * Recebe o arquivo escolhido, confere tipo e tamanho e gera a prévia.
 */
function escolherImagem(evento) {
  const arquivo = evento.target.files?.[0] ?? null
  liberarPrevia()
  formulario.imagem = null
  erros.value = { ...erros.value, imagem: undefined }

  if (!arquivo) {
    return
  }
  if (!TIPOS_ACEITOS.includes(arquivo.type)) {
    erros.value.imagem = 'A imagem deve estar em JPG, PNG ou WEBP.'
    evento.target.value = ''
    return
  }
  if (arquivo.size > TAMANHO_MAXIMO) {
    erros.value.imagem = 'A imagem deve ter no máximo 2 MB.'
    evento.target.value = ''
    return
  }
  formulario.imagem = arquivo
  previa.value = URL.createObjectURL(arquivo)
}

/**
 * Validação no navegador, espelhando as regras principais da API.
 */
function validar() {
  const novos = {}
  if (formulario.nome.trim().length < 3) {
    novos.nome = 'O nome deve ter pelo menos 3 caracteres.'
  }
  if (formulario.descricao.trim().length < 10) {
    novos.descricao = 'A descrição deve ter pelo menos 10 caracteres.'
  }
  const preco = Number(String(formulario.preco).replace(',', '.'))
  if (!formulario.preco || Number.isNaN(preco) || preco <= 0) {
    novos.preco = 'Informe um preço maior que zero.'
  }
  if (!editando.value && !formulario.imagem) {
    novos.imagem = 'Escolha uma imagem para o produto.'
  }
  erros.value = novos
  return Object.keys(novos).length === 0
}

/**
 * Envia para a API (criação ou edição) e volta para a lista com aviso.
 */
async function salvar() {
  erroGeral.value = ''
  if (!validar()) {
    erroGeral.value = 'Verifique os campos destacados.'
    return
  }
  salvando.value = true
  try {
    const dados = { ...formulario, preco: String(formulario.preco).replace(',', '.') }
    if (editando.value) {
      await atualizarProduto(props.id, dados)
    } else {
      await criarProduto(dados)
    }
    await router.push({
      name: 'admin-produtos',
      query: { aviso: editando.value ? 'atualizado' : 'criado' },
    })
  } catch (falha) {
    const { mensagem, campos } = extrairErro(falha)
    erros.value = campos
    erroGeral.value = mensagem
  } finally {
    salvando.value = false
  }
}

/**
 * Preenche nome, descrição e preço com dados fictícios do faker-js em
 * pt_BR. A biblioteca só é baixada quando o botão é usado.
 */
async function preencherExemplo() {
  const { faker } = await import('@faker-js/faker/locale/pt_BR')
  const tipo = faker.helpers.arrayElement(['Camiseta', 'Moletom', 'Caneca', 'Sketchbook'])
  const cor = faker.color.human()
  formulario.nome = `${tipo} ${faker.commerce.productAdjective()} ${cor}`
  formulario.descricao = `${tipo} na cor ${cor}, feito em ${faker.commerce.productMaterial().toLowerCase()}, com estampa exclusiva.`
  formulario.preco = faker.commerce.price({ min: 39, max: 249, dec: 2 }).replace('.', ',')
  erros.value = {}
}

onMounted(() => {
  if (editando.value) {
    carregarProduto()
  }
})

onBeforeUnmount(liberarPrevia)
</script>

<template>
  <section class="container formulario-produto" aria-labelledby="titulo-formulario">
    <p><RouterLink :to="{ name: 'admin-produtos' }">← Voltar para a lista</RouterLink></p>
    <h1 id="titulo-formulario">{{ editando ? 'Editar produto' : 'Novo produto' }}</h1>

    <CarregandoIndicador v-if="carregando" texto="Carregando produto…" />

    <template v-else>
      <div v-if="erroGeral" class="alerta alerta--erro" role="alert">{{ erroGeral }}</div>

      <form novalidate @submit.prevent="salvar">
        <div class="campo">
          <label class="campo__rotulo" for="produto-nome">Nome</label>
          <input
            id="produto-nome"
            v-model="formulario.nome"
            class="campo__entrada"
            type="text"
            maxlength="120"
            required
            :aria-invalid="erros.nome ? 'true' : 'false'"
            :aria-describedby="erros.nome ? 'produto-nome-erro' : undefined"
          />
          <p v-if="erros.nome" id="produto-nome-erro" class="campo__erro">{{ erros.nome }}</p>
        </div>

        <div class="campo">
          <label class="campo__rotulo" for="produto-descricao">Descrição</label>
          <textarea
            id="produto-descricao"
            v-model="formulario.descricao"
            class="campo__entrada"
            maxlength="2000"
            required
            :aria-invalid="erros.descricao ? 'true' : 'false'"
            :aria-describedby="erros.descricao ? 'produto-descricao-erro' : undefined"
          ></textarea>
          <p v-if="erros.descricao" id="produto-descricao-erro" class="campo__erro">
            {{ erros.descricao }}
          </p>
        </div>

        <div class="campo campo--preco">
          <label class="campo__rotulo" for="produto-preco">Preço (R$)</label>
          <input
            id="produto-preco"
            v-model="formulario.preco"
            class="campo__entrada"
            type="text"
            inputmode="decimal"
            placeholder="0,00"
            required
            :aria-invalid="erros.preco ? 'true' : 'false'"
            :aria-describedby="erros.preco ? 'produto-preco-erro' : undefined"
          />
          <p v-if="erros.preco" id="produto-preco-erro" class="campo__erro">{{ erros.preco }}</p>
        </div>

        <div class="campo">
          <label class="campo__rotulo" for="produto-imagem">
            Imagem {{ editando ? '(opcional: envie só se quiser trocar)' : '' }}
          </label>
          <input
            id="produto-imagem"
            class="campo__entrada"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            :aria-invalid="erros.imagem ? 'true' : 'false'"
            aria-describedby="produto-imagem-ajuda"
            @change="escolherImagem"
          />
          <p id="produto-imagem-ajuda" class="campo__ajuda">JPG, PNG ou WEBP, até 2 MB.</p>
          <p v-if="erros.imagem" class="campo__erro" role="alert">{{ erros.imagem }}</p>
        </div>

        <figure v-if="previa || imagemAtual" class="formulario-produto__previa">
          <img :src="previa ?? imagemAtual" alt="" width="160" height="224" />
          <figcaption>{{ previa ? 'Nova imagem' : 'Imagem atual' }}</figcaption>
        </figure>

        <div class="formulario-produto__acoes">
          <button
            type="submit"
            class="botao"
            :disabled="salvando"
            :aria-busy="salvando ? 'true' : 'false'"
          >
            {{ salvando ? 'Salvando…' : 'Salvar' }}
          </button>
          <button
            type="button"
            class="botao botao--secundario"
            :disabled="salvando"
            @click="preencherExemplo"
          >
            Preencher com dados de exemplo
          </button>
        </div>
      </form>
    </template>
  </section>
</template>

<style scoped lang="less">
.formulario-produto {
  max-width: 40rem;

  .campo--preco {
    max-width: 12rem;
  }

  &__previa {
    margin: 0 0 @espaco-5;

    img {
      width: 160px;
      height: 224px;
      object-fit: cover;
      border: 1px solid @cor-cinza-300;
    }

    figcaption {
      margin-top: @espaco-1;
      font-size: @texto-pequeno;
      color: @cor-texto-suave;
    }
  }

  &__acoes {
    display: flex;
    flex-wrap: wrap;
    gap: @espaco-3;
  }
}
</style>
<!-- Fim de ProdutoFormView.vue -->
