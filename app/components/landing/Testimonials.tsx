'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'

const TESTIMONIALS = [
  {
    initials: 'KB',
    name: 'Karim B.',
    city: 'Casablanca',
    role: 'Acheteur — Électroménager',
    stars: 5,
    saving: '1 350 MAD économisés',
    text: "J'ai publié ma demande pour un réfrigérateur Samsung 500L le mardi matin. Dès le lendemain, j'avais 7 offres de commerçants vérifiés. J'ai choisi la meilleure à 6 450 MAD au lieu de 7 800 MAD en magasin. Livraison en 24h incluse. Incroyable.",
  },
  {
    initials: 'FZ',
    name: 'Fatima Z.',
    city: 'Rabat',
    role: 'Acheteuse — Rénovation',
    stars: 5,
    saving: 'Rénovation complète arrangée',
    text: "Pour la rénovation de mon salon, j'avais besoin de carrelage, de peinture et d'un électricien. J'ai posté 3 demandes sur TABIT le samedi. Le lundi, tout était arrangé avec des artisans vérifiés et à moitié prix du marché traditionnel.",
  },
  {
    initials: 'HM',
    name: 'Hassan M.',
    city: 'Marrakech',
    role: 'Commerçant — Électroménager',
    stars: 5,
    saving: '+35% de chiffre d\'affaires',
    text: "Je vends de l'électroménager depuis 15 ans à Marrakech. Depuis TABIT, mon CA a augmenté de 35%. Je reçois des demandes de tout le Maroc — Casablanca, Rabat, Tanger. Je touche des clients que je n'aurais jamais atteints autrement. Révolutionnaire.",
  },
  {
    initials: 'AR',
    name: 'Aicha R.',
    city: 'Casablanca',
    role: 'PME — Achats B2B',
    stars: 5,
    saving: '-20% sur les achats',
    text: "Notre PME fait ses achats de fournitures de bureau et équipements via TABIT B2B. On économise en moyenne 20% sur chaque commande, on a un historique complet pour la comptabilité et un account manager dédié. Exactement ce dont on avait besoin.",
  },
  {
    initials: 'YK',
    name: 'Youssef K.',
    city: 'Tanger',
    role: 'Artisan — Plomberie',
    stars: 5,
    saving: 'Clientèle multipliée par 3',
    text: "En tant que plombier indépendant à Tanger, TABIT m'a changé la vie. Je reçois des demandes urgentes de clients sérieux, je propose mon prix, et si c'est accepté, je travaille. Fini le démarchage inutile et les clients qui négocient à l'infini.",
  },
  {
    initials: 'NS',
    name: 'Nadia S.',
    city: 'Agadir',
    role: 'Étudiante — Informatique',
    stars: 5,
    saving: '2 500 MAD économisés',
    text: "J'avais besoin d'un MacBook Pro M3 pour mes études à l'université. Budget très limité. Sur TABIT j'ai eu 4 offres en moins de 30 minutes, toutes avec garantie 1 an. J'ai économisé 2 500 MAD vs les prix des revendeurs Apple officiels.",
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06, duration: 0.25 }}
          style={{ color: '#C9922A', fontSize: 13 }}
        >★</motion.span>
      ))}
    </div>
  )
}

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div style={{
      padding: 'clamp(20px, 3vw, 28px)',
      borderRadius: 20,
      display: 'flex', flexDirection: 'column', gap: 16,
      background: 'linear-gradient(135deg, #171612 0%, #1C1B16 100%)',
      border: '1px solid rgba(201,146,42,0.15)',
      height: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <Stars count={t.stars} />
        <span style={{
          fontSize: 11, padding: '3px 10px', borderRadius: 100,
          background: 'rgba(201,146,42,0.1)', color: '#C9922A', fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          {t.saving}
        </span>
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.72, flex: 1, color: '#C4BCA8', fontStyle: 'italic' }}>
        "{t.text}"
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        paddingTop: 16, borderTop: '1px solid rgba(201,146,42,0.1)',
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #8B6914, #C9922A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: '#0C0B09',
        }}>
          {t.initials}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#FAFAF7' }}>{t.name}</div>
          <div style={{ fontSize: 12, color: '#8A856E' }}>{t.city} · {t.role}</div>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % TESTIMONIALS.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      id="temoignages"
      style={{
        background: '#0C0B09',
        padding: 'clamp(56px,8vw,96px) clamp(20px,5vw,56px)',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}
        >
          <h2 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            color: '#FAFAF7', marginBottom: 12, fontWeight: 400,
          }}>
            Ce que disent nos utilisateurs
          </h2>
          <p style={{
            fontFamily: 'var(--font-arabic), serif',
            fontSize: 20, color: '#C9922A', direction: 'rtl', display: 'block',
          }}>
            ما يقوله مستخدمونا
          </p>
        </motion.div>

        {/* Desktop grid */}
        <div className="testimonials-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              <motion.div
                style={{ height: '100%' }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <TestimonialCard t={t} />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="testimonials-mobile" style={{ display: 'none', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '100%' }}
            >
              <TestimonialCard t={TESTIMONIALS[activeIndex]} />
            </motion.div>
          </AnimatePresence>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {TESTIMONIALS.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveIndex(i)}
                style={{
                  width: i === activeIndex ? 24 : 8,
                  height: 8, borderRadius: 4,
                  background: i === activeIndex ? '#C9922A' : 'rgba(201,146,42,0.3)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.3s ease',
                }}
                whileTap={{ scale: 0.85 }}
                aria-label={`Témoignage ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .testimonials-desktop { display: none !important; }
          .testimonials-mobile { display: flex !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .testimonials-desktop { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
