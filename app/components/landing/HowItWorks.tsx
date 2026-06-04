'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const STEPS = [
  {
    number: '01',
    title: 'Publiez votre besoin',
    subtitle: 'en 30 secondes, gratuit',
    arabic: 'انشر طلبك في ٣٠ ثانية',
    desc: 'Décrivez précisément ce que vous cherchez : produit, marque, modèle, quantité, budget maximum, ville de livraison, délai souhaité. Ajoutez des photos de référence. Spécifiez vos conditions de paiement.',
    bullets: [
      'Gratuit, sans inscription obligatoire',
      'Visible par 2 400+ commerçants instantanément',
      'Modifiable et annulable à tout moment',
    ],
    color: '#C9922A',
  },
  {
    number: '02',
    title: 'Recevez les offres',
    subtitle: 'les commerçants se concurrencent',
    arabic: 'التجار يتنافسون من أجلك',
    desc: 'Chaque commerçant vérifié dans votre catégorie reçoit une notification instantanée. Ils vous soumettent leur meilleure offre : prix TTC, délai de livraison, garanties. La concurrence joue en votre faveur.',
    bullets: [
      'Offres fermes et engageantes avec garanties',
      'Prix incluant livraison et installation',
      'Notes et avis vérifiés pour chaque commerçant',
    ],
    color: '#B8791A',
  },
  {
    number: '03',
    title: 'Comparez et négociez',
    subtitle: 'données personnelles masquées',
    arabic: 'قارن وتواصل وفاوض',
    desc: 'Notre tableau de bord présente toutes les offres côte à côte. Utilisez le chat sécurisé pour poser des questions, demander des photos supplémentaires, négocier les conditions. Vos coordonnées restent masquées.',
    bullets: [
      'Comparaison visuelle instantanée de toutes les offres',
      'Chat sécurisé avec filtrage automatique des contacts',
      'Historique complet des échanges conservé',
    ],
    color: '#C9922A',
  },
  {
    number: '04',
    title: 'Achetez en sécurité',
    subtitle: '5% commission sur succès seulement',
    arabic: 'اقبل واشترِ بأمان تام',
    desc: "Une fois votre offre choisie, TABIT sécurise la transaction. Paiement protégé, livraison suivie, médiation en cas de litige. Notre commission de 5% est prélevée uniquement sur transaction confirmée.",
    bullets: [
      'Paiement sécurisé — protection acheteur garantie',
      'Suivi de livraison en temps réel',
      'Médiation gratuite — remboursement sous 72h si litige',
    ],
    color: '#B8791A',
  },
]

function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative' }}
    >
      {/* Connecting line (desktop only) */}
      {index < STEPS.length - 1 && (
        <div className="step-connector" style={{
          position: 'absolute',
          top: 28, left: '100%',
          width: '100%', height: 1,
          background: 'linear-gradient(90deg, rgba(201,146,42,0.4), rgba(201,146,42,0.1))',
          zIndex: 0,
          transform: 'translateX(-24px)',
        }} />
      )}

      <motion.div
        style={{
          height: '100%',
          padding: 'clamp(20px, 3vw, 28px)',
          borderRadius: 20,
          background: '#FFFFFF',
          border: '1px solid #E8E0CC',
          display: 'flex', flexDirection: 'column', gap: 16,
          position: 'relative', zIndex: 1,
        }}
        whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(201,146,42,0.12)', borderColor: '#C9922A' }}
        transition={{ duration: 0.3 }}
      >
        {/* Step number */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(201,146,42,0.12), rgba(201,146,42,0.06))',
            border: '1px solid rgba(201,146,42,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 18, fontWeight: 700, color: '#C9922A',
            flexShrink: 0,
          }}>
            {step.number}
          </div>
          <span style={{
            fontFamily: 'var(--font-arabic), serif',
            fontSize: 11, color: 'rgba(201,146,42,0.6)', direction: 'rtl', textAlign: 'right',
            paddingTop: 4,
          }}>
            {step.arabic}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(17px, 2.5vw, 22px)',
            fontWeight: 600, color: '#0C0B09', lineHeight: 1.3, marginBottom: 4,
          }}>
            {step.title}
          </h3>
          <p style={{ fontSize: 12, color: '#C9922A', fontWeight: 500, letterSpacing: '0.02em' }}>
            {step.subtitle}
          </p>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, lineHeight: 1.7, color: '#8A856E', flex: 1 }}>
          {step.desc}
        </p>

        {/* Bullets */}
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {step.bullets.map((b) => (
            <li key={b} style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              fontSize: 13, color: '#0C0B09', lineHeight: 1.5,
            }}>
              <span style={{ color: '#C9922A', fontSize: 12, marginTop: 1, flexShrink: 0 }}>✓</span>
              {b}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}

export default function HowItWorks() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section
      id="how-it-works"
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
          style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}
        >
          <h2 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            color: '#0C0B09', marginBottom: 12, fontWeight: 400,
          }}>
            Comment ça marche
          </h2>
          <p style={{
            fontFamily: 'var(--font-arabic), serif',
            fontSize: 20, color: '#C9922A', direction: 'rtl',
            display: 'block', marginBottom: 16,
          }}>
            كيف يعمل ثابت
          </p>
          <p style={{ fontSize: 16, color: '#8A856E', maxWidth: 500, margin: '0 auto' }}>
            4 étapes simples pour obtenir le meilleur prix sans bouger de chez vous
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'clamp(16px, 2vw, 24px)',
          position: 'relative',
        }}>
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>

        {/* Mobile step indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}
          className="step-dots"
        >
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === 0 ? 20 : 6, height: 6, borderRadius: 3,
              background: i === 0 ? '#C9922A' : 'rgba(201,146,42,0.3)',
              transition: 'all 0.3s',
            }} />
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .step-connector { display: none !important; }
        }
        @media (min-width: 768px) {
          .step-dots { display: none !important; }
        }
      `}</style>
    </section>
  )
}
