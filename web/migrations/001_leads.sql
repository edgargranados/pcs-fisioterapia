create table if not exists leads (
  id bigserial primary key,
  name text not null,
  phone text not null,
  email text,
  locale text not null,
  page text,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);
