# Skarlathy Assessoria & Eventos — Painel

Painel de gestão de casais para a Skarlathy Assessoria & Eventos. Os noivos preenchem o
briefing inicial por um link público (sem login); ao concluir, o evento já cai pronto e
organizado no painel da equipe.

Stack: Next.js 14 (App Router) + Supabase (Postgres, Auth) + Vercel.

## Como rodar localmente

```bash
npm install
cp .env.local.example .env.local
# preencha .env.local com as chaves do seu projeto Supabase
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Configurando o Supabase (uma vez só)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Vá em **SQL Editor** e rode o conteúdo de [`supabase/schema.sql`](./supabase/schema.sql).
   Isso cria a tabela `events` e as funções que dão acesso seguro ao link público dos noivos
   (eles nunca acessam a tabela diretamente — só chamam funções que exigem o token do link).
3. Vá em **Authentication → Users** e crie um usuário (e-mail + senha) para cada pessoa da
   equipe que vai acessar o painel (Skarlathy, você, etc). Não existe cadastro público — só
   quem a equipe criar manualmente entra no `/login`.
4. Vá em **Project Settings → API** e copie a **Project URL** e a **anon/publishable key**
   para o `.env.local` (e depois para as variáveis de ambiente da Vercel).

## Como funciona

- `/dashboard` — lista de casais (precisa login).
- `/dashboard/novo` — cria um casal e gera o link público do briefing.
- `/dashboard/[id]` — resumo organizado das respostas de um casal.
- `/briefing/[token]` — formulário público que os noivos preenchem, em etapas, sem login.
  O progresso salva sozinho a cada resposta, então dá pra fechar e continuar depois pelo
  mesmo link.

O briefing foi condensado a partir do formulário original (Google Forms, ~100 perguntas)
em blocos por etapa, com seleção por chips/botões no lugar de texto livre sempre que possível,
pra ficar mais rápido e menos cansativo para os noivos. Os campos ficam em
[`src/lib/briefing/schema.ts`](./src/lib/briefing/schema.ts) — dá pra ajustar perguntas,
opções e etapas editando só esse arquivo.

## Deploy

1. Suba este repositório no GitHub.
2. Importe o repositório na [Vercel](https://vercel.com/new).
3. Configure as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` no projeto da Vercel.
4. Deploy. Cada push na branch `main` publica automaticamente.
