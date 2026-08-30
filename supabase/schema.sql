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
