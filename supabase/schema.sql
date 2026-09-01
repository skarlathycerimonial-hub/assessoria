-- Skarlathy Assessoria & Eventos — schema
-- Pode rodar este arquivo inteiro de novo a qualquer momento (é seguro / idempotente),
-- inclusive depois de já ter rodado uma versão anterior.

create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  token text not null unique default encode(gen_random_bytes(16), 'hex'),
  noiva text,
  noivo text,
  email text,
  data_evento date,
  status text not null default 'rascunho' check (status in ('rascunho', 'em_preenchimento', 'completo')),
  responses jsonb not null default '{}'::jsonb,
  avatar1 jsonb,
  avatar2 jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.events add column if not exists avatar1 jsonb;
alter table public.events add column if not exists avatar2 jsonb;
-- casal antigo/já atendido fora do app: aparece em "Casais" mas não entra na fila de briefing pendente
alter table public.events add column if not exists tem_briefing_legado boolean not null default false;

alter table public.events enable row level security;

-- Equipe da Skarlathy (usuários autenticados no dashboard) tem acesso total.
drop policy if exists "staff full access" on public.events;
create policy "staff full access" on public.events
  for all
  to authenticated
  using (true)
  with check (true);

-- Ninguém acessa a tabela diretamente com a chave anônima (link público).
-- O acesso do link público passa só pelas funções abaixo, que verificam o token.

-- Postgres não deixa trocar o formato de retorno via CREATE OR REPLACE, então
-- apagamos antes de recriar (seguro rodar sempre, inclusive na primeira vez).
drop function if exists public.briefing_get(text);
drop function if exists public.briefing_create(text, text, text, date);

