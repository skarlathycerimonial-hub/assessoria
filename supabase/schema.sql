-- Skarlathy Assessoria & Eventos — schema inicial
-- Rode este arquivo no SQL Editor do seu projeto Supabase.

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
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.events enable row level security;

-- Equipe da Skarlathy (usuários autenticados no dashboard) tem acesso total.
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
  p_data_evento date default null
) returns table (id uuid, token text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_token text;
begin
  insert into public.events (noiva, noivo, email, data_evento)
  values (p_noiva, p_noivo, p_email, p_data_evento)
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
  responses jsonb
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    select e.noiva, e.noivo, e.email, e.data_evento, e.status, e.responses
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
grant execute on function public.briefing_create(text, text, text, date) to authenticated;
