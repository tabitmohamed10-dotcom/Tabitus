-- ================================================================
-- MARCHÉ LIBRE — Annonces directes (style Avito × TABIT)
-- Migration 002
-- ================================================================

CREATE TYPE listing_condition AS ENUM ('neuf', 'occasion', 'reconditionne');
CREATE TYPE listing_status AS ENUM ('active', 'sold', 'paused', 'expired');
CREATE TYPE listing_contact AS ENUM ('chat', 'phone', 'both');

CREATE TABLE marche_libre_listings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Content
  title           TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 120),
  description     TEXT CHECK (char_length(description) <= 2000),
  price           DECIMAL(12,2) NOT NULL CHECK (price >= 0),
  currency        TEXT NOT NULL DEFAULT 'MAD',

  -- Classification
  category_id     UUID REFERENCES categories(id),
  category_slug   TEXT,
  condition       listing_condition NOT NULL DEFAULT 'occasion',
  status          listing_status NOT NULL DEFAULT 'active',

  -- Location
  city            TEXT NOT NULL,
  region          TEXT,
  country         TEXT NOT NULL DEFAULT 'MA',
  lat             DECIMAL(10,8),
  lng             DECIMAL(11,8),

  -- Media
  images          TEXT[] DEFAULT '{}',
  thumbnail_url   TEXT,

  -- Contact
  contact_method  listing_contact DEFAULT 'chat',
  phone           TEXT,           -- only shared after agreement

  -- Engagement
  views_count     INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  contact_count   INTEGER DEFAULT 0,

  -- Negotiation
  price_negotiable BOOLEAN DEFAULT TRUE,
  best_offer      DECIMAL(12,2),

  -- Meta
  featured        BOOLEAN DEFAULT FALSE,
  verified_seller BOOLEAN DEFAULT FALSE,
  expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '60 days'),
  sold_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites / bookmarks
CREATE TABLE marche_libre_favorites (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id  UUID NOT NULL REFERENCES marche_libre_listings(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (listing_id, user_id)
);

-- Offers on a listing (counter-offer flow)
CREATE TABLE marche_libre_offers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id  UUID NOT NULL REFERENCES marche_libre_listings(id) ON DELETE CASCADE,
  buyer_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount      DECIMAL(12,2) NOT NULL,
  message     TEXT,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','withdrawn')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_listings_seller    ON marche_libre_listings(seller_id);
CREATE INDEX idx_listings_category  ON marche_libre_listings(category_slug);
CREATE INDEX idx_listings_city      ON marche_libre_listings(city);
CREATE INDEX idx_listings_status    ON marche_libre_listings(status);
CREATE INDEX idx_listings_price     ON marche_libre_listings(price);
CREATE INDEX idx_listings_created   ON marche_libre_listings(created_at DESC);
CREATE INDEX idx_listings_search    ON marche_libre_listings USING gin(to_tsvector('french', title || ' ' || COALESCE(description,'')));

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_listing_ts() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_listing_ts BEFORE UPDATE ON marche_libre_listings
  FOR EACH ROW EXECUTE FUNCTION update_listing_ts();

-- RLS
ALTER TABLE marche_libre_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marche_libre_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE marche_libre_offers    ENABLE ROW LEVEL SECURITY;

-- Public read active listings
CREATE POLICY "public_read_listings" ON marche_libre_listings
  FOR SELECT USING (status = 'active');

-- Sellers manage their own
CREATE POLICY "seller_manage" ON marche_libre_listings
  FOR ALL USING (auth.uid() = seller_id);

-- Authenticated users can create
CREATE POLICY "auth_insert" ON marche_libre_listings
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Favorites: own rows only
CREATE POLICY "fav_own" ON marche_libre_favorites
  FOR ALL USING (auth.uid() = user_id);

-- Offers: buyer owns + seller reads
CREATE POLICY "offer_buyer_own" ON marche_libre_offers
  FOR ALL USING (auth.uid() = buyer_id);
CREATE POLICY "offer_seller_read" ON marche_libre_offers
  FOR SELECT USING (
    auth.uid() = (SELECT seller_id FROM marche_libre_listings WHERE id = listing_id)
  );
