'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.45 + 0.1,
  }))
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = useState<ReturnType<typeof generateParticles>>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    setParticles(generateParticles(mobile ? 30 : 80))
  }, [])

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const stats = [
    { num: '2 400+', label: 'Commerçants', ar: 'تجار' },
    { num: '18 000+', label: 'Transactions', ar: 'معاملة' },
    { num: '< 5 min', label: '1ère offre', ar: 'عرض' },
    { num: '5%', label: 'Commission', ar: 'عمولة' },
    { num: '30+', label: 'Villes', ar: 'مدينة' },
    { num: '98%', label: 'Satisfaction', ar: 'رضا' },
  ]

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative', minHeight: '100svh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', background: '#0C0B09',
      }}
    >
      {/* Gold particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              borderRadius: '50%',
              background: '#C9922A',
              opacity: p.opacity,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(p.id * 0.7) * 12, 0],
              opacity: [p.opacity, p.opacity * 1.8, p.opacity],
            }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Radial gold glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 55% at 50% 42%, rgba(201,146,42,0.09) 0%, transparent 68%)',
      }} />

      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: `linear-gradient(rgba(201,146,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,146,42,1) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      <motion.div
        style={{ y, opacity, position: 'relative', zIndex: 10, width: '100%' }}
      >
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: 'clamp(80px,14vw,120px) clamp(24px,5vw,56px) clamp(40px,6vw,64px)',
          textAlign: 'center',
        }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(201,146,42,0.12)', border: '1px solid rgba(201,146,42,0.3)',
              borderRadius: 100, padding: '6px 16px',
              fontSize: 12, fontWeight: 600, color: '#C9922A', letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              <motion.span
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9922A', display: 'inline-block' }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Marketplace inversée • Maroc
            </span>
          </motion.div>

          {/* Main headline */}
          <div style={{ marginBottom: 24 }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(40px, 8vw, 80px)',
                lineHeight: 1.05, fontWeight: 400,
                color: '#FAFAF7', marginBottom: 0,
              }}
            >
              Le marché
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(48px, 10vw, 100px)',
                lineHeight: 1, fontWeight: 400,
                background: 'linear-gradient(135deg, #8B6914 0%, #C9922A 35%, #F0D080 65%, #C9922A 80%, #8B6914 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                display: 'block',
              }}
            >
              travaille
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(40px, 8vw, 80px)',
                lineHeight: 1.1, fontWeight: 400, color: '#FAFAF7',
              }}
            >
              pour vous.
            </motion.div>
          </div>

          {/* Arabic subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            dir="rtl"
            style={{
              fontFamily: 'var(--font-arabic), serif',
              fontSize: 'clamp(15px, 2.5vw, 20px)',
              color: '#C9922A', marginBottom: 16, letterSpacing: '0.02em',
            }}
          >
            السوق يعمل من أجلك — Prix fixes · Confiance garantie
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: '#C4BCA8', lineHeight: 1.7,
              maxWidth: 640, margin: '0 auto 40px',
            }}
          >
            La première marketplace inversée du Maroc. Publiez votre besoin, recevez les meilleures offres des 2 400+ commerçants vérifiés. Électroménager, informatique, automobile, BTP, bijouterie — si ça existe au Maroc, TABIT vous le trouve au meilleur prix.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 12, marginBottom: 56,
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', width: '100%' }}>
              <motion.a
                href="/auth/register"
                style={{
                  background: 'linear-gradient(135deg, #C9922A, #E8B84B)',
                  color: '#0C0B09', textDecoration: 'none',
                  padding: 'clamp(14px,3vw,18px) clamp(24px,5vw,40px)',
                  borderRadius: 12, fontWeight: 700, fontSize: 'clamp(14px,2vw,16px)',
                  minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(201,146,42,0.4)',
                  flex: '1 1 auto', maxWidth: 280,
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 8px 36px rgba(201,146,42,0.55)' }}
                whileTap={{ scale: 0.97 }}
              >
                Déposer ma demande — Gratuit
              </motion.a>
              <motion.a
                href="/auth/register?type=merchant"
                style={{
                  border: '1.5px solid #C9922A', color: '#C9922A', background: 'transparent',
                  textDecoration: 'none',
                  padding: 'clamp(14px,3vw,18px) clamp(24px,5vw,40px)',
                  borderRadius: 12, fontWeight: 600, fontSize: 'clamp(14px,2vw,16px)',
                  minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flex: '1 1 auto', maxWidth: 280,
                }}
                whileHover={{ scale: 1.05, background: 'rgba(201,146,42,0.08)', boxShadow: '0 0 0 1px #C9922A' }}
                whileTap={{ scale: 0.97 }}
              >
                Je suis commerçant →
              </motion.a>
            </div>
            <p style={{ fontSize: 12, color: '#8A856E', marginTop: 4 }}>
              Gratuit · Sans engagement · Réponse en 5 minutes
            </p>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            style={{
              borderTop: '1px solid rgba(201,146,42,0.15)',
              paddingTop: 32,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'clamp(16px, 3vw, 0px)',
            }}
            className="hero-stats"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.08, duration: 0.5 }}
                style={{ textAlign: 'center', padding: '8px 4px' }}
              >
                <div style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700,
                  color: '#C9922A', lineHeight: 1.1,
                }}>{s.num}</div>
                <div style={{ fontSize: 11, color: '#8A856E', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(201,146,42,0.6)', fontFamily: 'var(--font-arabic), serif' }} dir="rtl">{s.ar}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll arrow — hidden on mobile */}
      <motion.div
        className="hero-scroll-arrow"
        style={{ position: 'absolute', bottom: 32, left: '50%', x: '-50%', zIndex: 10 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="#C9922A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <style>{`
        @media (max-width: 767px) {
          .hero-scroll-arrow { display: none !important; }
          .hero-stats { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 768px) {
          .hero-stats { grid-template-columns: repeat(6, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
