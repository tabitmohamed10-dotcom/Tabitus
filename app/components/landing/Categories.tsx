'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

const CATEGORIES = [
  { icon: '⚡', title: 'Électroménager', arabic: 'الأجهزة الكهربائية', merchants: 340, slug: 'electromenager', subs: ['Réfrigérateurs', 'Machines à laver', 'Fours & Micro-ondes', 'Climatiseurs', 'Aspirateurs'] },
  { icon: '💻', title: 'Informatique & Téléphonie', arabic: 'الإعلاميات والهواتف', merchants: 280, slug: 'informatique', subs: ['PC portables & Desktops', 'Smartphones & Tablettes', 'Imprimantes', 'Accessoires', 'Réseaux'] },
  { icon: '🛋️', title: 'Ameublement & Décoration', arabic: 'الأثاث والديكور', merchants: 195, slug: 'ameublement', subs: ['Salons & Canapés', 'Chambres à coucher', 'Cuisines équipées', 'Bureaux', 'Luminaires'] },
  { icon: '🚗', title: 'Automobile & Pièces', arabic: 'السيارات والقطع', merchants: 220, slug: 'automobile', subs: ['Pièces détachées', 'Pneus & Jantes', 'Batteries', 'Accessoires', 'Entretien & Service'] },
  { icon: '🏗️', title: 'BTP & Matériaux', arabic: 'البناء والمواد', merchants: 310, slug: 'btp', subs: ['Ciment & Agrégats', 'Carrelage & Revêtement', 'Ferronnerie', 'Peinture & Finition', 'Sanitaire'] },
  { icon: '💎', title: 'Bijouterie & Montres', arabic: 'المجوهرات والساعات', merchants: 85, slug: 'bijouterie', subs: ['Or & Argent', 'Diamants & Pierres', 'Montres de luxe', 'Bijoux fantaisie', 'Gravure & Réparation'] },
  { icon: '👔', title: 'Mode & Textile', arabic: 'الملابس والنسيج', merchants: 175, slug: 'mode', subs: ['Vêtements hommes/femmes', 'Tissus au mètre', 'Chaussures', 'Maroquinerie', 'Sport & Outdoor'] },
  { icon: '🍽️', title: 'Alimentaire & Traiteur', arabic: 'الأغذية والتموين', merchants: 145, slug: 'alimentaire', subs: ['Épicerie en gros', 'Fruits secs & Épices', 'Boissons', 'Traiteur & Événements', 'Bio & Naturel'] },
  { icon: '🔧', title: 'Services & Artisanat', arabic: 'الخدمات والحرف', merchants: 260, slug: 'services', subs: ['Plomberie & Électricité', 'Peinture & Revêtement', 'Menuiserie & Ferronnerie', 'Nettoyage', 'Déménagement'] },
  { icon: '🏢', title: 'B2B & Entreprises', arabic: 'الشركات والمقاولات', merchants: 190, slug: 'b2b', subs: ['Fournitures de bureau', 'Équipements industriels', 'Logistique & Transport', 'Consulting', "Appels d'offres"] },
]

function CategoryCard({ cat, index }: { cat: typeof CATEGORIES[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/marche-libre?category=${cat.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <motion.div
        style={{
          height: '100%', padding: 'clamp(18px, 3vw, 24px)',
          borderRadius: 18, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', gap: 12,
          background: '#FFFFFF', border: '1px solid #E8E0CC',
        }}
        whileHover={{
          y: -8,
          boxShadow: '0 16px 48px rgba(201,146,42,0.14)',
          borderColor: '#C9922A',
        }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 30 }}>{cat.icon}</span>
          <span style={{
            fontSize: 11, padding: '4px 10px', borderRadius: 100, fontWeight: 600,
            background: 'rgba(201,146,42,0.1)', color: '#C9922A',
            letterSpacing: '0.02em',
          }}>
            {cat.merchants}
          </span>
        </div>

        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0C0B09', marginBottom: 3 }}>
            {cat.title}
          </h3>
          <p style={{
            fontFamily: 'var(--font-arabic), serif',
            fontSize: 12, color: '#C9922A', direction: 'rtl',
          }}>
            {cat.arabic}
          </p>
        </div>

        <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {cat.subs.map((s) => (
            <li key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8A856E' }}>
              <span style={{ color: 'rgba(201,146,42,0.4)', fontSize: 5 }}>◆</span>
              {s}
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#C9922A' }}>
          Voir les offres
          <span>→</span>
        </div>
      </motion.div>
      </Link>
    </motion.div>
  )
}

export default function Categories() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section
      id="categories"
      style={{
        background: '#FAFAF7',
        padding: 'clamp(56px,8vw,96px) clamp(20px,5vw,56px)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,56px)' }}
        >
          <h2 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            color: '#0C0B09', marginBottom: 12, fontWeight: 400,
          }}>
            Tout ce dont vous avez besoin,<br style={{ display: 'none' }} className="break" /> en un seul endroit
          </h2>
          <p style={{
            fontFamily: 'var(--font-arabic), serif',
            fontSize: 20, color: '#C9922A', direction: 'rtl', display: 'block', marginBottom: 12,
          }}>
            كل ما تحتاجه في مكان واحد
          </p>
          <p style={{ fontSize: 15, color: '#8A856E', maxWidth: 440, margin: '0 auto' }}>
            10 catégories, 2 400+ commerçants vérifiés, livrables partout au Maroc
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'clamp(12px, 2vw, 20px)',
        }} className="categories-grid">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.title} cat={cat} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .categories-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .categories-grid { grid-template-columns: repeat(5, 1fr) !important; }
          .break { display: inline !important; }
        }
      `}</style>
    </section>
  )
}
