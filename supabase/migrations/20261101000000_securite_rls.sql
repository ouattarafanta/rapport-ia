-- ReportFlow : sécurité de la base
--
-- Avant : le RLS était désactivé, donc n'importe qui avec la clé publique
-- (visible dans le navigateur) pouvait lire et modifier toutes les tables.
--
-- Après :
--   - le code serveur (clé service_role) continue de tout faire ;
--   - avec la clé publique, un utilisateur connecté peut seulement
--     lire son entreprise et lire/modifier son propre profil.

-- 1. Activer le RLS sur toutes les tables
alter table public.organizations enable row level security;
alter table public.profiles      enable row level security;
alter table public.services      enable row level security;
alter table public.tasks         enable row level security;
alter table public.reports       enable row level security;

-- 2. Supprimer d'éventuelles anciennes règles
drop policy if exists "lire mon entreprise" on public.organizations;
drop policy if exists "lire mon profil" on public.profiles;
drop policy if exists "modifier mon profil" on public.profiles;

-- 3. Règles minimales utilisées par l'application
create policy "lire mon entreprise"
  on public.organizations for select
  to authenticated
  using (user_id = auth.uid());

create policy "lire mon profil"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "modifier mon profil"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- 4. Le slug sert à créer les identifiants (fanta@trabad) : il doit être unique
create unique index if not exists organizations_slug_key
  on public.organizations (slug);

-- 5. Historique des rapports : un rapport individuel ou de direction
--    n'est pas forcément lié à un service
alter table public.reports alter column work_spaces_id drop not null;
