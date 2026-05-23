-- ================================================================
-- TABITUS — Migration complète v1.0
-- Supabase/PostgreSQL
-- ================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ================================================================
-- ENUMS
-- ================================================================

CREATE TYPE user_role AS ENUM ('buyer', 'merchant', 'admin');
CREATE TYPE request_status AS ENUM ('open','in_review','accepted','completed','cancelled');
CREATE TYPE offer_status AS ENUM ('pending','accepted','rejected','expired','withdrawn');
CREATE TYPE notif_type AS ENUM (
  'offer_received','offer_accepted','offer_rejected',
  'request_matched','new_message','system','payment'
);
CREATE TYPE merchant_tier AS ENUM ('free','starter','pro','enterprise');

-- ================================================================
-- PROFILES
-- ================================================================

CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  avatar_url    TEXT,
  phone         TEXT,
  role          user_role NOT NULL DEFAULT 'buyer',
  city          TEXT,
  country       TEXT NOT NULL DEFAULT 'MA',
  locale        TEXT NOT NULL DEFAULT 'fr',
  push_token    TEXT,
  onboarded     BOOLEAN DEFAULT FALSE,
  active        BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- CATEGORIES — Hiérarchique, couvre tous les secteurs
-- ================================================================

CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  name_ar     TEXT,
  name_en     TEXT,
  slug        TEXT UNIQUE NOT NULL,
  icon        TEXT NOT NULL DEFAULT '📦',
  color       TEXT DEFAULT '#f97316',
  description TEXT,
  parent_id   UUID REFERENCES categories(id),
  sort_order  INTEGER DEFAULT 0,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- CATEGORIES SEED — Tous les secteurs
-- ================================================================

