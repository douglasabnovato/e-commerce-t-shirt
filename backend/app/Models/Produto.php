<?php

/*
 * Model Produto (Ex. 10 · CRUD de produtos).
 * Representa um item do catálogo com nome, descrição, preço e imagem.
 */

namespace App\Models;

use Database\Factories\ProdutoFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    /** @use HasFactory<ProdutoFactory> */
    use HasFactory;

    protected $table = 'produtos';

    protected $fillable = [
        'nome',
        'descricao',
        'preco',
        'imagem',
    ];

    /**
     * Converte o preço para decimal com duas casas ao ler do banco.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'preco' => 'decimal:2',
        ];
    }
}

/* Fim do model Produto */
