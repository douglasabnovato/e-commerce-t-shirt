<?php

/*
 * API Resource de Produto (Ex. 10 · CRUD de produtos).
 * Define o formato JSON devolvido pela API, isolando o frontend da
 * estrutura interna da tabela.
 */

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin \App\Models\Produto
 */
class ProdutoResource extends JsonResource
{
    /**
     * Transforma o produto em array. O preço segue como número e a imagem
     * como URL completa, pronta para uso direto no atributo src de <img>.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'descricao' => $this->descricao,
            'preco' => (float) $this->preco,
            'imagem_url' => $this->imagem ? Storage::disk('public')->url($this->imagem) : null,
            'criado_em' => $this->created_at?->toIso8601String(),
            'atualizado_em' => $this->updated_at?->toIso8601String(),
        ];
    }
}

/* Fim do API Resource ProdutoResource */
