<!--
  Página de finalização do pedido (Ex. 12).
  Requisitos do enunciado atendidos aqui:
  - sacola com produtos hardcoded e alteração de quantidade (SacolaResumo);
  - validação de formato (e-mail, telefone, CEP, cartão, data, CVC, etc.)
    e de campos vazios, todos obrigatórios;
  - endereço carregado pelo CEP com cep-promise;
  - indicadores de carregamento durante as requisições;
  - mensagem de sucesso quando todos os campos são válidos;
  - console.log do objeto final ao fechar o pedido.
  Layout de referência: docs/assets/checkout-frontend.jpg.
-->
<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import CampoCheckout from '@/components/checkout/CampoCheckout.vue'
import SacolaResumo from '@/components/checkout/SacolaResumo.vue'
import CarregandoIndicador from '@/components/ui/CarregandoIndicador.vue'
import { useSacolaStore } from '@/stores/sacola'
import { buscarEndereco, enviarPedido } from '@/services/checkout'
import {
  mascararCartao,
  mascararCep,
  mascararCvc,
  mascararEstado,
  mascararTelefone,
  mascararVencimento,
  somenteDigitos,
} from '@/utils/checkout/mascaras'
import { CAMPOS, validarCampo, validarCep, validarFormulario } from '@/utils/checkout/validacoes'
import { montarPedido } from '@/utils/checkout/pedido'

const sacola = useSacolaStore()

const dados = reactive(Object.fromEntries(CAMPOS.map((campo) => [campo, ''])))
const erros = reactive({})
const tocados = new Set()

const buscandoCep = ref(false)
const ultimoCepBuscado = ref('')
const avisoCep = ref('')
const enviando = ref(false)
const erroGeral = ref('')
const pedidoConfirmado = ref(null)
const mensagemSucesso = ref(null)

const ocupado = computed(() => buscandoCep.value || enviando.value)

/**
 * Atualiza o valor de um campo e, se ele já foi visitado, revalida na
 * hora para o erro sumir assim que o valor ficar correto.
 */
function atualizar(campo, valor) {
  dados[campo] = valor
  if (tocados.has(campo) || erros[campo]) {
    erros[campo] = validarCampo(campo, dados)
  }
  if (campo === 'cep') {
    avisoCep.value = ''
    if (somenteDigitos(valor).length === 8) {
      buscarCep()
    }
  }
}

/**
 * Ao sair do campo, marca como visitado e valida.
 */
function aoSair(campo) {
  tocados.add(campo)
  erros[campo] = validarCampo(campo, dados)
}

/**
 * Busca o endereço pelo CEP (botão de lupa ou CEP completo) e preenche
 * rua, bairro, cidade e estado. Em seguida, leva o foco ao número.
 */
async function buscarCep() {
  const erroFormato = validarCep(dados.cep)
  if (erroFormato) {
    erros.cep = erroFormato
    return
  }
  const cep = somenteDigitos(dados.cep)
  if (buscandoCep.value || cep === ultimoCepBuscado.value) {
    return
  }
  buscandoCep.value = true
  erros.cep = ''
  avisoCep.value = ''
  try {
    const endereco = await buscarEndereco(cep)
    ultimoCepBuscado.value = cep
    for (const [campo, valor] of Object.entries(endereco)) {
      if (valor) {
        dados[campo] = valor
        erros[campo] = ''
      }
    }
    avisoCep.value = 'Endereço encontrado. Confira os dados e informe o número.'
    await nextTick()
    document.getElementById('checkout-numero')?.focus()
  } catch (falha) {
    erros.cep = falha.message
  } finally {
    buscandoCep.value = false
  }
}

/**
 * Valida tudo; se houver erro, informa quantos campos corrigir e leva o
 * foco ao primeiro. Se estiver tudo certo, envia (simulado), exibe o
 * objeto final no console e mostra a mensagem de sucesso.
 */
async function fecharPedido() {
  erroGeral.value = ''
  pedidoConfirmado.value = null
  CAMPOS.forEach((campo) => tocados.add(campo))

  const encontrados = validarFormulario(dados)
  CAMPOS.forEach((campo) => {
    erros[campo] = encontrados[campo] ?? ''
  })

  const camposComErro = CAMPOS.filter((campo) => encontrados[campo])
  if (camposComErro.length > 0) {
    erroGeral.value =
      camposComErro.length === 1
        ? 'Há 1 campo para corrigir.'
        : `Há ${camposComErro.length} campos para corrigir.`
    document.getElementById(`checkout-${camposComErro[0]}`)?.focus()
    return
  }

  enviando.value = true
  try {
    const pedido = montarPedido(dados, sacola.itens)
    const confirmacao = await enviarPedido(pedido)
    console.log('Pedido finalizado (objeto final):', {
      numeroPedido: confirmacao.numero,
      ...pedido,
    })
    pedidoConfirmado.value = confirmacao
    await nextTick()
    mensagemSucesso.value?.focus()
  } catch {
    erroGeral.value = 'Não foi possível concluir o pedido. Tente novamente.'
  } finally {
    enviando.value = false
  }
}

