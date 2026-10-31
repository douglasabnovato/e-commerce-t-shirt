<?php

/*
 * Seeder principal: cria os produtos de exemplo e, se SEED_ADMIN_PASSWORD
 * estiver definida, o usuário de demonstração para testar o CRUD do Ex. 10.
 * A senha fica fora do repositório porque a conta altera dados em produção.
 */

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Popula o banco. Usa updateOrCreate para poder ser executado mais de
     * uma vez sem duplicar o usuário.
     */
    public function run(): void
    {
        $senha = env('SEED_ADMIN_PASSWORD');

        if ($senha) {
            User::updateOrCreate(
                ['email' => 'avaliador@tshirt.test'],
                [
                    'name' => 'Avaliador',
                    'password' => $senha,
                ]
            );
        }

        $this->call(ProdutoSeeder::class);
    }
}

/* Fim do DatabaseSeeder */
