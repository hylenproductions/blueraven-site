-- Applied to project lsnwtodjzoxuwkvrdxtg (blueraven-site) on 2026-06-11
-- via the Supabase MCP. Kept here as the source of record.

-- Ideas: curated by owner via dashboard/service role only.
create table public.ideas (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  status      text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  vote_count  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Votes: anonymous "seconds". voter_token is a client-generated UUID.
-- Composite PK makes upvotes idempotent per visitor token.
create table public.votes (
  idea_id     uuid not null references public.ideas(id) on delete cascade,
  voter_token uuid not null,
  created_at  timestamptz not null default now(),
  primary key (idea_id, voter_token)
);

-- Maintain ideas.vote_count. SECURITY DEFINER so the anon role's insert can
-- bump the counter despite anon having no UPDATE privilege on ideas.
create or replace function public.bump_vote_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.ideas set vote_count = vote_count + 1 where id = new.idea_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.ideas set vote_count = greatest(vote_count - 1, 0) where id = old.idea_id;
    return old;
  end if;
  return null;
end;
$$;

create trigger votes_bump_count
after insert or delete on public.votes
for each row execute function public.bump_vote_count();

-- Trigger execution does not require the caller to hold EXECUTE on the
-- trigger function, so revoke direct RPC access entirely.
revoke execute on function public.bump_vote_count() from public, anon, authenticated;

-- Row Level Security
alter table public.ideas enable row level security;
alter table public.votes enable row level security;

-- Visitors see only published ideas.
create policy "Public can read published ideas"
  on public.ideas
  for select
  to anon, authenticated
  using (status = 'published');

-- Visitors can vote, but only on published ideas. No select/update/delete
-- policies on votes: vote rows (and voter tokens) are service-role-only.
create policy "Public can vote on published ideas"
  on public.votes
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.ideas i
      where i.id = idea_id and i.status = 'published'
    )
  );

-- Least-privilege grants (Supabase default-grants ALL on new public tables;
-- RLS gates it, but tighten anyway).
revoke all on table public.ideas from anon, authenticated;
revoke all on table public.votes from anon, authenticated;
grant select on table public.ideas to anon, authenticated;
grant insert (idea_id, voter_token) on table public.votes to anon, authenticated;
