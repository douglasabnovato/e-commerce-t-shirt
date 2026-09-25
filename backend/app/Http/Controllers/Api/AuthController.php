<?php

/*
 * Controller de autenticação (Ex. 10 e Ex. 2 · Sanctum em modo SPA).
 * O login cria uma sessão no servidor, identificada por um cookie HttpOnly;
 * o JavaScript do frontend nunca tem acesso à credencial. A proteção contra
 * CSRF vem do cookie XSRF-TOKEN emitido em GET /sanctum/csrf-cookie.
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * POST /api/login · Valida as credenciais, inicia a sessão e regenera o
     * id da sessão (prevenção de session fixation). Só funciona em
     * requisições vindas de um domínio listado em SANCTUM_STATEFUL_DOMAINS,
     * que são as que recebem sessão.
     */
    public function login(Request $request): JsonResponse
    {
        if (! $request->hasSession()) {
            return response()->json([
                'message' => 'O login só pode ser feito pela aplicação web.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $credenciais = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'Informe o e-mail.',
            'email.email' => 'Informe um e-mail válido.',
            'password.required' => 'Informe a senha.',
        ]);

        if (! Auth::guard('web')->attempt($credenciais)) {
            throw ValidationException::withMessages([
                'email' => 'E-mail ou senha inválidos.',
            ]);
        }

        $request->session()->regenerate();

        return response()->json([
            'usuario' => $this->dadosDoUsuario(Auth::guard('web')->user()),
        ]);
    }

    /**
     * GET /api/user · Retorna o usuário da sessão atual. O frontend usa
     * esta rota para saber se o visitante está logado.
     */
    public function usuario(Request $request): JsonResponse
    {
        return response()->json([
            'usuario' => $this->dadosDoUsuario($request->user()),
        ]);
    }

    /**
     * POST /api/logout · Encerra a sessão, invalida o id da sessão e gera
     * um novo token CSRF.
     */
    public function logout(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }

    /**
     * Expõe apenas os dados públicos do usuário.
     *
     * @return array<string, mixed>
     */
    private function dadosDoUsuario(User $usuario): array
    {
        return [
            'id' => $usuario->id,
            'nome' => $usuario->name,
            'email' => $usuario->email,
        ];
    }
}

/* Fim do controller AuthController */
