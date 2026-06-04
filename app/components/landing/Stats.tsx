'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'

const STATS = [
  {
    icon: '✦',
    number: 2400,
    suffix: '+',
    prefix: '',
    title: 'Commerçants vérifiés',
    arabic: 'تجار موثوقون',
    desc: "Chaque commerçant est audité manuellement — patente, RC, CIN, adresse vérifiée. Aucun anonyme.",
  },
  {
    icon: '◈',
    number: 18000,
    suffix: '+',
    prefix: '',
    title: 'Transactions réalisées',
    arabic: 'معاملات ناجحة',
    desc: "Des milliers d'acheteurs ont déjà économisé grâce à TABIT. Chaque transaction est suivie.",
  },
  {
    icon: '⚡',
    number: 5,
    suffix: ' min',
    prefix: '< ',
    title: 'Première offre reçue',
    arabic: 'أول عرض في ٥ دقائق',
    desc: "Notre réseau réactif de commerçants garantit une réponse ultra-rapide dès la publication.",
  },
  {
    icon: '◇',
    number: 5,
    suffix: '%',
    prefix: '',
    title: 'Commission seulement',
    arabic: 'عمولة ٥٪ فقط',
    desc: "Payée uniquement sur transaction confirmée. Jamais à l'avance. Toujours transparente.",
  },
  {
    icon: '◉',
    number: 30,
    suffix: '+',
    prefix: '',
    title: 'Villes couvertes',
    arabic: '٣٠+ مدينة',
    desc: "De Tanger à Laayoune, de Casablanca à Oujda — tout le Royaume est connecté.",
  },
  {
    icon: '★',
    number: 98,
    suffix: '%',
    prefix: '',
    title: 'Satisfaction client',
    arabic: 'رضا العملاء',
    desc: "Note moyenne des acheteurs après transaction confirmée. Vérifiée et impossible à falsifier.",
  },
]

function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        style={{
          height: '100%',
          padding: 'clamp(24px,4vw,32px)',
          borderRadius: 20,
          display: 'flex', flexDirection: 'column', gap: 16,
          background: 'linear-gradient(135deg, #171612 0%, #1C1B16 100%)',
          border: '1px solid rgba(201,146,42,0.13)',
          cursor: 'default',
        }}
        whileHover={{
          y: -6,
          borderColor: 'rgba(201,146,42,0.38)',
          boxShadow: '0 20px 60px rgba(201,146,42,0.1)',
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#C9922A', fontSize: 22 }}>{stat.icon}</span>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(201,146,42,0.08)',
            border: '1px solid rgba(201,146,42,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'rgba(201,146,42,0.5)', fontSize: 8 }}>◆</span>
          </div>
        </div>

        <div>
          <div style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700, lineHeight: 1, color: '#C9922A', marginBottom: 6,
          }}>
            {inView ? (
              <CountUp
                start={0}
                end={stat.number}
                duration={2.5}
                separator=" "
                prefix={stat.prefix}
                suffix={stat.suffix}
                useEasing
              />
            ) : (
              <span>{stat.prefix}0{stat.suffix}</span>
            )}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#FAFAF7' }}>{stat.title}</div>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-arabic), serif',
            fontSize: 13, color: '#C9922A', direction: 'rtl',
          }}
        >
          {stat.arabic}
        </div>

        <div style={{ fontSize: 13, lineHeight: 1.65, color: '#8A856E', marginTop: 'auto' }}>
          {stat.desc}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Stats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section
      style={{
        background: '#0C0B09',
        padding: 'clamp(56px,8vw,96px) clamp(20px,5vw,56px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Gold grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.035, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(201,146,42,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,146,42,0.5) 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
            TABIT en chiffres
          </h2>
          <p style={{
            fontFamily: 'var(--font-arabic), serif',
            fontSize: 18, color: '#C9922A', direction: 'rtl',
            display: 'block',
          }}>
            ثابت بالأرقام
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(16px, 2vw, 24px)',
        }}>
          {STATS.map((stat, i) => (
            <StatCard key={stat.title} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