/**
 * Preenche o formulário com dados fictícios válidos (faker-js em pt_BR,
 * sugestão do enunciado), para facilitar o teste da página. O CEP é real
 * para demonstrar a busca de endereço.
 */
async function preencherExemplo() {
  const { faker } = await import('@faker-js/faker/locale/pt_BR')
  const validade = new Date()
  validade.setFullYear(validade.getFullYear() + 3)

  atualizar('email', faker.internet.email().toLowerCase())
  atualizar('telefone', mascararTelefone(`329${faker.string.numeric(8)}`))
  atualizar(
    'numero',
    faker.string.numeric({ length: { min: 1, max: 4 }, allowLeadingZeros: false }),
  )
  atualizar('numeroCartao', mascararCartao(faker.finance.creditCardNumber({ issuer: 'visa' })))
  atualizar(
    'titular',
    `${faker.person.firstName()} ${faker.person.lastName()}`.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]/g, ''),
  )
  atualizar(
    'vencimento',
    `${String(validade.getMonth() + 1).padStart(2, '0')}/${String(validade.getFullYear()).slice(-2)}`,
  )
  atualizar('cvc', faker.string.numeric(3))
  ultimoCepBuscado.value = ''
  atualizar('cep', '01310-100')
}
</script>

<template>
  <div class="container checkout">
    <div class="checkout__topo">
      <h1 id="titulo-checkout">Finalização do pedido</h1>
      <button
        type="button"
        class="botao botao--secundario botao--pequeno"
        :disabled="ocupado"
        @click="preencherExemplo"
      >
        Preencher com dados de exemplo
      </button>
    </div>

    <div aria-live="polite">
      <div
        v-if="pedidoConfirmado"
        ref="mensagemSucesso"
        class="alerta alerta--sucesso"
        tabindex="-1"
      >
        <p><strong>Pedido realizado com sucesso!</strong></p>
        <p>Número do pedido: {{ pedidoConfirmado.numero }}. O resumo foi exibido no console.</p>
      </div>
    </div>
    <div v-if="erroGeral" class="alerta alerta--erro" role="alert">{{ erroGeral }}</div>

    <div class="checkout__colunas">
      <form
        class="checkout__formulario"
        novalidate
        aria-labelledby="titulo-checkout"
        @submit.prevent="fecharPedido"
      >
        <fieldset class="checkout__grupo" :disabled="enviando">
          <legend>Informações de contato</legend>
          <CampoCheckout
            id="checkout-email"
            rotulo="E-mail"
            tipo="email"
            autocomplete="email"
            :model-value="dados.email"
            :erro="erros.email"
            @update:model-value="atualizar('email', $event)"
            @blur="aoSair('email')"
          />
          <CampoCheckout
            id="checkout-telefone"
            rotulo="Telefone"
            tipo="tel"
            autocomplete="tel-national"
            inputmode="tel"
            placeholder="(00) 00000-0000"
            :mascara="mascararTelefone"
            :model-value="dados.telefone"
            :erro="erros.telefone"
            @update:model-value="atualizar('telefone', $event)"
            @blur="aoSair('telefone')"
          />
        </fieldset>

        <fieldset class="checkout__grupo" :disabled="enviando">
          <legend>Informações de entrega</legend>
          <div class="checkout__linha checkout__linha--cep">
            <CampoCheckout
              id="checkout-cep"
              rotulo="CEP"
              autocomplete="postal-code"
              inputmode="numeric"
              placeholder="00000-000"
              :mascara="mascararCep"
              :ocupado="buscandoCep"
              :model-value="dados.cep"
              :erro="erros.cep"
              @update:model-value="atualizar('cep', $event)"
              @blur="aoSair('cep')"
            />
            <button
              type="button"
              class="botao checkout__buscar"
              :disabled="buscandoCep"
              aria-label="Buscar endereço pelo CEP"
              @click="buscarCep"
            >
              <svg
                v-if="!buscandoCep"
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
              <span v-else class="checkout__girando" aria-hidden="true"></span>
            </button>
          </div>
          <CarregandoIndicador v-if="buscandoCep" texto="Buscando endereço…" compacto />
          <p v-else-if="avisoCep" class="campo__ajuda checkout__aviso-cep" role="status">
            {{ avisoCep }}
          </p>

          <CampoCheckout
            id="checkout-rua"
            rotulo="Rua"
            autocomplete="address-line1"
            :ocupado="buscandoCep"
            :model-value="dados.rua"
            :erro="erros.rua"
            @update:model-value="atualizar('rua', $event)"
            @blur="aoSair('rua')"
          />
          <div class="checkout__linha">
            <CampoCheckout
              id="checkout-numero"
              class="checkout__estreito"
              rotulo="Número"
              autocomplete="address-line2"
              maxlength="7"
              :model-value="dados.numero"
              :erro="erros.numero"
              @update:model-value="atualizar('numero', $event)"
              @blur="aoSair('numero')"
            />
            <CampoCheckout
              id="checkout-bairro"
              rotulo="Bairro"
              autocomplete="address-level3"
              :ocupado="buscandoCep"
              :model-value="dados.bairro"
              :erro="erros.bairro"
              @update:model-value="atualizar('bairro', $event)"
              @blur="aoSair('bairro')"
            />
          </div>
          <div class="checkout__linha">
            <CampoCheckout
              id="checkout-cidade"
              rotulo="Cidade"
              autocomplete="address-level2"
              :ocupado="buscandoCep"
              :model-value="dados.cidade"
              :erro="erros.cidade"
              @update:model-value="atualizar('cidade', $event)"
              @blur="aoSair('cidade')"
            />
            <CampoCheckout
              id="checkout-estado"
              class="checkout__estreito"
              rotulo="Estado"
              autocomplete="address-level1"
              placeholder="UF"
              :mascara="mascararEstado"
              :ocupado="buscandoCep"
              :model-value="dados.estado"
              :erro="erros.estado"
              @update:model-value="atualizar('estado', $event)"
              @blur="aoSair('estado')"
            />
          </div>
        </fieldset>

        <fieldset class="checkout__grupo" :disabled="enviando">
          <legend>Informações de pagamento</legend>
          <CampoCheckout
            id="checkout-numeroCartao"
            rotulo="Número do cartão"
            autocomplete="cc-number"
            inputmode="numeric"
            placeholder="0000 0000 0000 0000"
            :mascara="mascararCartao"
            :model-value="dados.numeroCartao"
            :erro="erros.numeroCartao"
            @update:model-value="atualizar('numeroCartao', $event)"
            @blur="aoSair('numeroCartao')"
          />
          <CampoCheckout
            id="checkout-titular"
            rotulo="Titular do cartão"
            autocomplete="cc-name"
            :model-value="dados.titular"
            :erro="erros.titular"
            @update:model-value="atualizar('titular', $event)"
            @blur="aoSair('titular')"
          />
          <div class="checkout__linha">
            <CampoCheckout
              id="checkout-vencimento"
              rotulo="Data de vencimento"
              autocomplete="cc-exp"
              inputmode="numeric"
              placeholder="MM/AA"
              :mascara="mascararVencimento"
              :model-value="dados.vencimento"
              :erro="erros.vencimento"
              @update:model-value="atualizar('vencimento', $event)"
              @blur="aoSair('vencimento')"
            />
            <CampoCheckout
              id="checkout-cvc"
              class="checkout__estreito"
              rotulo="CVC"
              autocomplete="cc-csc"
              inputmode="numeric"
              placeholder="000"
              :mascara="mascararCvc"
              :model-value="dados.cvc"
              :erro="erros.cvc"
              @update:model-value="atualizar('cvc', $event)"
              @blur="aoSair('cvc')"
            />
          </div>
        </fieldset>

        <div class="checkout__acoes">
          <CarregandoIndicador v-if="enviando" texto="Enviando pedido…" compacto />
          <button
            type="submit"
            class="botao"
            :disabled="ocupado"
            :aria-busy="enviando ? 'true' : 'false'"
          >
            {{ enviando ? 'Enviando…' : 'Fechar pedido' }}
          </button>
        </div>
      </form>

      <aside class="checkout__lateral">
        <SacolaResumo :bloqueada="enviando" />
      </aside>
    </div>
  </div>
