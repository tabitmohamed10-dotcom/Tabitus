# 🔥 TABITUS — Le marché qui travaille pour vous

> **La marketplace inversée intelligente du Maroc et de l'Afrique**
> 
> Publiez votre besoin → Recevez des offres → Choisissez la meilleure

---

## 🚀 Vision

Tabitus révolutionne le commerce en inversant la logique des marketplaces traditionnelles. Au lieu que les clients cherchent dans des catalogues, **ils publient leurs besoins** et les commerçants viennent à eux avec leurs meilleures offres.

**Modèle inspiré de :** InDrive (pour le covoiturage) → appliqué à TOUS les secteurs commerciaux.

---

## 🌍 Marchés cibles

1. **Maroc** (lancement) — 22 villes
2. **Afrique francophone** (V2) — Sénégal, CI, Cameroun
3. **Moyen-Orient** (V2) — Arabie Saoudite, UAE
4. **Europe diaspora** (V3)
5. **Mondial** (V4)

---

## ⚡ Stack Technique

| Couche | Tech |
|--------|------|
| Frontend | Next.js 15, React, TypeScript |
| Styling | TailwindCSS, shadcn/ui |
| Backend | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Déploiement | Vercel |
| Paiements | Stripe (architecture prête) |

---

## 📁 Structure du projet

```
tabitus/
├── app/
│   ├── page.tsx                    # Landing page premium
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Design system CSS
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── dashboard/
│   │   ├── buyer/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # Dashboard acheteur
│   │   │   └── requests/
│   │   │       ├── new/page.tsx    # Formulaire demande
│   │   │       └── [id]/page.tsx   # Détail + offres
│   │   └── merchant/
│   │       ├── layout.tsx
│   │       ├── page.tsx            # Dashboard commerçant
│   │       ├── requests/page.tsx   # Feed demandes
│   │       ├── offers/page.tsx     # Mes offres
│   │       └── profile/page.tsx   # Profil boutique
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Analytics admin
│   │   ├── users/page.tsx
│   │   └── merchants/page.tsx
│   └── api/
│       ├── matching/route.ts       # Engine matching
│       ├── requests/route.ts
│       ├── offers/route.ts
│       └── notifications/route.ts
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── index.tsx               # Badge, Card, Input, Avatar...
│   ├── shared/
│   │   └── navbar.tsx
│   └── buyer/
│       └── accept-offer-button.tsx
├── lib/
│   ├── types/index.ts              # TypeScript complet
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── hooks/index.ts              # React hooks
│   ├── utils/index.ts              # Helpers
│   ├── matching/engine.ts          # Algo matching
│   └── ai/categorizer.ts          # IA locale
├── supabase/
│   └── migrations/001_init.sql    # Schema complet
└── middleware.ts                   # Auth protection
```

---

## 🛠️ Installation & démarrage

### Prérequis

- Node.js 18+
- npm ou pnpm
- Compte Supabase (gratuit)
- Compte Vercel (gratuit)

### 1. Cloner et installer

```bash
git clone https://github.com/tabitus/tabitus-app.git
cd tabitus-app
npm install
```

### 2. Configurer Supabase

```bash
# Créer un projet sur https://supabase.com
# Copier les credentials

cp .env.example .env.local
# Remplir NEXT_PUBLIC_SUPABASE_URL et les clés
```

### 3. Exécuter les migrations SQL

```bash
# Dans le Supabase SQL Editor, exécuter:
# supabase/migrations/001_init.sql
```

Ou via CLI Supabase :
```bash
npm install -g supabase
supabase login
supabase link --project-ref votre_project_ref
supabase db push
```

### 4. Configurer le storage Supabase

Dans votre dashboard Supabase → Storage → Créer bucket :
- Nom : `tabitus-uploads`
- Public : `true`

### 5. Lancer en développement

```bash
npm run dev
# → http://localhost:3000
```

---

## 🗄️ Base de données

### Tables principales

| Table | Description |
|-------|-------------|
| `profiles` | Tous les utilisateurs (acheteurs, vendeurs, admin) |
| `categories` | 60+ catégories hiérarchiques |
| `merchants` | Profils commerçants avec stats |
| `requests` | Demandes d'achat publiées |
| `offers` | Offres des commerçants |
| `messages` | Chat realtime par offre |
| `notifications` | Système de notifications |
| `ratings` | Avis bidirectionnels |
| `payments` | Transactions Stripe |
| `admin_logs` | Audit trail admin |

### Vues

| Vue | Usage |
|-----|-------|
| `v_request_feed` | Feed public des demandes ouvertes |
| `v_offer_detail` | Détail offre avec infos merchant |

