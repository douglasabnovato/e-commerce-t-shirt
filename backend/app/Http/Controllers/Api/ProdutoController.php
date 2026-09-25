<?php

/*
 * Controller REST de produtos (Ex. 10 · CRUD de produtos).
 * Uma ação por operação: listar, exibir, criar, atualizar e excluir.
 * Listar e exibir são públicas; criar, atualizar e excluir exigem login
 * (middleware auth:sanctum definido em routes/api.php).
 * As imagens ficam no disco "public" via Storage, o que permite trocar o
 * disco local por S3/R2 apenas por configuração.
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProdutoRequest;
use App\Http\Resources\ProdutoResource;
use App\Models\Produto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ProdutoController extends Controller
{
    private const DISCO = 'public';

    private const PASTA = 'produtos';

    /**
     * GET /api/produtos · Lista os produtos do mais recente para o mais
     * antigo, paginados. Aceita ?por_pagina=N (de 1 a 50, padrão 12) e
     * ?busca=termo (filtra pelo nome; usado pelas categorias do menu).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $porPagina = min(max($request->integer('por_pagina', 12), 1), 50);
        $busca = trim((string) $request->query('busca', ''));

        $produtos = Produto::query()
            ->when($busca !== '', fn ($consulta) => $consulta->where('nome', 'like', '%'.$busca.'%'))
            ->latest('id')
            ->paginate($porPagina)
            ->withQueryString();

        return ProdutoResource::collection($produtos);
    }

    /**
     * GET /api/produtos/{produto} · Exibe um produto. Se o id não existir,
     * a API responde 404.
     */
    public function show(Produto $produto): ProdutoResource
    {
        return new ProdutoResource($produto);
    }

    /**
     * POST /api/produtos · Cria um produto com imagem. Se a gravação no
     * banco falhar, a imagem recém-enviada é apagada para não deixar
     * arquivo órfão no disco.
     */
    public function store(ProdutoRequest $request): JsonResponse
    {
        $dados = $request->safe()->except('imagem');
        $dados['imagem'] = $request->file('imagem')->store(self::PASTA, self::DISCO);

        try {
            $produto = Produto::create($dados);
        } catch (Throwable $erro) {
            $this->removerImagem($dados['imagem']);
            throw $erro;
        }

        return (new ProdutoResource($produto))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * PUT /api/produtos/{produto} · Atualiza um produto. Com envio de
     * arquivo (multipart), o frontend usa POST com _method=PUT. Se vier
     * imagem nova, a antiga só é apagada depois que o banco foi atualizado.
     */
    public function update(ProdutoRequest $request, Produto $produto): ProdutoResource
    {
        $dados = $request->safe()->except('imagem');
        $imagemAntiga = $produto->imagem;
        $imagemNova = null;

        if ($request->hasFile('imagem')) {
            $imagemNova = $request->file('imagem')->store(self::PASTA, self::DISCO);
            $dados['imagem'] = $imagemNova;
        }

        try {
            $produto->update($dados);
        } catch (Throwable $erro) {
            $this->removerImagem($imagemNova);
            throw $erro;
        }

        if ($imagemNova !== null) {
            $this->removerImagem($imagemAntiga);
        }

        return new ProdutoResource($produto);
    }

    /**
     * DELETE /api/produtos/{produto} · Exclui o produto e, em seguida,
     * a imagem dele. Responde 204 (sem conteúdo).
     */
    public function destroy(Produto $produto): Response
    {
        $imagem = $produto->imagem;

        $produto->delete();
        $this->removerImagem($imagem);

        return response()->noContent();
    }

    /**
     * Apaga um arquivo de imagem do disco, se o caminho existir.
     */
    private function removerImagem(?string $caminho): void
    {
        if ($caminho !== null && Storage::disk(self::DISCO)->exists($caminho)) {
            Storage::disk(self::DISCO)->delete($caminho);
        }
    }
}

/* Fim do controller ProdutoController */