</template>

<style scoped lang="less">
.checkout {
  &__topo {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: @espaco-3;
    margin-bottom: @espaco-5;

    h1 {
      margin: 0;
    }
  }

  &__colunas {
    display: grid;
    gap: @espaco-6;

    .acima-de(@bp-desktop, {
      grid-template-columns: minmax(0, 1fr) minmax(0, 22rem);
      align-items: start;
      gap: @espaco-7;
    });
  }

  &__formulario {
    max-width: 32rem;
  }

  &__lateral {
    .acima-de(@bp-desktop, {
      position: sticky;
      top: @espaco-4;
    });
  }

  &__grupo {
    margin: 0 0 @espaco-5;
    padding: 0;
    border: 0;

    legend {
      margin-bottom: @espaco-3;
      padding: 0;
      font-family: @fonte-titulo;
      font-size: @texto-medio;
    }
  }

  &__linha {
    display: flex;
    gap: @espaco-3;

    > * {
      flex: 1;
      min-width: 0;
    }

    > .checkout__estreito {
      flex: 0 0 34%;
    }
  }

  &__linha--cep {
    align-items: flex-start;

    > .checkout__buscar {
      flex: 0 0 auto;
      width: 3rem;
      margin-top: 1.55rem;
      padding: 0;
    }
  }

  &__aviso-cep {
    margin: -@espaco-2 0 @espaco-3;
  }

  &__girando {
    width: 1rem;
    height: 1rem;
    border: 2px solid fade(@cor-branco, 40%);
    border-top-color: @cor-branco;
    border-radius: 50%;
    animation: girar 0.8s linear infinite;
  }

  &__acoes {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: @espaco-4;
  }

  .alerta p {
    margin: 0;
  }
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}
</style>
<!-- Fim de CheckoutView.vue -->
