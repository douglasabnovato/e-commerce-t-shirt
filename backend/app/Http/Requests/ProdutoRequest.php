<?php

/*
 * Form Request de Produto (Ex. 10 · CRUD de produtos).
 * Centraliza as regras de validação de criação e atualização e as mensagens
 * em português. Quando a validação falha, o Laravel responde 422 com os erros
 * por campo, que o frontend exibe ao lado de cada input.
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProdutoRequest extends FormRequest
{
    /**
     * Libera a requisição. A restrição de acesso (somente usuários
     * autenticados podem modificar produtos) é feita pelo middleware
     * auth:sanctum nas rotas, e não aqui.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normaliza o preço antes da validação, aceitando vírgula como separador
     * decimal (ex.: "79,90" vira "79.90").
     */
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('preco'))) {
            $this->merge([
                'preco' => str_replace(',', '.', $this->input('preco')),
            ]);
        }
    }

    /**
     * Regras de validação. Na criação a imagem é obrigatória; na atualização
     * ela é opcional e, se não for enviada, a imagem atual é mantida.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $criando = $this->route('produto') === null;

        return [
            'nome' => ['required', 'string', 'min:3', 'max:120'],
            'descricao' => ['required', 'string', 'min:10', 'max:2000'],
            'preco' => ['required', 'numeric', 'min:0.01', 'max:99999999.99', 'decimal:0,2'],
            'imagem' => [
                $criando ? 'required' : 'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ];
    }

    /**
     * Mensagens de erro em português para cada regra.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'required' => 'O campo :attribute é obrigatório.',
            'string' => 'O campo :attribute deve ser um texto.',
            'nome.min' => 'O nome deve ter pelo menos :min caracteres.',
            'nome.max' => 'O nome deve ter no máximo :max caracteres.',
            'descricao.min' => 'A descrição deve ter pelo menos :min caracteres.',
            'descricao.max' => 'A descrição deve ter no máximo :max caracteres.',
            'preco.numeric' => 'O preço deve ser um número.',
            'preco.min' => 'O preço deve ser maior que zero.',
            'preco.max' => 'O preço informado é maior que o permitido.',
            'preco.decimal' => 'O preço deve ter no máximo duas casas decimais.',
            'imagem.image' => 'O arquivo enviado deve ser uma imagem.',
            'imagem.mimes' => 'A imagem deve estar em JPG, PNG ou WEBP.',
            'imagem.max' => 'A imagem deve ter no máximo 2 MB.',
        ];
    }

    /**
     * Nomes amigáveis dos campos usados nas mensagens.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'nome' => 'nome',
            'descricao' => 'descrição',
            'preco' => 'preço',
            'imagem' => 'imagem',
        ];
    }
}

/* Fim do Form Request ProdutoRequest */
