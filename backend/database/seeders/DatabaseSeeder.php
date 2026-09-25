<?php

/*
 * Seeder principal: cria o usuário de demonstração (para o avaliador testar
 * o CRUD do Ex. 10) e os produtos de exemplo.
 * Credenciais de demonstração documentadas no README:
 * e-mail avaliador@tshirt.test · senha Avaliador@2026
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
        User::updateOrCreate(
            ['email' => 'avaliador@tshirt.test'],
            [
                'name' => 'Avaliador',
                'password' => 'Avaliador@2026',
            ]
        );

        $this->call(ProdutoSeeder::class);
    }
}

/* Fim do DatabaseSeeder */
