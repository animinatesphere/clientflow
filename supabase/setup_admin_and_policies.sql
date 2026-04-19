-- -- Supabase setup: create an admin profile and recommended RLS policies
-- -- Instructions:
-- -- 1. Create an auth user in Supabase Auth (Sign up via the app or Auth > Users).
-- -- 2. Copy that user's `id` (a UUID) and replace the string below: 'REPLACE_WITH_AUTH_USER_UUID'.
-- -- 3. Run this script in Supabase -> SQL editor -> New query.

-- -- ======= Create admin profile (replace the id) =======
-- -- Insert admin profile by looking up the auth user by email (no manual UUID required)
-- WITH user_row AS (
--   SELECT id
--   FROM auth.users
--   WHERE email = 'admin@example.com'
--   LIMIT 1
-- )
-- INSERT INTO profiles (id, full_name, email, role, created_at, updated_at)
-- SELECT id, 'Admin User', 'admin@example.com', 'admin', now(), now()
-- FROM user_row
-- ON CONFLICT (id) DO UPDATE
--   SET full_name = EXCLUDED.full_name,
--       email = EXCLUDED.email,
--       role = EXCLUDED.role,
--       updated_at = now();

-- -- ======= Recommended RLS policies (paste-run as needed) =======
-- -- NOTE: Some policies may already exist (from earlier script). If you get "policy already exists" errors, skip that policy or remove the old one first.

-- -- Customers: allow authenticated SELECT, allow INSERT/UPDATE/DELETE only for admin
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- DROP POLICY IF EXISTS customers_select_authenticated ON customers;
-- CREATE POLICY customers_select_authenticated ON customers
--   FOR SELECT
--   USING ( auth.uid() IS NOT NULL );

-- DROP POLICY IF EXISTS customers_admin_modify ON customers;
-- CREATE POLICY customers_admin_modify ON customers
--   FOR ALL
--   USING ( EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin') )
--   WITH CHECK ( EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin') );

-- -- Orders: authenticated can select, only admin can insert/update/delete
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- DROP POLICY IF EXISTS orders_select_authenticated ON orders;
-- CREATE POLICY orders_select_authenticated ON orders
--   FOR SELECT
--   USING ( auth.uid() IS NOT NULL );

-- DROP POLICY IF EXISTS orders_admin_modify ON orders;
-- CREATE POLICY orders_admin_modify ON orders
--   FOR ALL
--   USING ( EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin') )
--   WITH CHECK ( EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin') );

-- -- Replies: allow authenticated select, admin modify
-- ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- DROP POLICY IF EXISTS replies_select_authenticated ON replies;
-- CREATE POLICY replies_select_authenticated ON replies
--   FOR SELECT
--   USING ( auth.uid() IS NOT NULL );

-- DROP POLICY IF EXISTS replies_admin_modify ON replies;
-- CREATE POLICY replies_admin_modify ON  replies
--   FOR ALL
--   USING ( EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin') )
--   WITH CHECK ( EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin') );

-- -- Broadcasts: allow authenticated select, admin modify
-- ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;

-- DROP POLICY IF EXISTS broadcasts_select_authenticated ON broadcasts;
-- CREATE POLICY broadcasts_select_authenticated ON broadcasts
--   FOR SELECT
--   USING ( auth.uid() IS NOT NULL );

-- DROP POLICY IF EXISTS broadcasts_admin_modify ON broadcasts;
-- CREATE POLICY broadcasts_admin_modify ON broadcasts
--   FOR ALL
--   USING ( EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin') )
--   WITH CHECK ( EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin') );

-- -- Optional: allow users to read/insert their own data depending on schema (not enabled by default)
-- -- Example: if orders had an owner_user_id column (uuid), you could allow the owner to insert/update:
-- -- CREATE POLICY orders_owner_modify ON orders
-- --   FOR ALL
-- --   USING ( owner_user_id = auth.uid() )
-- --   WITH CHECK ( owner_user_id = auth.uid() );

-- -- ======= End of setup script =======

-- -- ======= Create profiles trigger to populate profile on auth user signup =======
-- -- This ensures a profile row exists even before the client can write to `profiles`.
-- -- Run this in Supabase SQL editor once.

-- -- Enable RLS on profiles and create policies to allow users to manage their own profile
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- DROP POLICY IF EXISTS profiles_select_authenticated ON profiles;
-- CREATE POLICY profiles_select_authenticated ON profiles
--   FOR SELECT
--   USING ( auth.uid() IS NOT NULL );

-- DROP POLICY IF EXISTS profiles_insert_own ON profiles;
-- CREATE POLICY profiles_insert_own ON profiles
--   FOR INSERT
--   WITH CHECK ( auth.uid() = id OR current_user = 'server_functions' OR current_user = 'postgres' );

-- DROP POLICY IF EXISTS profiles_update_own ON profiles;
-- CREATE POLICY profiles_update_own ON profiles
--   FOR UPDATE
--   USING ( auth.uid() = id OR current_user = 'server_functions' OR current_user = 'postgres' )
--   WITH CHECK ( auth.uid() = id OR current_user = 'server_functions' OR current_user = 'postgres' );

-- -- Create function to insert a profile row when a new auth user is created
-- CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
-- RETURNS trigger AS $$
-- BEGIN
--   -- Try to insert a profile for the new user. Use COALESCE to fall back to email.
--   INSERT INTO public.profiles (id, full_name, email, role, created_at, updated_at)
--   VALUES (
--     NEW.id,
--     COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
--     NEW.email,
--     'user',
--     now(),
--     now()
--   )
--   ON CONFLICT (id) DO NOTHING;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- -- Attach trigger to auth.users so it runs after a new user is created
-- DROP TRIGGER IF EXISTS auth_user_created_on_insert ON auth.users;
-- CREATE TRIGGER auth_user_created_on_insert
-- AFTER INSERT ON auth.users
-- FOR EACH ROW
-- EXECUTE FUNCTION public.handle_new_auth_user();

-- -- Create a dedicated role for server-side functions (safer than using 'postgres')
-- DO $$ BEGIN
--   IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'server_functions') THEN
--     CREATE ROLE server_functions NOINHERIT;
--   END IF;
-- END$$;

-- -- Note: some hosted setups (like Supabase) prevent changing function owner to a custom role
-- -- from the SQL editor; the trigger was created SECURITY DEFINER and will run with the
-- -- owner that created it (the SQL editor's elevated role). We keep the `server_functions`
-- -- role creation above for completeness, but do not force ALTER OWNER here to avoid
-- -- "must be able to SET ROLE" errors.