INSERT INTO categories (name, slug, icon, color, description, sort_order) VALUES
-- Commerce quotidien
('Alimentation & Épicerie',    'alimentation',    '🛒', '#22c55e', 'Épicerie, supermarché, alimentation générale', 1),
('Boulangerie & Pâtisserie',   'boulangerie',     '🥖', '#f59e0b', 'Pain, gâteaux, viennoiseries', 2),
('Boissons',                    'boissons',        '🥤', '#06b6d4', 'Eau, jus, sodas, cafés, thé', 3),
('Bio & Naturel',               'bio',             '🌿', '#16a34a', 'Produits bio, naturels, santé', 4),
('Halal & Casher',              'halal',           '🕌', '#7c3aed', 'Viandes halal, produits certifiés', 5),
-- Technologie
('Smartphones & Téléphones',   'smartphones',     '📱', '#3b82f6', 'Téléphones, accessories mobiles', 10),
('Ordinateurs & PC',            'informatique',    '💻', '#6366f1', 'PC, laptops, composants', 11),
('TV & Audiovisuel',            'tv-audio',        '📺', '#8b5cf6', 'Télévisions, home cinéma, son', 12),
('Gaming & Consoles',           'gaming',          '🎮', '#ec4899', 'Jeux vidéo, consoles, accessoires', 13),
('Objets Connectés & IoT',     'iot',             '🔌', '#14b8a6', 'Domotique, montres, wearables', 14),
-- Maison
('Électroménager',              'electromenager',  '🏠', '#f97316', 'Réfrigérateurs, machines, fours', 20),
('Meubles & Décoration',        'meubles',         '🛋️', '#a16207', 'Canapés, tables, déco intérieure', 21),
('Cuisine & Arts de la table',  'cuisine',         '🍳', '#dc2626', 'Ustensiles, vaisselle, électro cuisine', 22),
('Jardin & Outdoor',            'jardin',          '🌱', '#15803d', 'Plantes, mobilier jardin, outillage', 23),
('Bricolage & Outillage',       'bricolage',       '🔧', '#78716c', 'Outils, fixation, équipements', 24),
('Climatisation & Chauffage',   'clim-chauffage',  '❄️', '#0ea5e9', 'Climatiseurs, chauffage, ventilation', 25),
-- Mode
('Vêtements Femme',             'mode-femme',      '👗', '#f43f5e', 'Robes, tops, vêtements féminins', 30),
('Vêtements Homme',             'mode-homme',      '👔', '#1d4ed8', 'Costumes, chemises, pantalons', 31),
('Chaussures',                  'chaussures',      '👟', '#7c3aed', 'Sneakers, escarpins, bottes', 32),
('Montres & Bijoux',            'bijoux',          '💎', '#d97706', 'Montres, colliers, bagues', 33),
('Sacs & Maroquinerie',         'sacs',            '👜', '#92400e', 'Sacs à main, portefeuilles', 34),
('Parfums & Cosmétiques',       'parfums',         '💄', '#db2777', 'Parfums, maquillage, soins', 35),
('Luxe & Premium',              'luxe',            '✨', '#b45309', 'Articles de luxe, haute gamme', 36),
-- Automobile
('Voitures',                    'voitures',        '🚗', '#ef4444', 'Achat, vente, recherche véhicules', 40),
('Motos & Scooters',            'motos',           '🏍️', '#f97316', 'Motos, scooters, pièces', 41),
('Pièces Auto',                 'pieces-auto',     '⚙️', '#71717a', 'Pièces détachées, accessoires auto', 42),
('Location de véhicules',       'location-auto',   '🔑', '#06b6d4', 'Location courte/longue durée', 43),
('Services Auto',               'services-auto',   '🔩', '#78716c', 'Mécanique, lavage, contrôle technique', 44),
-- Santé
('Pharmacies & Médicaments',    'pharmacie',       '💊', '#22c55e', 'Médicaments, compléments, dispositifs', 50),
('Lunettes & Optique',          'optique',         '👓', '#3b82f6', 'Lunettes de vue, soleil, lentilles', 51),
('Matériel Médical',            'medical',         '🏥', '#14b8a6', 'Équipements, fauteuils, orthopédie', 52),
('Bien-être & Nutrition',       'bien-etre',       '💪', '#84cc16', 'Vitamines, protéines, naturopathie', 53),
-- Services
('Ménage & Nettoyage',          'menage',          '🧹', '#a3a3a3', 'Femmes de ménage, nettoyage, entretien', 60),
('Déménagement',                'demenagement',    '📦', '#f59e0b', 'Transport, déménageurs, stockage', 61),
('Réparation & Maintenance',    'reparation',      '🔨', '#78716c', 'Électroménager, informatique, mobile', 62),
('Sécurité',                    'securite',        '🔐', '#1e40af', 'Caméras, alarmes, gardiennage', 63),
('Livraison & Coursiers',       'livraison',       '🚚', '#f97316', 'Livraison express, coursiers', 64),
('Formation & Coaching',        'formation',       '🎓', '#7c3aed', 'Formations, coaching, consulting', 65),
-- Immobilier
('Location Appartements',       'location-appart', '🏢', '#3b82f6', 'Appartements à louer', 70),
('Vente Immobilière',           'vente-immo',      '🏡', '#16a34a', 'Maisons, appartements à vendre', 71),
('Bureaux & Coworking',         'bureaux',         '💼', '#6366f1', 'Bureaux, espaces de travail', 72),
('Location Vacances',           'vacances-immo',   '🏖️', '#f59e0b', 'Riad, villa, location saisonnière', 73),
-- Construction & BTP
('Matériaux de construction',   'materiaux',       '🧱', '#78716c', 'Ciment, briques, sable, acier', 80),
('Artisans & Travaux',          'artisans',        '👷', '#f59e0b', 'Plombiers, électriciens, peintres', 81),
('Architecture & Design',       'architecture',    '📐', '#6366f1', 'Architectes, designers d\'intérieur', 82),
-- Éducation
('Cours Particuliers',          'cours-particuliers', '📚', '#8b5cf6', 'Soutien scolaire, professeurs', 90),
('Langues étrangères',          'langues',         '🌐', '#06b6d4', 'Anglais, français, arabe, espagnol', 91),
('Formation Professionnelle',   'formation-pro',   '💼', '#7c3aed', 'Certifications, compétences pro', 92),
-- Voyage
('Hôtels & Hébergement',        'hotels',          '🏨', '#f59e0b', 'Hôtels, riads, guesthouses', 100),
('Vols & Billets',              'vols',            '✈️', '#3b82f6', 'Billets d\'avion, compagnies', 101),
('Omra & Hajj',                 'omra-hajj',       '🕋', '#7c3aed', 'Packages Omra, Hajj, voyages spirituels', 102),
('Excursions & Tourisme',       'excursions',      '🗺️', '#22c55e', 'Circuits, excursions, guides', 103),
-- Beauté
('Coiffure & Barbier',          'coiffure',        '💈', '#f43f5e', 'Coiffeurs, barbiers, salons', 110),
('Esthétique & Spa',            'esthetique',      '💆', '#db2777', 'Esthéticiennes, spa, massages', 111),
-- Événementiel
('Mariages & Cérémonies',       'mariages',        '💒', '#f43f5e', 'Organisateurs, traiteurs, salles', 120),
('Traiteurs & Restauration',    'traiteurs',       '🍽️', '#f97316', 'Buffets, traiteurs, service repas', 121),
('Animation & Musique',         'animation',       '🎵', '#8b5cf6', 'DJs, orchestres, animateurs', 122),
('Photographie & Vidéo',        'photo-video',     '📸', '#1d4ed8', 'Photographes, vidéastes, studios', 123),
-- Agriculture
('Bétail & Animaux de ferme',   'betail',          '🐄', '#65a30d', 'Vaches, moutons, volailles', 130),
('Matériel Agricole',           'materiel-agri',   '🚜', '#78716c', 'Tracteurs, irrigation, outillage', 131),
('Produits agricoles',          'produits-agri',   '🌾', '#84cc16', 'Céréales, légumes, fruits en gros', 132),
-- Finance & Assurance
('Assurance',                   'assurance',       '🛡️', '#1d4ed8', 'Auto, habitation, santé, vie', 140),
('Crédit & Financement',        'credit',          '💳', '#16a34a', 'Prêts, leasing, financement', 141),
-- Digital & Tech Services
('Développement Web & Mobile',  'dev-web',         '👨‍💻', '#6366f1', 'Sites web, apps, développeurs', 150),
('Design Graphique & UI',       'design',          '🎨', '#ec4899', 'Logos, identités, UI/UX', 151),
('Marketing Digital',           'marketing',       '📊', '#f97316', 'SEO, réseaux sociaux, pub', 152),
('IA & Data',                   'ia-data',         '🤖', '#8b5cf6', 'Intelligence artificielle, analyse', 153),
-- Emploi
('Offres d\'emploi',            'emploi',          '💼', '#1d4ed8', 'CDI, CDD, temps partiel', 160),
('Freelance & Missions',        'freelance',       '🧑‍💻', '#7c3aed', 'Missions freelance, indépendants', 161),
-- Animaux de compagnie
('Vétérinaires',                'veterinaires',    '🐾', '#16a34a', 'Soins, consultations, urgences', 170),
('Nourriture & Accessoires animaux','animaux',     '🐕', '#f59e0b', 'Croquettes, jeux, accessoires', 171),
-- Sport
('Salles de sport',             'salle-sport',     '🏋️', '#ef4444', 'Abonnements, coaching, cours', 180),
('Équipements sportifs',        'equipements-sport','⚽', '#16a34a', 'Matériel, tenues, accessoires', 181),
-- Industrie & B2B
('Machines industrielles',      'machines',        '🏭', '#71717a', 'Équipements, matériel industriel', 190),
('Grossistes & Fournisseurs',   'grossistes',      '📦', '#78716c', 'Achat en gros, import/export', 191),
-- Enfants
('Jouets & Jeux',               'jouets',          '🧸', '#f59e0b', 'Jouets, jeux, éducatif', 200),
('Puériculture',                'puericulture',    '👶', '#f43f5e', 'Poussettes, lits, sécurité', 201),
('Enfants & Activités',         'activites-enfants','🎪', '#8b5cf6', 'Cours, activités, loisirs', 202),
-- Autre
('Autre',                       'autre',           '📦', '#a3a3a3', 'Tout ce qui ne rentre pas ailleurs', 999);

