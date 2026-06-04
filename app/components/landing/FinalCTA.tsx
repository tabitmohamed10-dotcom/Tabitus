'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 6,
    opacity: Math.random() * 0.35 + 0.05,
  }))
}

export default function FinalCTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })
  const [particles, setParticles] = useState<ReturnType<typeof generateParticles>>([])

  useEffect(() => {
    setParticles(generateParticles(window.innerWidth < 768 ? 25 : 60))
  }, [])

  const benefits = [
    { icon: '✓', text: 'Gratuit pour les acheteurs' },
    { icon: '✓', text: 'Sans engagement, sans carte' },
    { icon: '⚡', text: 'Première offre en 5 minutes' },
    { icon: '🛡️', text: 'Protection acheteur garantie' },
  ]

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', background: '#0C0B09',
      padding: 'clamp(60px, 10vw, 100px) clamp(24px, 5vw, 56px)',
    }}>
      {/* Animated particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              borderRadius: '50%', background: '#C9922A', opacity: p.opacity,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.sin(p.id * 0.5) * 20, 0],
              opacity: [p.opacity, p.opacity * 2.2, p.opacity],
            }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Gradient mesh background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 70% 55% at 30% 50%, rgba(201,146,42,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 55% 40% at 75% 60%, rgba(139,105,20,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 50% at 50% 10%, rgba(201,146,42,0.04) 0%, transparent 50%)
        `,
      }} />

      {/* Gold ring decoration */}
      <div style={{
        position: 'absolute',
        width: 'clamp(300px, 60vw, 600px)', height: 'clamp(300px, 60vw, 600px)',
        border: '1px solid rgba(201,146,42,0.06)',
        borderRadius: '50%',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 'clamp(500px, 90vw, 900px)', height: 'clamp(500px, 90vw, 900px)',
        border: '1px solid rgba(201,146,42,0.035)',
        borderRadius: '50%',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 860, margin: '0 auto', width: '100%' }}
      >
        {/* Pre-headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ marginBottom: 24 }}
        >
          <span style={{
            display: 'inline-block',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#C9922A',
            padding: '6px 16px', borderRadius: 100,
            border: '1px solid rgba(201,146,42,0.3)',
            background: 'rgba(201,146,42,0.08)',
          }}>
            2 400+ commerçants attendent votre demande
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15 }}
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(56px, 12vw, 116px)',
            lineHeight: 1, fontWeight: 400, color: '#FAFAF7', marginBottom: 8,
          }}
        >
          Prêt ?
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.28 }}
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(26px, 5vw, 52px)',
            lineHeight: 1.2, marginBottom: 24,
            background: 'linear-gradient(135deg, #8B6914 0%, #C9922A 40%, #F0D080 70%, #C9922A 85%, #8B6914 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            display: 'block',
          }}
        >
          Le marché vous attend.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{
            fontFamily: 'var(--font-arabic), serif',
            fontSize: 'clamp(16px, 2.5vw, 22px)',
            color: '#8A856E', marginBottom: 48,
            direction: 'rtl', display: 'block',
          }}
        >
          ثابت — السوق يعمل من أجلك
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.52 }}
          style={{
            display: 'flex', flexWrap: 'wrap', gap: 14,
            justifyContent: 'center', marginBottom: 40,
          }}
        >
          <motion.a
            href="/auth/register"
            style={{
              padding: 'clamp(14px,3vw,18px) clamp(28px,6vw,48px)',
              borderRadius: 14, fontWeight: 700, fontSize: 'clamp(14px,2vw,17px)',
              background: 'linear-gradient(135deg, #C9922A, #E8B84B)',
              color: '#0C0B09', textDecoration: 'none',
              boxShadow: '0 6px 32px rgba(201,146,42,0.45)',
              minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flex: '1 1 auto', maxWidth: 300,
            }}
            whileHover={{ scale: 1.06, boxShadow: '0 12px 48px rgba(201,146,42,0.6)' }}
            whileTap={{ scale: 0.97 }}
          >
            Déposer ma demande
          </motion.a>
          <motion.a
            href="/auth/register?type=merchant"
            style={{
              padding: 'clamp(14px,3vw,18px) clamp(28px,6vw,48px)',
              borderRadius: 14, fontWeight: 600, fontSize: 'clamp(14px,2vw,17px)',
              border: '1.5px solid #C9922A', color: '#C9922A', background: 'transparent',
              textDecoration: 'none',
              minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flex: '1 1 auto', maxWidth: 300,
            }}
            whileHover={{ scale: 1.06, background: 'rgba(201,146,42,0.1)' }}
            whileTap={{ scale: 0.97 }}
          >
            Inscrire mon commerce
          </motion.a>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.65 }}
          style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
            gap: 'clamp(8px, 2vw, 24px)',
          }}
        >
          {benefits.map((b) => (
            <span key={b.text} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 'clamp(12px, 1.5vw, 14px)', color: '#8A856E',
            }}>
              <span style={{ color: '#C9922A', fontWeight: 700 }}>{b.icon}</span>
              {b.text}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
