'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const BLOCKS = [
  {
    icon: '🔐',
    title: 'Vérification manuelle 100%',
    arabic: 'توثيق يدوي كامل',
    desc: "Chaque commerçant passe par un processus de vérification rigoureux de notre équipe : patente commerciale valide, registre de commerce, CIN, vérification d'adresse physique. Ce processus prend 24 à 48h. Aucun anonyme ne peut faire d'offres sur TABIT.",
  },
  {
    icon: '💳',
    title: 'Paiement 100% sécurisé',
    arabic: 'دفع آمن بالكامل',
    desc: "Transactions chiffrées SSL 256 bits. Notre système d'escrow optionnel protège votre argent jusqu'à confirmation de réception. Remboursement intégral garanti en cas de litige confirmé par notre équipe médiation.",
  },
  {
    icon: '🛡️',
    title: 'Protection acheteur totale',
    arabic: 'حماية كاملة للمشتري',
    desc: "Si le produit livré ne correspond pas à l'offre acceptée — mauvais modèle, défaut caché, non-livraison — contactez notre support dans les 48h. Notre équipe médiation intervient immédiatement et déclenche un remboursement sous 72h.",
  },
  {
    icon: '🔒',
    title: 'Données personnelles protégées',
    arabic: 'بيانات شخصية محمية',
    desc: "Vos coordonnées (téléphone, email, adresse exacte) restent masquées tout au long des échanges. Conformité totale avec la loi 09-08 sur la protection des données personnelles au Maroc. Vos données ne sont jamais vendues.",
  },
  {
    icon: '⭐',
    title: 'Notation transparente & vérifiée',
    arabic: 'تقييم شفاف وموثوق',
    desc: "Après chaque transaction confirmée, acheteur ET commerçant se notent mutuellement sur 5 étoiles. Notes vérifiées, impossible à falsifier après 24h. Les commerçants sous 3.5/5 sont mis sous surveillance. Historique complet consultable.",
  },
  {
    icon: '📞',
    title: 'Support humain 7j/7',
    arabic: 'دعم بشري ٧ أيام',
    desc: "Une équipe marocaine disponible 7 jours sur 7 par chat en direct, email et téléphone. Temps de réponse moyen : 12 minutes. Maîtrise du français, de l'arabe classique et de la darija pour vous accompagner dans votre langue.",
  },
]

function TrustBlock({ block, index }: { block: typeof BLOCKS[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        style={{
          height: '100%',
          padding: 'clamp(20px, 3vw, 28px)',
          borderRadius: 18,
          background: '#FFFFFF', border: '1px solid #E8E0CC',
        }}
        whileHover={{ borderColor: '#C9922A', y: -4, boxShadow: '0 16px 48px rgba(201,146,42,0.1)' }}
        transition={{ duration: 0.28 }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 28 }}>{block.icon}</div>
          <span style={{
            fontFamily: 'var(--font-arabic), serif',
            fontSize: 11, color: '#C9922A', direction: 'rtl',
            textAlign: 'right', marginTop: 4,
          }}>
            {block.arabic}
          </span>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 'clamp(16px, 2.5vw, 19px)',
          fontWeight: 600, color: '#0C0B09', marginBottom: 12, lineHeight: 1.35,
        }}>
          {block.title}
        </h3>
        <p style={{ fontSize: 13, lineHeight: 1.72, color: '#8A856E' }}>
          {block.desc}
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function Trust() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section
      id="confiance"
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
            Votre confiance, notre priorité absolue
          </h2>
          <p style={{
            fontFamily: 'var(--font-arabic), serif',
            fontSize: 20, color: '#C9922A', direction: 'rtl', display: 'block', marginBottom: 16,
          }}>
            ثقتكم هي أولويتنا
          </p>
          <p style={{ fontSize: 15, color: '#8A856E', maxWidth: 480, margin: '0 auto' }}>
            Sécurité, transparence et protection — les trois piliers qui rendent TABIT différent
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(16px, 2vw, 24px)',
        }}>
          {BLOCKS.map((b, i) => (
            <TrustBlock key={b.title} block={b} index={i} />
          ))}
        </div>

        {/* Trust banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            marginTop: 40,
            padding: 'clamp(20px, 4vw, 28px) clamp(24px, 5vw, 40px)',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #0C0B09, #171612)',
            border: '1px solid rgba(201,146,42,0.2)',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(16px, 4vw, 40px)',
            textAlign: 'center',
          }}
        >
          {[
            { label: 'Loi 09-08 conforme', icon: '⚖️' },
            { label: 'SSL 256 bits', icon: '🔒' },
            { label: 'Équipe basée au Maroc', icon: '🇲🇦' },
            { label: 'Support 7j/7 en darija', icon: '💬' },
            { label: '98% satisfaction client', icon: '⭐' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#C4BCA8', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
