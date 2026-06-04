'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const REQUESTS = [
  {
    category: 'Électroménager',
    title: 'Machine à laver LG 9kg — programme rapide 15min, livraison Casablanca',
    budget: '4 000 – 5 000 MAD',
    offers: 5,
    time: 'Il y a 2 min',
    icon: '⚡',
    urgent: true,
  },
  {
    category: 'Informatique',
    title: 'MacBook Pro M3 14" — 512GB SSD, garantie 1 an minimum, neuf',
    budget: '18 000 – 22 000 MAD',
    offers: 3,
    time: 'Il y a 5 min',
    icon: '💻',
    urgent: false,
  },
  {
    category: 'BTP',
    title: '50m² carrelage marbre blanc Carrare 60×60, pose incluse Rabat-Salé',
    budget: '15 000 MAD',
    offers: 7,
    time: 'Il y a 8 min',
    icon: '🏗️',
    urgent: false,
  },
  {
    category: 'Automobile',
    title: 'Pneus Michelin Pilot Sport 4 — 205/55R16 × 4, montage et équilibrage inclus',
    budget: '3 200 MAD',
    offers: 4,
    time: 'Il y a 12 min',
    icon: '🚗',
    urgent: false,
  },
  {
    category: 'Services',
    title: 'Plombier urgence — fuite importante sous évier cuisine, Marrakech Guéliz',
    budget: '500 MAD',
    offers: 8,
    time: 'Il y a 3 min',
    icon: '🔧',
    urgent: true,
  },
  {
    category: 'B2B',
    title: '500 chaises pliantes événementiel — livraison J+2 Tanger, bon de commande fourni',
    budget: '25 000 MAD',
    offers: 2,
    time: 'Il y a 18 min',
    icon: '🏢',
    urgent: false,
  },
]

function RequestCard({ req, index }: { req: typeof REQUESTS[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        style={{
          padding: 'clamp(16px, 3vw, 22px)',
          borderRadius: 18,
          display: 'flex', flexDirection: 'column', gap: 14,
          background: '#FFFFFF', border: '1px solid #E8E0CC',
          cursor: 'pointer',
        }}
        whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)', borderColor: '#C9922A' }}
        transition={{ duration: 0.28 }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>{req.icon}</span>
            <span style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 100, fontWeight: 600,
              background: 'rgba(201,146,42,0.1)', color: '#C9922A',
            }}>
              {req.category}
            </span>
            {req.urgent && (
              <span style={{
                fontSize: 10, padding: '3px 8px', borderRadius: 100, fontWeight: 700,
                background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                letterSpacing: '0.04em',
              }}>
                URGENT
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <motion.div
              style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }}
              animate={{ opacity: [1, 0.25, 1], scale: [1, 1.25, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', letterSpacing: '0.04em' }}>EN DIRECT</span>
          </div>
        </div>

        {/* Title */}
        <p style={{ fontSize: 13, fontWeight: 500, color: '#0C0B09', lineHeight: 1.6 }}>
          {req.title}
        </p>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 12, borderTop: '1px solid #E8E0CC',
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#8A856E', marginBottom: 2 }}>Budget</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#C9922A' }}>{req.budget}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0C0B09' }}>
              {req.offers} offre{req.offers > 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: 11, color: '#8A856E' }}>{req.time}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function LiveRequests() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <section style={{
      background: '#FAFAF7',
      padding: 'clamp(56px,8vw,96px) clamp(20px,5vw,56px)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,56px)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            <motion.div
              style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }}
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              En direct maintenant
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            color: '#0C0B09', marginBottom: 12, fontWeight: 400,
          }}>
            En ce moment sur TABIT
          </h2>
          <p style={{
            fontFamily: 'var(--font-arabic), serif',
            fontSize: 18, color: '#C9922A', direction: 'rtl', display: 'block', marginBottom: 12,
          }}>
            الآن على ثابت
          </p>
          <p style={{ fontSize: 15, color: '#8A856E', maxWidth: 420, margin: '0 auto' }}>
            Des milliers de demandes actives attendent vos offres en ce moment
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(12px, 2vw, 20px)',
          marginBottom: 40,
        }}>
          {REQUESTS.map((req, i) => (
            <RequestCard key={req.title} req={req} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}
        >
          <motion.a
            href="/dashboard/buyer/requests"
            style={{
              padding: 'clamp(12px,3vw,16px) clamp(20px,5vw,32px)',
              borderRadius: 12, fontWeight: 600, fontSize: 14,
              border: '1.5px solid #C9922A', color: '#C9922A', background: 'transparent',
              textDecoration: 'none', minHeight: 50,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flex: '1 1 auto', maxWidth: 280,
            }}
            whileHover={{ background: 'rgba(201,146,42,0.08)', scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Voir toutes les demandes →
          </motion.a>
          <motion.a
            href="/dashboard/buyer/requests/new"
            style={{
              padding: 'clamp(12px,3vw,16px) clamp(20px,5vw,32px)',
              borderRadius: 12, fontWeight: 700, fontSize: 14,
              background: 'linear-gradient(135deg, #C9922A, #E8B84B)',
              color: '#0C0B09', textDecoration: 'none', minHeight: 50,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(201,146,42,0.35)',
              flex: '1 1 auto', maxWidth: 280,
            }}
            whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(201,146,42,0.5)' }}
            whileTap={{ scale: 0.97 }}
          >
            Publier ma demande →
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