-- ================================================================
-- MERCHANTS
-- ================================================================

CREATE TABLE merchants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name   TEXT NOT NULL,
  description     TEXT,
  logo_url        TEXT,
  cover_url       TEXT,
  address         TEXT,
  city            TEXT NOT NULL,
  country         TEXT NOT NULL DEFAULT 'MA',
  lat             DECIMAL(10,8),
  lng             DECIMAL(11,8),
  categories      TEXT[] DEFAULT '{}',
  tier            merchant_tier DEFAULT 'free',
  rating          DECIMAL(3,2) DEFAULT 0,
  total_ratings   INTEGER DEFAULT 0,
  total_sales     INTEGER DEFAULT 0,
  total_offers    INTEGER DEFAULT 0,
  accepted_offers INTEGER DEFAULT 0,
  response_rate   DECIMAL(5,2) DEFAULT 0,
  avg_response_hours DECIMAL(6,2) DEFAULT 24,
  verified        BOOLEAN DEFAULT FALSE,
  active          BOOLEAN DEFAULT TRUE,
  suspended       BOOLEAN DEFAULT FALSE,
  stripe_account  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_merchants_city ON merchants(city);
CREATE INDEX idx_merchants_categories ON merchants USING gin(categories);
CREATE INDEX idx_merchants_rating ON merchants(rating DESC);
CREATE INDEX idx_merchants_active ON merchants(active, suspended);