---

## 🔐 Sécurité (RLS)

Toutes les tables ont Row Level Security activé :

- **Profiles** : lecture publique, écriture propre uniquement
- **Requests** : lecture si ouvert ou buyer = user, écriture si buyer = user
- **Offers** : lecture si partie concernée (buyer du req ou merchant de l'offre)
- **Notifications** : accès propre uniquement
- **Admin** : bypass via service_role_key uniquement

---

## 🤖 Algorithme de Matching

Le moteur de matching (`lib/matching/engine.ts`) score chaque commerçant sur :

| Critère | Poids |
|---------|-------|
| Catégorie | 35% |
| Localisation | 25% |
| Budget | 20% |
| Réputation | 10% |
| Disponibilité | 10% |

Résultat : score 0-100, top 15 notifiés automatiquement.

---

## 💰 Modèle Économique

### Pour les acheteurs
- **100% gratuit** — toujours

### Pour les commerçants
| Plan | Prix | Avantages |
|------|------|-----------|
| Free | 0 DH | 5 offres/mois, profil basique |
| Starter | 199 DH/mois | 50 offres, analytics basiques |
| Pro | 499 DH/mois | Illimité, boost, analytics avancés |
| Enterprise | Sur devis | Multi-boutiques, API, SLA |

### Commission transactions
- 3-5% sur les paiements en ligne
- 0% si paiement en direct (hors plateforme)

---

## 📊 KPIs Marketplace

**Supply** (commerçants) :
- Merchants actifs / mois
- Offres envoyées / merchant
- Taux de réponse moyen

**Demand** (acheteurs) :
- Demandes publiées / jour
- Taux de conversion demande → deal
- Budget moyen par demande

**Marketplace health** :
- Ratio supply/demand par ville/catégorie
- Time to first offer (< 2h objectif)
- NPS acheteurs et commerçants

---

## 🚀 Déploiement Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

Variables à configurer dans Vercel Dashboard :
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
```

---

## 📱 Roadmap

### V1 — MVP (Mois 1-3)
- [x] Landing page premium
- [x] Auth (email + Google)
- [x] Dashboard acheteur complet
- [x] Dashboard commerçant complet
- [x] Système d'offres
- [x] Notifications realtime
- [x] Matching engine
- [x] Admin panel basique

### V2 — Croissance (Mois 4-6)
- [ ] Chat realtime complet
- [ ] Paiements Stripe
- [ ] App mobile React Native
- [ ] Vérification KYC commerçants
- [ ] Sponsoring d'offres
- [ ] Analytics avancés
- [ ] SEO pages catégories
- [ ] API publique

### V3 — Expansion (Mois 7-12)
- [ ] Multi-langues (FR, AR, EN)
- [ ] Multi-devises
- [ ] Expansion Afrique
- [ ] Programme d'affiliation
- [ ] Tabitus Pro (B2B)
- [ ] IA avancée (LLM)

---

## 🎯 Stratégie Acquisition Maroc

### Phase 1 — Casablanca (Mois 1-2)
- Partenariats avec 200 commerçants de Casa
- Influence marketing (micro-influenceurs tech)
- Facebook/Instagram ads géolocalisés
- Communautés WhatsApp et Facebook

### Phase 2 — 6 villes (Mois 3-4)
- Rabat, Marrakech, Fès, Tanger, Agadir
- Ambassadeurs locaux dans chaque ville
- Partenariats avec associations commerçants

### Phase 3 — Maroc entier (Mois 5-12)
- TV + radio + OOH dans grandes villes
- Programme referral acheteurs (20 DH par ami)
- Catalogues SMS pour commerçants peu tech

---

## 🏗️ Architecture Scaling

```
Production Stack :
├── Vercel Edge Network (CDN global)
├── Supabase Pro (100k MAU inclus)
│   ├── PostgreSQL (read replicas)
│   ├── Realtime (WebSockets)
│   └── Storage (CDN images)
├── Stripe (paiements)
└── Resend (emails transactionnels)

Scaling > 1M users :
├── Supabase Enterprise
├── Redis (caching sessions)
├── Elasticsearch (recherche avancée)
└── Kubernetes (si besoin)
```

---

## 🤝 Contribution

```bash
git checkout -b feature/ma-feature
git commit -m "feat: description"
git push origin feature/ma-feature
# Ouvrir une PR
```

---

## 📄 Licence

Propriétaire — Tabitus SAS © 2024

---

*Construit avec ❤️ à Casablanca, Maroc 🇲🇦*
