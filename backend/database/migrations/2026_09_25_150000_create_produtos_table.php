<?php

/*
 * Migration da tabela de produtos (Ex. 10 · CRUD de produtos).
 * Campos exigidos pelo enunciado: nome, descrição, preço e imagem.
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Cria a tabela de produtos. O preço usa decimal(10,2) para evitar erros
     * de arredondamento com valores monetários, e a imagem guarda apenas o
     * caminho relativo do arquivo no disco "public".
     */
    public function up(): void
    {
        Schema::create('produtos', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 120);
            $table->text('descricao');
            $table->decimal('preco', 10, 2);
            $table->string('imagem')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Remove a tabela de produtos.
     */
    public function down(): void
    {
        Schema::dropIfExists('produtos');
    }
};

/* Fim da migration create_produtos_table */