-- ================================================================
-- REQUESTS (Demandes d'achat)
-- ================================================================

CREATE TABLE requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  category_id     UUID NOT NULL REFERENCES categories(id),
  budget_min      DECIMAL(12,2),
  budget_max      DECIMAL(12,2),
  currency        TEXT NOT NULL DEFAULT 'MAD',
  city            TEXT NOT NULL,
  country         TEXT NOT NULL DEFAULT 'MA',
  lat             DECIMAL(10,8),
  lng             DECIMAL(11,8),
  deadline        TIMESTAMPTZ,
  urgent          BOOLEAN DEFAULT FALSE,
  delivery_needed BOOLEAN DEFAULT TRUE,
  image_url       TEXT,
  video_url       TEXT,
  status          request_status DEFAULT 'open',
  offers_count    INTEGER DEFAULT 0,
  best_offer_price DECIMAL(12,2),
  views_count     INTEGER DEFAULT 0,
  matched_merchants UUID[] DEFAULT '{}',
  ai_suggested_budget_min DECIMAL(12,2),
  ai_suggested_budget_max DECIMAL(12,2),
  ai_confidence   DECIMAL(4,3),
  expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_buyer ON requests(buyer_id);
CREATE INDEX idx_requests_category ON requests(category_id);
CREATE INDEX idx_requests_city ON requests(city);
CREATE INDEX idx_requests_created ON requests(created_at DESC);
CREATE INDEX idx_requests_urgent ON requests(urgent) WHERE urgent = TRUE;
CREATE INDEX idx_requests_search ON requests USING gin(
  to_tsvector('french', coalesce(title,'') || ' ' || coalesce(description,''))
);

-- ================================================================
-- OFFERS (Offres des commerçants)
-- ================================================================

CREATE TABLE offers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id      UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  price           DECIMAL(12,2) NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'MAD',
  delivery_days   INTEGER NOT NULL DEFAULT 3,
  delivery_fee    DECIMAL(10,2) DEFAULT 0,
  free_delivery   BOOLEAN DEFAULT FALSE,
  note            TEXT,
  image_url       TEXT,
  status          offer_status DEFAULT 'pending',
  sponsored       BOOLEAN DEFAULT FALSE,
  sponsor_score   INTEGER DEFAULT 0,
  viewed_by_buyer BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(request_id, merchant_id)
);

