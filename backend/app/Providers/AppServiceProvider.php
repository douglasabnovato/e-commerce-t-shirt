<?php

/*
 * Provider principal da aplicação.
 * - Limita as tentativas de login (proteção contra força bruta).
 * - Bloqueia lazy loading fora de produção, para que um problema de N+1
 *   apareça como erro durante o desenvolvimento (ver resposta do Ex. 6).
 */

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Registra serviços da aplicação (nenhum serviço próprio por enquanto).
     */
    public function register(): void
    {
    }

    /**
     * Configura o limite de tentativas de login e a proteção contra
     * lazy loading.
     */
    public function boot(): void
    {
        Model::preventLazyLoading(! $this->app->isProduction());

        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)
                ->by(mb_strtolower((string) $request->input('email')).'|'.$request->ip())
                ->response(fn () => response()->json([
                    'message' => 'Muitas tentativas de login. Aguarde um minuto e tente novamente.',
                ], 429));
        });
    }
}

/* Fim do AppServiceProvider */