create or replace function public.briefing_create(
  p_noiva text,
  p_noivo text,
  p_email text default null,
  p_data_evento date default null,
  p_avatar1 jsonb default null,
  p_avatar2 jsonb default null
) returns table (id uuid, token text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_token text;
begin
  insert into public.events (noiva, noivo, email, data_evento, avatar1, avatar2)
  values (p_noiva, p_noivo, p_email, p_data_evento, p_avatar1, p_avatar2)
  returning events.id, events.token into v_id, v_token;

  return query select v_id, v_token;
end;
$$;

create or replace function public.briefing_get(p_token text)
returns table (
  noiva text,
  noivo text,
  email text,
  data_evento date,
  status text,
  responses jsonb,
  avatar1 jsonb,
  avatar2 jsonb
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    select e.noiva, e.noivo, e.email, e.data_evento, e.status, e.responses, e.avatar1, e.avatar2
    from public.events e
    where e.token = p_token;
end;
$$;

create or replace function public.briefing_save(
  p_token text,
  p_responses jsonb,
  p_noiva text default null,
  p_noivo text default null,
  p_email text default null,
  p_data_evento date default null,
  p_complete boolean default false
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.events
  set
    responses = p_responses,
    noiva = coalesce(p_noiva, noiva),
    noivo = coalesce(p_noivo, noivo),
    email = coalesce(p_email, email),
    data_evento = coalesce(p_data_evento, data_evento),
    status = case when p_complete then 'completo' else 'em_preenchimento' end,
    completed_at = case when p_complete then now() else completed_at end,
    updated_at = now()
  where token = p_token;
end;
$$;

revoke all on public.events from anon;
grant execute on function public.briefing_get(text) to anon;
grant execute on function public.briefing_save(text, jsonb, text, text, text, date, boolean) to anon;
-- briefing_create fica só para authenticated (a equipe cria o evento e gera o link no dashboard)
grant execute on function public.briefing_create(text, text, text, date, jsonb, jsonb) to authenticated;

-- Bucket de anexos que os noivos enviam pelo link público (fotos, vídeos de referência).
insert into storage.buckets (id, name, public)
values ('briefing-anexos', 'briefing-anexos', true)
on conflict (id) do nothing;

-- O link público só consegue enviar arquivo pra dentro de uma pasta cujo nome seja
-- um token de evento que realmente existe (mesma lógica de segurança do link em si).
drop policy if exists "briefing anexos upload publico" on storage.objects;
create policy "briefing anexos upload publico" on storage.objects
  for insert
  to anon
  with check (
    bucket_id = 'briefing-anexos'
    and exists (
      select 1 from public.events e where e.token = (storage.foldername(name))[1]
    )
  );

drop policy if exists "briefing anexos leitura publica" on storage.objects;
create policy "briefing anexos leitura publica" on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'briefing-anexos');

-- =========================================================
-- Chá de Lingerie
-- =========================================================
-- Um registro por noiva. edit_token = link privado dela (reabre e atualiza).
-- view_token = link só-leitura pras amigas. Os dois nunca se misturam.
-- convidadas e inspiracoes ficam em jsonb (arrays), igual o padrão de anexos
-- do briefing de casamento — evita tabelas extras pra uma lista pequena.

create table if not exists public.cha_lingerie (
  id uuid primary key default gen_random_uuid(),
  edit_token text not null unique default encode(gen_random_bytes(16), 'hex'),
  view_token text not null unique default encode(gen_random_bytes(16), 'hex'),
  noiva text,
  data_evento date,
  responses jsonb not null default '{}'::jsonb,
  convidadas jsonb not null default '[]'::jsonb,
  status text not null default 'rascunho' check (status in ('rascunho', 'em_preenchimento', 'completo')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.cha_lingerie enable row level security;

drop policy if exists "staff full access cha" on public.cha_lingerie;
create policy "staff full access cha" on public.cha_lingerie
  for all
  to authenticated
  using (true)
  with check (true);

drop function if exists public.cha_lingerie_get_edit(text);
drop function if exists public.cha_lingerie_get_view(text);
drop function if exists public.cha_lingerie_create(text, jsonb, jsonb, date);

-- Cria um rascunho vazio assim que a noiva abre o formulário (sem precisar de
-- nenhuma resposta ainda). Isso permite anexar fotos desde a primeira etapa,
-- porque o token já existe pra apontar os uploads.
create or replace function public.cha_lingerie_create()
returns table (id uuid, edit_token text, view_token text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_edit text;
  v_view text;
begin
  insert into public.cha_lingerie default values
  returning cha_lingerie.id, cha_lingerie.edit_token, cha_lingerie.view_token
  into v_id, v_edit, v_view;

  return query select v_id, v_edit, v_view;
end;
$$;

create or replace function public.cha_lingerie_get_edit(p_edit_token text)
returns table (
  noiva text,
  data_evento date,
  responses jsonb,
  convidadas jsonb,
  status text,
  view_token text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    select c.noiva, c.data_evento, c.responses, c.convidadas, c.status, c.view_token
    from public.cha_lingerie c
    where c.edit_token = p_edit_token;
end;
$$;

create or replace function public.cha_lingerie_get_view(p_view_token text)
returns table (
  noiva text,
  data_evento date,
  responses jsonb,
  convidadas jsonb
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    select c.noiva, c.data_evento, c.responses, c.convidadas
    from public.cha_lingerie c
    where c.view_token = p_view_token;
end;
$$;

create or replace function public.cha_lingerie_save(
  p_edit_token text,
  p_noiva text,
  p_responses jsonb,
  p_convidadas jsonb default null,
  p_data_evento date default null,
  p_complete boolean default false
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.cha_lingerie
  set
    noiva = coalesce(p_noiva, noiva),
    responses = p_responses,
    convidadas = coalesce(p_convidadas, convidadas),
    data_evento = coalesce(p_data_evento, data_evento),
    status = case when p_complete then 'completo' else 'em_preenchimento' end,
    completed_at = case when p_complete then now() else completed_at end,
    updated_at = now()
  where edit_token = p_edit_token;
end;
$$;

revoke all on public.cha_lingerie from anon;
grant execute on function public.cha_lingerie_create() to anon;
grant execute on function public.cha_lingerie_get_edit(text) to anon;
grant execute on function public.cha_lingerie_get_view(text) to anon;
grant execute on function public.cha_lingerie_save(text, text, jsonb, jsonb, date, boolean) to anon;

-- Bucket de inspirações visuais do Chá de Lingerie (mesmo padrão de segurança do
-- bucket briefing-anexos, mas usando o edit_token como pasta).
insert into storage.buckets (id, name, public)
values ('cha-lingerie-anexos', 'cha-lingerie-anexos', true)
on conflict (id) do nothing;

drop policy if exists "cha lingerie anexos upload publico" on storage.objects;
create policy "cha lingerie anexos upload publico" on storage.objects
  for insert
  to anon
  with check (
    bucket_id = 'cha-lingerie-anexos'
    and exists (
      select 1 from public.cha_lingerie c where c.edit_token = (storage.foldername(name))[1]
    )
  );

drop policy if exists "cha lingerie anexos leitura publica" on storage.objects;
create policy "cha lingerie anexos leitura publica" on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'cha-lingerie-anexos');
