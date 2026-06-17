insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-proofs',
  'payment-proofs',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can upload own payment proofs" on storage.objects;
create policy "Users can upload own payment proofs"
on storage.objects for insert
with check (bucket_id = 'payment-proofs' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users can read own payment proofs" on storage.objects;
create policy "Users can read own payment proofs"
on storage.objects for select
using (bucket_id = 'payment-proofs' and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin()));

drop policy if exists "Admins can manage payment proofs" on storage.objects;
create policy "Admins can manage payment proofs"
on storage.objects for all
using (bucket_id = 'payment-proofs' and public.is_admin())
with check (bucket_id = 'payment-proofs' and public.is_admin());
