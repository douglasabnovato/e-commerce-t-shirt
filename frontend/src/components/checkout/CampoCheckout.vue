<!--
  Campo de formulário do checkout: rótulo ligado ao input, máscara
  aplicada durante a digitação e mensagem de erro associada ao campo
  (aria-invalid + aria-describedby) para leitores de tela.
-->
<script setup>
const props = defineProps({
  id: { type: String, required: true },
  rotulo: { type: String, required: true },
  modelValue: { type: String, default: '' },
  erro: { type: String, default: '' },
  tipo: { type: String, default: 'text' },
  autocomplete: { type: String, default: 'off' },
  inputmode: { type: String, default: undefined },
  placeholder: { type: String, default: undefined },
  maxlength: { type: [Number, String], default: undefined },
  mascara: { type: Function, default: null },
  ocupado: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'blur'])

/**
 * Aplica a máscara (se houver) e emite o novo valor. O valor mascarado é
 * reescrito no próprio input para o cursor não "pular" caracteres.
 */
function aoDigitar(evento) {
  const valor = props.mascara ? props.mascara(evento.target.value) : evento.target.value
  if (evento.target.value !== valor) {
    evento.target.value = valor
  }
  emit('update:modelValue', valor)
}
</script>

<template>
  <div class="campo">
    <label class="campo__rotulo" :for="id">{{ rotulo }}</label>
    <input
      :id="id"
      class="campo__entrada"
      :type="tipo"
      :value="modelValue"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :placeholder="placeholder"
      :maxlength="maxlength"
      required
      aria-required="true"
      :aria-invalid="erro ? 'true' : 'false'"
      :aria-describedby="erro ? `${id}-erro` : undefined"
      :aria-busy="ocupado ? 'true' : undefined"
      @input="aoDigitar"
      @blur="emit('blur')"
    />
    <p v-if="erro" :id="`${id}-erro`" class="campo__erro">{{ erro }}</p>
  </div>
</template>
<!-- Fim de CampoCheckout.vue -->
