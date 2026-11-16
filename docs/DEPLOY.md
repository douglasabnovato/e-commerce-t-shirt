# Publicação no alwaysdata

Passo a passo da publicação do E-commerce T-Shirt. Escrito em 16/11/2026.

- **Onde:** alwaysdata, plano Free (decisão D20 de [`DECISOES.md`](DECISOES.md)). Um site PHP com raiz em `backend/public`, MySQL gerenciado e HTTPS em `https://douglasabnovato.alwaysdata.net`.
- **Quem faz:** tudo o que pede o painel do alwaysdata, SSH ou as Settings do GitHub é do responsável. Os agentes só escrevem o código e este guia.
- **Segredos:** nenhum valor aparece aqui. O `.env` de produção e a `APP_KEY` existem só no servidor.

## Estado em 16/11/2026

| O quê | Situação | Como conferir |
|---|---|---|
| Site no ar | Responde, com a versão de 06/11/2026 | `curl -s -o /dev/null -w "%{http_code}" https://douglasabnovato.alwaysdata.net/` → 200 |
| Versão da `main` no ar | Ainda não | `curl -s -o /dev/null -w "%{http_code}" https://douglasabnovato.alwaysdata.net/api/saude` → 404 (a rota é nova; depois da publicação, 200) |
| Publicação pelo CI | Escrita, desligada | `publicar.yml` fica pulado até existir a Variable `PUBLICAR_ALWAYSDATA` = `sim` (#16) |
| Imagens antigas em WebP | Falta | Comando `produtos:reduzir-imagens`, uma vez (#28) |

## 1. Primeira publicação (já feita; para refazer do zero)

Os nomes de menu do painel podem mudar; confira na tela.

1. No painel do alwaysdata, área de bancos MySQL: crie o banco e um usuário só dele, com senha só de letras e números.
2. No painel: PHP 8.4 e acesso SSH ativados para o usuário.
3. Pelo SSH, na pasta inicial: `git clone -b main https://github.com/douglasabnovato/e-commerce-t-shirt.git`.
4. Pelo SSH, em `e-commerce-t-shirt/backend`: copie `.env.example` para `.env` e preencha no próprio servidor `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://douglasabnovato.alwaysdata.net`, `SESSION_SECURE_COOKIE=true`, `SANCTUM_STATEFUL_DOMAINS=douglasabnovato.alwaysdata.net` e os dados do banco do passo 1.
5. Ainda em `backend`: `composer install --no-dev --optimize-autoloader`, `php artisan key:generate`, `php artisan migrate --seed --force`, `php artisan storage:link` e `php artisan optimize`.
6. No computador local: `cd frontend && npm ci && npm run build`, depois `scp -r backend/public/spa/* <usuario>@<host-ssh>:~/e-commerce-t-shirt/backend/public/spa/`. O plano Free não tem memória para o `npm ci` no servidor.
7. No painel, área de sites: novo site do tipo **PHP**, com raiz `e-commerce-t-shirt/backend/public/` e HTTPS forçado.

## 2. Atualização manual (hoje, depois de cada merge na `main`)

Igual à seção "Atualização" do README:

```bash
# computador local, na raiz do projeto, com a main atualizada
cd frontend && npm ci && npm run build && cd ..
scp -r backend/public/spa/* <usuario>@<host-ssh>:~/e-commerce-t-shirt/backend/public/spa/

# servidor, via SSH
cd ~/e-commerce-t-shirt && git checkout main && git pull --ff-only origin main
cd backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize
```

**Uma vez, na próxima publicação (#28):** `php artisan produtos:reduzir-imagens` em `backend/`, para converter as imagens já enviadas em WebP de até 600 px. Os originais ficam; `--apagar-originais` os remove.

## 3. Publicação pelo CI (#16)

O workflow [`.github/workflows/publicar.yml`](../.github/workflows/publicar.yml) roda depois do workflow `CI` terminar verde num push na `main`, e só se a Variable `PUBLICAR_ALWAYSDATA` for `sim`. Ele faz o build, envia `backend/public/spa` por `scp`, roda no servidor os comandos da seção 2 e confere `/api/saude` e `/`.

Para ligar (responsável, uma vez):

1. No computador local, gere uma chave só para o deploy: `ssh-keygen -t ed25519 -f ~/.ssh/alwaysdata_deploy -N "" -C deploy-e-commerce`.
2. Ponha a chave pública no servidor: pelo SSH, acrescente o conteúdo de `~/.ssh/alwaysdata_deploy.pub` ao fim de `~/.ssh/authorized_keys`.
3. Gere a linha de confiança do servidor: `ssh-keyscan <host-ssh>` (o mesmo host do deploy manual).
4. GitHub → repositório → **Settings → Secrets and variables → Actions → New repository secret**, quatro vezes:
   - `ALWAYSDATA_SSH_HOST`: o host SSH;
   - `ALWAYSDATA_SSH_USER`: o usuário SSH;
   - `ALWAYSDATA_SSH_KEY`: o conteúdo de `~/.ssh/alwaysdata_deploy` (a chave privada);
   - `ALWAYSDATA_KNOWN_HOSTS`: a saída do passo 3.
5. Na mesma tela, aba **Variables → New repository variable**: `PUBLICAR_ALWAYSDATA` = `sim`.
6. No próximo merge na `main`, abra **Actions → Publicar no alwaysdata** e confira o run verde. Depois: `curl https://douglasabnovato.alwaysdata.net/api/saude` deve responder `{"ok":true,"banco":"ok",...}`.

Para desligar: apague a Variable ou mude o valor. O job volta a ser pulado, e nada no servidor muda.

## 4. Conferir depois de publicar

- `curl -s -o /dev/null -w "%{http_code}" https://douglasabnovato.alwaysdata.net/api/saude` → 200.
- O HTML de `/` traz um `/spa/assets/index-*.js` igual ao do `npm run build` local da mesma `main`.
- Lighthouse móvel no site, 3 execuções, com mediana, TBT e elemento do LCP, registrados no critério 7 de [`MVP.md`](MVP.md) (#24).

## O que não muda sem o responsável

Conta e plano do alwaysdata (só plano gratuito), domínio, `.env` de produção, segredos e Variables do GitHub, e a conta de demonstração pública (risco aceito, D23).
