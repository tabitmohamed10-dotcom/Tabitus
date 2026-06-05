-- ================================================================
-- TABITUS — Migration 004: Fix categories seed + profile backfill
-- ================================================================

-- ── 1. Re-seed categories (safe: ON CONFLICT DO NOTHING) ─────────
-- Guarantees the categories table always has data even if migration
-- 001 seed was skipped or ran against an empty DB.
INSERT INTO categories (name, slug, icon, color, description, sort_order) VALUES
('Alimentation & Épicerie',     'alimentation',    '🛒', '#22c55e', 'Épicerie, supermarché, alimentation générale', 1),
('Boulangerie & Pâtisserie',    'boulangerie',     '🥖', '#f59e0b', 'Pain, gâteaux, viennoiseries', 2),
('Boissons',                     'boissons',        '🥤', '#06b6d4', 'Eau, jus, sodas, cafés, thé', 3),
('Bio & Naturel',                'bio',             '🌿', '#16a34a', 'Produits bio, naturels, santé', 4),
('Halal & Casher',               'halal',           '🕌', '#7c3aed', 'Viandes halal, produits certifiés', 5),
('Smartphones & Téléphones',    'smartphones',     '📱', '#3b82f6', 'Téléphones, accessories mobiles', 10),
('Ordinateurs & PC',             'informatique',    '💻', '#6366f1', 'PC, laptops, composants', 11),
('TV & Audiovisuel',             'tv-audio',        '📺', '#8b5cf6', 'Télévisions, home cinéma, son', 12),
('Gaming & Consoles',            'gaming',          '🎮', '#ec4899', 'Jeux vidéo, consoles, accessoires', 13),
('Objets Connectés & IoT',      'iot',             '🔌', '#14b8a6', 'Domotique, montres, wearables', 14),
('Électroménager',               'electromenager',  '🏠', '#f97316', 'Réfrigérateurs, machines, fours', 20),
('Meubles & Décoration',         'meubles',         '🛋️', '#a16207', 'Canapés, tables, déco intérieure', 21),
('Cuisine & Arts de la table',   'cuisine',         '🍳', '#dc2626', 'Ustensiles, vaisselle, électro cuisine', 22),
('Jardin & Outdoor',             'jardin',          '🌱', '#15803d', 'Plantes, mobilier jardin, outillage', 23),
('Bricolage & Outillage',        'bricolage',       '🔧', '#78716c', 'Outils, fixation, équipements', 24),
('Climatisation & Chauffage',    'clim-chauffage',  '❄️', '#0ea5e9', 'Climatiseurs, chauffage, ventilation', 25),
('Vêtements Femme',              'mode-femme',      '👗', '#f43f5e', 'Robes, tops, vêtements féminins', 30),
('Vêtements Homme',              'mode-homme',      '👔', '#1d4ed8', 'Costumes, chemises, pantalons', 31),
('Chaussures',                   'chaussures',      '👟', '#7c3aed', 'Sneakers, escarpins, bottes', 32),
('Montres & Bijoux',             'bijoux',          '💎', '#d97706', 'Montres, colliers, bagues', 33),
('Sacs & Maroquinerie',          'sacs',            '👜', '#92400e', 'Sacs à main, portefeuilles', 34),
('Parfums & Cosmétiques',        'parfums',         '💄', '#db2777', 'Parfums, maquillage, soins', 35),
('Luxe & Premium',               'luxe',            '✨', '#b45309', 'Articles de luxe, haute gamme', 36),
('Voitures',                     'voitures',        '🚗', '#ef4444', 'Achat, vente, recherche véhicules', 40),
('Motos & Scooters',             'motos',           '🏍️', '#f97316', 'Motos, scooters, pièces', 41),
('Pièces Auto',                  'pieces-auto',     '⚙️', '#71717a', 'Pièces détachées, accessoires auto', 42),
('Location de véhicules',        'location-auto',   '🔑', '#06b6d4', 'Location courte/longue durée', 43),
('Services Auto',                'services-auto',   '🔩', '#78716c', 'Mécanique, lavage, contrôle technique', 44),
('Pharmacies & Médicaments',     'pharmacie',       '💊', '#22c55e', 'Médicaments, compléments, dispositifs', 50),
('Lunettes & Optique',           'optique',         '👓', '#3b82f6', 'Lunettes de vue, soleil, lentilles', 51),
('Matériel Médical',             'medical',         '🏥', '#14b8a6', 'Équipements, fauteuils, orthopédie', 52),
('Bien-être & Nutrition',        'bien-etre',       '💪', '#84cc16', 'Vitamines, protéines, naturopathie', 53),
('Ménage & Nettoyage',           'menage',          '🧹', '#a3a3a3', 'Femmes de ménage, nettoyage, entretien', 60),
('Déménagement',                 'demenagement',    '📦', '#f59e0b', 'Transport, déménageurs, stockage', 61),
('Réparation & Maintenance',     'reparation',      '🔨', '#78716c', 'Électroménager, informatique, mobile', 62),
('Sécurité',                     'securite',        '🔐', '#1e40af', 'Caméras, alarmes, gardiennage', 63),
('Livraison & Coursiers',        'livraison',       '🚚', '#f97316', 'Livraison express, coursiers', 64),
('Formation & Coaching',         'formation',       '🎓', '#7c3aed', 'Formations, coaching, consulting', 65),
('Location Appartements',        'location-appart', '🏢', '#3b82f6', 'Appartements à louer', 70),
('Vente Immobilière',            'vente-immo',      '🏡', '#16a34a', 'Maisons, appartements à vendre', 71),
('Bureaux & Coworking',          'bureaux',         '💼', '#6366f1', 'Bureaux, espaces de travail', 72),
('Location Vacances',            'vacances-immo',   '🏖️', '#f59e0b', 'Riad, villa, location saisonnière', 73),
('Matériaux de construction',    'materiaux',       '🧱', '#78716c', 'Ciment, briques, sable, acier', 80),
('Artisans & Travaux',           'artisans',        '👷', '#f59e0b', 'Plombiers, électriciens, peintres', 81),
('Architecture & Design',        'architecture',    '📐', '#6366f1', 'Architectes, designers d''intérieur', 82),
('Cours Particuliers',           'cours-particuliers', '📚', '#8b5cf6', 'Soutien scolaire, professeurs', 90),
('Langues étrangères',           'langues',         '🌐', '#06b6d4', 'Anglais, français, arabe, espagnol', 91),
('Formation Professionnelle',    'formation-pro',   '💼', '#7c3aed', 'Certifications, compétences pro', 92),
('Hôtels & Hébergement',         'hotels',          '🏨', '#f59e0b', 'Hôtels, riads, guesthouses', 100),
('Vols & Billets',               'vols',            '✈️', '#3b82f6', 'Billets d''avion, compagnies', 101),
('Omra & Hajj',                  'omra-hajj',       '🕋', '#7c3aed', 'Packages Omra, Hajj, voyages spirituels', 102),
('Excursions & Tourisme',        'excursions',      '🗺️', '#22c55e', 'Circuits, excursions, guides', 103),
('Coiffure & Barbier',           'coiffure',        '💈', '#f43f5e', 'Coiffeurs, barbiers, salons', 110),
('Esthétique & Spa',             'esthetique',      '💆', '#db2777', 'Esthéticiennes, spa, massages', 111),
('Mariages & Cérémonies',        'mariages',        '💒', '#f43f5e', 'Organisateurs, traiteurs, salles', 120),
('Traiteurs & Restauration',     'traiteurs',       '🍽️', '#f97316', 'Buffets, traiteurs, service repas', 121),
('Animation & Musique',          'animation',       '🎵', '#8b5cf6', 'DJs, orchestres, animateurs', 122),
('Photographie & Vidéo',         'photo-video',     '📸', '#1d4ed8', 'Photographes, vidéastes, studios', 123),
('Bétail & Animaux de ferme',    'betail',          '🐄', '#65a30d', 'Vaches, moutons, volailles', 130),
('Matériel Agricole',            'materiel-agri',   '🚜', '#78716c', 'Tracteurs, irrigation, outillage', 131),
('Produits agricoles',           'produits-agri',   '🌾', '#84cc16', 'Céréales, légumes, fruits en gros', 132),
('Assurance',                    'assurance',       '🛡️', '#1d4ed8', 'Auto, habitation, santé, vie', 140),
('Crédit & Financement',         'credit',          '💳', '#16a34a', 'Prêts, leasing, financement', 141),
('Développement Web & Mobile',   'dev-web',         '👨‍💻', '#6366f1', 'Sites web, apps, développeurs', 150),
('Design Graphique & UI',        'design',          '🎨', '#ec4899', 'Logos, identités, UI/UX', 151),
('Marketing Digital',            'marketing',       '📊', '#f97316', 'SEO, réseaux sociaux, pub', 152),
('IA & Data',                    'ia-data',         '🤖', '#8b5cf6', 'Intelligence artificielle, analyse', 153),
('Offres d''emploi',             'emploi',          '💼', '#1d4ed8', 'CDI, CDD, temps partiel', 160),
('Freelance & Missions',         'freelance',       '🧑‍💻', '#7c3aed', 'Missions freelance, indépendants', 161),
('Vétérinaires',                 'veterinaires',    '🐾', '#16a34a', 'Soins, consultations, urgences', 170),
('Nourriture & Accessoires animaux', 'animaux',     '🐕', '#f59e0b', 'Croquettes, jeux, accessoires', 171),
('Salles de sport',              'salle-sport',     '🏋️', '#ef4444', 'Abonnements, coaching, cours', 180),
('Équipements sportifs',         'equipements-sport','⚽', '#16a34a', 'Matériel, tenues, accessoires', 181),
('Machines industrielles',       'machines',        '🏭', '#71717a', 'Équipements, matériel industriel', 190),
('Grossistes & Fournisseurs',    'grossistes',      '📦', '#78716c', 'Achat en gros, import/export', 191),
('Jouets & Jeux',                'jouets',          '🧸', '#f59e0b', 'Jouets, jeux, éducatif', 200),
('Puériculture',                 'puericulture',    '👶', '#f43f5e', 'Poussettes, lits, sécurité', 201),
('Enfants & Activités',          'activites-enfants','🎪', '#8b5cf6', 'Cours, activités, loisirs', 202),
('Autre',                        'autre',           '📦', '#a3a3a3', 'Tout ce qui ne rentre pas ailleurs', 999)
ON CONFLICT (slug) DO NOTHING;

-- ── 2. Backfill profiles for auth users that don't have one ──────
-- Handles the case where handle_new_user() trigger didn't fire
-- (e.g., users created before migration 001 ran).
INSERT INTO profiles (id, email, full_name, role)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email,'@',1)),
  COALESCE((u.raw_user_meta_data->>'role')::user_role, 'buyer')
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id)
ON CONFLICT (id) DO NOTHING;

-- ── 3. Ensure handle_new_user trigger is current ─────────────────
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

-- Re-create trigger in case it was missing
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── 4. Ensure RLS insert policy for requests is correct ──────────
DROP POLICY IF EXISTS "requests_insert_own" ON requests;
CREATE POLICY "requests_insert_own" ON requests
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);
