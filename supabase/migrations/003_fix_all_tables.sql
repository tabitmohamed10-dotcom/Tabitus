-- ================================================================
-- TABITUS — Migration 003 : Fix & extend all tables
-- ================================================================

-- ── marche_libre_listings ────────────────────────────────────────
-- Add columns that may be missing depending on how the table was created
ALTER TABLE marche_libre_listings ADD COLUMN IF NOT EXISTS category_slug text;
ALTER TABLE marche_libre_listings ADD COLUMN IF NOT EXISTS neighborhood text;
ALTER TABLE marche_libre_listings ADD COLUMN IF NOT EXISTS is_negotiable boolean DEFAULT false;
ALTER TABLE marche_libre_listings ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE marche_libre_listings ADD COLUMN IF NOT EXISTS contact_method text DEFAULT 'chat';
ALTER TABLE marche_libre_listings ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE marche_libre_listings ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;

-- ── requests ────────────────────────────────────────────────────
ALTER TABLE requests ADD COLUMN IF NOT EXISTS payment_methods text[];
ALTER TABLE requests ADD COLUMN IF NOT EXISTS is_urgent boolean DEFAULT false;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS deadline date;

-- ── offers ──────────────────────────────────────────────────────
ALTER TABLE offers ADD COLUMN IF NOT EXISTS guarantee text;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS payment_methods text[];
ALTER TABLE offers ADD COLUMN IF NOT EXISTS message text;

-- ── profiles ────────────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;

-- ── Fix RLS: allow authenticated users to insert marche_libre_listings ──
-- Drop conflicting policy if it checks seller_id (old schema) and recreate for user_id
DO $$
BEGIN
  -- Allow insert with user_id FK
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'marche_libre_listings'
      AND policyname = 'auth_insert_user_id'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "auth_insert_user_id" ON marche_libre_listings
        FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)
    $policy$;
  END IF;
END $$;
