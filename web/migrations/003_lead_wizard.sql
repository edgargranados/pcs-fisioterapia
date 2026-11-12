alter table leads add column if not exists preference text;
alter table leads add column if not exists status text not null default 'complete';
alter table leads add column if not exists resume_token text;
alter table leads alter column name drop not null;
alter table leads alter column phone drop not null;