CREATE INDEX idx_offers_request ON offers(request_id);
CREATE INDEX idx_offers_merchant ON offers(merchant_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_price ON offers(request_id, price ASC);

-- ================================================================
-- MESSAGES (Chat realtime)
-- ================================================================

CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offer_id    UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  read        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_offer ON messages(offer_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- ================================================================
-- NOTIFICATIONS
-- ================================================================

CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  type        notif_type NOT NULL DEFAULT 'system',
  read        BOOLEAN DEFAULT FALSE,
  data        JSONB DEFAULT '{}',
  action_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifs_user ON notifications(user_id, read);
CREATE INDEX idx_notifs_created ON notifications(created_at DESC);

-- ================================================================
-- RATINGS
-- ================================================================

CREATE TABLE ratings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id  UUID NOT NULL REFERENCES requests(id),
  offer_id    UUID NOT NULL REFERENCES offers(id),
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  reviewee_id UUID NOT NULL REFERENCES profiles(id),
  score       SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment     TEXT,
  reply       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(offer_id, reviewer_id)
);

-- ================================================================
-- PAYMENTS (Architecture Stripe-ready)
-- ================================================================

CREATE TABLE payments (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offer_id            UUID NOT NULL REFERENCES offers(id),
  buyer_id            UUID NOT NULL REFERENCES profiles(id),
  merchant_id         UUID NOT NULL REFERENCES merchants(id),
  amount              DECIMAL(12,2) NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'MAD',
  stripe_payment_id   TEXT,
  stripe_transfer_id  TEXT,
  status              TEXT DEFAULT 'pending',
  commission_rate     DECIMAL(4,3) DEFAULT 0.05,
  commission_amount   DECIMAL(12,2),
  net_amount          DECIMAL(12,2),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ADMIN LOGS
-- ================================================================

CREATE TABLE admin_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id    UUID NOT NULL REFERENCES profiles(id),
  action      TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id   UUID,
  details     JSONB DEFAULT '{}',
  ip_address  INET,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- FUNCTIONS & TRIGGERS
-- ================================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated_at   BEFORE UPDATE ON profiles   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_merchants_updated_at  BEFORE UPDATE ON merchants  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_requests_updated_at   BEFORE UPDATE ON requests   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_offers_updated_at     BEFORE UPDATE ON offers     FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'buyer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update offers_count + best_price on requests
CREATE OR REPLACE FUNCTION sync_request_offer_stats()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE rid UUID;
BEGIN
  rid := COALESCE(NEW.request_id, OLD.request_id);
  UPDATE requests SET
    offers_count = (SELECT COUNT(*) FROM offers WHERE request_id = rid AND status != 'rejected'),
    best_offer_price = (SELECT MIN(price) FROM offers WHERE request_id = rid AND status IN ('pending','accepted'))
  WHERE id = rid;
  RETURN COALESCE(NEW, OLD);
END; $$;

CREATE TRIGGER trg_offer_stats
  AFTER INSERT OR UPDATE OR DELETE ON offers
  FOR EACH ROW EXECUTE FUNCTION sync_request_offer_stats();

-- Update merchant stats after offer accepted
CREATE OR REPLACE FUNCTION sync_merchant_stats()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    UPDATE merchants SET
      accepted_offers = accepted_offers + 1,
      total_sales = total_sales + 1
    WHERE id = NEW.merchant_id;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_merchant_stats
  AFTER UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION sync_merchant_stats();

-- Update merchant rating on new rating
CREATE OR REPLACE FUNCTION sync_merchant_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE merchants SET
    rating = (
      SELECT ROUND(AVG(r.score)::NUMERIC, 2)
      FROM ratings r JOIN offers o ON o.id = r.offer_id
      WHERE o.merchant_id = merchants.id
    ),
    total_ratings = (
      SELECT COUNT(*) FROM ratings r JOIN offers o ON o.id = r.offer_id
      WHERE o.merchant_id = merchants.id
    )
  WHERE id = (SELECT merchant_id FROM offers WHERE id = NEW.offer_id);
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_rating_sync
  AFTER INSERT ON ratings
  FOR EACH ROW EXECUTE FUNCTION sync_merchant_rating();

-- Auto-notify buyer when offer received
CREATE OR REPLACE FUNCTION notify_offer_received()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  buyer UUID;
  req_title TEXT;
  merchant_name TEXT;
BEGIN
  SELECT r.buyer_id, r.title INTO buyer, req_title FROM requests r WHERE id = NEW.request_id;
  SELECT business_name INTO merchant_name FROM merchants WHERE id = NEW.merchant_id;

  INSERT INTO notifications (user_id, title, message, type, data, action_url)
  VALUES (
    buyer,
    '💰 Nouvelle offre reçue !',
    merchant_name || ' a proposé une offre pour "' || req_title || '"',
    'offer_received',
    jsonb_build_object('offer_id', NEW.id, 'request_id', NEW.request_id, 'price', NEW.price),
    '/dashboard/buyer/requests/' || NEW.request_id
  );
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_notify_offer
  AFTER INSERT ON offers
  FOR EACH ROW EXECUTE FUNCTION notify_offer_received();

-- Auto-notify merchant when offer accepted/rejected
CREATE OR REPLACE FUNCTION notify_offer_status()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  merchant_user UUID;
  req_title TEXT;
BEGIN
  IF NEW.status != OLD.status AND NEW.status IN ('accepted','rejected') THEN
    SELECT user_id INTO merchant_user FROM merchants WHERE id = NEW.merchant_id;
    SELECT title INTO req_title FROM requests WHERE id = NEW.request_id;
    INSERT INTO notifications (user_id, title, message, type, data)
    VALUES (
      merchant_user,
      CASE WHEN NEW.status = 'accepted' THEN '🎉 Offre acceptée !' ELSE '❌ Offre refusée' END,
      'Votre offre pour "' || req_title || '" a été ' ||
        CASE WHEN NEW.status = 'accepted' THEN 'acceptée' ELSE 'refusée' END,
      CASE WHEN NEW.status = 'accepted' THEN 'offer_accepted' ELSE 'offer_rejected' END,
      jsonb_build_object('offer_id', NEW.id, 'request_id', NEW.request_id)
    );
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_notify_offer_status
  AFTER UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION notify_offer_status();

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants      ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests       ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs     ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "profiles_read_all"    ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_write_own"   ON profiles FOR UPDATE USING (auth.uid() = id);

-- MERCHANTS
CREATE POLICY "merchants_read_active" ON merchants FOR SELECT USING (active = TRUE AND suspended = FALSE);
CREATE POLICY "merchants_insert_own"  ON merchants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "merchants_update_own"  ON merchants FOR UPDATE USING (auth.uid() = user_id);

-- REQUESTS
CREATE POLICY "requests_read_open"   ON requests FOR SELECT USING (status = 'open' OR buyer_id = auth.uid());
CREATE POLICY "requests_insert_own"  ON requests FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "requests_update_own"  ON requests FOR UPDATE USING (auth.uid() = buyer_id);
CREATE POLICY "requests_delete_own"  ON requests FOR DELETE USING (auth.uid() = buyer_id AND status = 'open');

-- OFFERS
CREATE POLICY "offers_read_relevant" ON offers FOR SELECT USING (
  -- L'acheteur voit les offres sur ses demandes
  (SELECT buyer_id FROM requests WHERE id = request_id) = auth.uid()
  OR
  -- Le commerçant voit ses propres offres
  (SELECT user_id FROM merchants WHERE id = merchant_id) = auth.uid()
);
CREATE POLICY "offers_insert_merchant" ON offers FOR INSERT WITH CHECK (
  (SELECT user_id FROM merchants WHERE id = merchant_id) = auth.uid()
);
CREATE POLICY "offers_update_merchant" ON offers FOR UPDATE USING (
  (SELECT user_id FROM merchants WHERE id = merchant_id) = auth.uid()
  OR
  (SELECT buyer_id FROM requests WHERE id = request_id) = auth.uid()
);

-- MESSAGES
CREATE POLICY "messages_read_parties" ON messages FOR SELECT USING (
  sender_id = auth.uid()
  OR (SELECT (SELECT buyer_id FROM requests r WHERE r.id = o.request_id) = auth.uid()
      OR (SELECT user_id FROM merchants m WHERE m.id = o.merchant_id) = auth.uid()
      FROM offers o WHERE o.id = offer_id)
);
CREATE POLICY "messages_insert_own" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- NOTIFICATIONS
CREATE POLICY "notifs_own" ON notifications FOR ALL USING (auth.uid() = user_id);

-- RATINGS
CREATE POLICY "ratings_read_all"     ON ratings FOR SELECT USING (TRUE);
CREATE POLICY "ratings_insert_party" ON ratings FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- PAYMENTS
CREATE POLICY "payments_own" ON payments FOR SELECT USING (
  auth.uid() = buyer_id OR
  (SELECT user_id FROM merchants WHERE id = merchant_id) = auth.uid()
);

-- Admin override policies (service role bypasses RLS anyway)
-- For admin panel via service role key — no additional policies needed

-- ================================================================
-- VIEWS (pour analytics et dashboards)
-- ================================================================

CREATE VIEW v_request_feed AS
SELECT
  r.*,
  p.full_name AS buyer_name,
  p.avatar_url AS buyer_avatar,
  c.name AS category_name,
  c.icon AS category_icon,
  c.color AS category_color,
  c.slug AS category_slug
FROM requests r
JOIN profiles p ON p.id = r.buyer_id
JOIN categories c ON c.id = r.category_id
WHERE r.status = 'open' AND r.expires_at > NOW();

CREATE VIEW v_offer_detail AS
SELECT
  o.*,
  m.business_name,
  m.logo_url AS merchant_logo,
  m.rating AS merchant_rating,
  m.total_ratings AS merchant_reviews,
  m.verified AS merchant_verified,
  m.city AS merchant_city,
  m.response_rate
FROM offers o
JOIN merchants m ON m.id = o.merchant_id;

-- ================================================================
-- REALTIME — enable replication on needed tables
-- ================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE offers;
ALTER PUBLICATION supabase_realtime ADD TABLE requests;
