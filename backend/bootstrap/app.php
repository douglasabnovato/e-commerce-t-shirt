<?php

/*
 * Configuração da aplicação (Laravel 12).
 * - statefulApi(): ativa o Sanctum em modo SPA, dando sessão e proteção
 *   CSRF às requisições vindas dos domínios de SANCTUM_STATEFUL_DOMAINS.
 * - trustProxies('*'): em produção o HTTPS termina no proxy da hospedagem;
 *   confiar nos cabeçalhos X-Forwarded-* faz o Laravel reconhecer o HTTPS
 *   (links https:// e cookie de sessão seguro).
 * - Erros em rotas /api/* sempre respondem em JSON, com mensagens em
 *   português para 401 e 404.
 */

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
        $middleware->trustProxies(at: '*');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson()
        );

        $exceptions->render(function (AuthenticationException $erro, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Não autenticado.'], 401);
            }
        });

        $exceptions->render(function (NotFoundHttpException $erro, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Recurso não encontrado.'], 404);
            }
        });
    })->create();

/* Fim de bootstrap/app.php */
