'use client'

import { motion } from 'framer-motion'

const ROW1 = [
  'Électroménager', 'Informatique', 'Téléphonie', 'Ameublement', 'Décoration',
  'Automobile', 'Pièces détachées', 'BTP', 'Matériaux', 'Plomberie',
  'Électricité', 'Climatisation', 'Bijouterie', 'Montres', 'Mode',
  'Textile', 'Chaussures', 'Maroquinerie', 'Événementiel', 'Traiteur',
]

const ROW2 = [
  'Alimentaire', 'Épicerie', 'Services', 'Consulting', 'Juridique',
  'Comptabilité', 'RH', 'Logistique', 'Transport', 'Agriculture',
  'Tourisme', 'Hôtellerie', 'Santé', 'Beauté', 'Informatique B2B',
  'Sécurité', 'Nettoyage', 'Menuiserie', 'Peinture', 'Carrelage',
]

function MarqueeTrack({ items, direction }: { items: string[]; direction: 'left' | 'right' }) {
  const doubled = [...items, ...items, ...items, ...items]
  const dist = direction === 'left' ? '-50%' : '0%'
  const start = direction === 'left' ? '0%' : '-50%'

  return (
    <div style={{ overflow: 'hidden', padding: '10px 0' }}>
      <motion.div
        style={{ display: 'flex', whiteSpace: 'nowrap', gap: 0 }}
        animate={{ x: [start, dist] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '0 14px' }}>
            <span style={{
              fontSize: 'clamp(11px, 1.5vw, 13px)',
              fontWeight: 400, letterSpacing: '0.04em',
              color: '#8A856E', textTransform: 'uppercase',
            }}>
              {item}
            </span>
            <span style={{ color: 'rgba(201,146,42,0.5)', fontSize: 7 }}>◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function Marquee() {
  return (
    <div style={{ background: '#111110', overflow: 'hidden', padding: '4px 0' }}>
      <div style={{ borderBottom: '1px solid rgba(201,146,42,0.08)' }}>
        <MarqueeTrack items={ROW1} direction="left" />
      </div>
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,146,42,0.15), transparent)' }} />
      <MarqueeTrack items={ROW2} direction="right" />
    </div>
  )
}
