create table if not exists public.registrations (
    id uuid primary key default gen_random_uuid(),
    registration_number text not null unique default (
        'BM26-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16))
    ),
    name text not null,
    nisn text not null,
    birth_date date not null,
    phone text not null,
    parent_name text not null,
    parent_phone text not null,
    major text not null,
    status text not null default 'Menunggu verifikasi'
        check (status in ('Menunggu verifikasi', 'Diterima', 'Revisi berkas')),
    kk_path text,
    ijazah_path text,
    photo_path text,
    created_at timestamptz not null default now()
);

alter table public.registrations enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'registration-documents',
    'registration-documents',
    false,
    2097152,
    array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;