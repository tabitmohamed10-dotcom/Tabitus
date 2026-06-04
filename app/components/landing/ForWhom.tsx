'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const PROFILES = [
  {
    icon: '◈',
    badge: 'PARTICULIERS',
    title: 'Particuliers',
    arabic: 'الأفراد',
    arabicDesc: 'اشترِ بثقة وبأفضل الأسعار',
    desc: "Vous en avez assez de courir les magasins, de comparer les prix sur dix sites différents, de vous faire avoir par des vendeurs peu scrupuleux ? TABIT vous redonne le pouvoir. Décrivez ce que vous cherchez, et laissez les commerçants venir à vous avec leurs meilleures offres — en moins de 5 minutes.",
    uses: [
      'Électroménager & Hi-Fi',
      'Rénovation maison',
      'Achat véhicule & pneus',
      'Téléphonie & Informatique',
      'Meubles & Décoration',
      'Événements familiaux',
      'Fournitures scolaires',
      'Équipements sportifs',
    ],
    cta: 'Déposer ma demande',
    href: '/auth/register',
    highlight: false,
  },
  {
    icon: '◉',
    badge: 'COMMERÇANTS',
    title: 'Commerçants',
    arabic: 'التجار',
    arabicDesc: 'وسّع تجارتك عبر المغرب كله',
    desc: "Fini d'attendre que les clients franchissent votre seuil. Sur TABIT, vous accédez à des milliers d'acheteurs qualifiés qui cherchent exactement ce que vous vendez — et qui sont prêts à acheter maintenant. Développez votre clientèle, écoulez vos stocks, augmentez votre CA. 5% de commission seulement sur vente confirmée.",
    uses: [
      'Développer votre clientèle nationale',
      'Écouler vos stocks rapidement',
      "Répondre aux appels d'offres",
      'Conquérir de nouvelles villes',
      'Augmenter votre chiffre d\'affaires',
      'Obtenir des avis vérifiés',
      'Construire votre réputation en ligne',
    ],
    cta: 'Inscrire mon commerce',
    href: '/auth/register?type=merchant',
    highlight: true,
  },
  {
    icon: '◇',
    badge: 'ENTREPRISES',
    title: 'Entreprises & Administrations',
    arabic: 'الشركات والإدارات',
    arabicDesc: 'حلول متكاملة للمشتريات المؤسسية',
    desc: "TABIT B2B est la solution pour les achats professionnels à grande échelle. Gérez vos appels d'offres formalisés, centralisez vos achats, obtenez plusieurs devis qualifiés en quelques heures. Idéal pour les PME, grandes entreprises, collectivités locales et administrations publiques marocaines.",
    uses: [
      "Appels d'offres formalisés avec cahier des charges",
      'Multi-utilisateurs & Workflow d\'approbation',
      'Tableau de bord achats centralisé',
      'Historique & Reporting comptable',
      'Facturation professionnelle',
      'NDA & Confidentialité garantis',
      'SLA & Account manager dédié',
    ],
    cta: 'Accès entreprise',
    href: '/auth/register?type=enterprise',
    highlight: false,
  },
]

function ProfileCard({ profile, index }: { profile: typeof PROFILES[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex' }}
    >
      <motion.div
        style={{
          width: '100%',
          padding: 'clamp(24px, 4vw, 36px)',
          borderRadius: 22,
          display: 'flex', flexDirection: 'column', gap: 20,
          background: profile.highlight
            ? 'linear-gradient(135deg, #1C1910 0%, #231F12 100%)'
            : 'linear-gradient(135deg, #171612 0%, #1C1B16 100%)',
          border: profile.highlight
            ? '1.5px solid rgba(201,146,42,0.45)'
            : '1px solid rgba(201,146,42,0.13)',
          position: 'relative', overflow: 'hidden',
        }}
        whileHover={{ y: -5, borderColor: 'rgba(201,146,42,0.5)', boxShadow: '0 24px 64px rgba(201,146,42,0.12)' }}
        transition={{ duration: 0.3 }}
      >
        {profile.highlight && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #C9922A, transparent)',
          }} />
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ color: '#C9922A', fontSize: 34 }}>{profile.icon}</span>
          <span style={{
            fontSize: 10, padding: '4px 10px', borderRadius: 100,
            background: 'rgba(201,146,42,0.12)', color: '#C9922A',
            fontWeight: 700, letterSpacing: '0.08em',
          }}>
            {profile.badge}
          </span>
        </div>

        <div>
          <h3 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(20px, 3vw, 26px)',
            fontWeight: 600, color: '#FAFAF7', marginBottom: 4,
          }}>
            {profile.title}
          </h3>
          <p style={{
            fontFamily: 'var(--font-arabic), serif',
            fontSize: 14, color: '#C9922A', direction: 'rtl',
          }}>
            {profile.arabic}
          </p>
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.75, color: '#8A856E' }}>
          {profile.desc}
        </p>

        <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {profile.uses.map((u) => (
            <li key={u} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#C4BCA8' }}>
              <span style={{ color: '#C9922A', fontSize: 7, marginTop: 5, flexShrink: 0 }}>◆</span>
              {u}
            </li>
          ))}
        </ul>

        <div style={{
          fontFamily: 'var(--font-arabic), serif',
          fontSize: 13, color: '#C9922A', direction: 'rtl',
          textAlign: 'center', padding: '12px 16px', borderRadius: 10,
          background: 'rgba(201,146,42,0.08)', border: '1px solid rgba(201,146,42,0.15)',
        }}>
          {profile.arabicDesc}
        </div>

        <motion.a
          href={profile.href}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '14px 24px', borderRadius: 12,
            background: profile.highlight ? 'linear-gradient(135deg, #C9922A, #E8B84B)' : 'transparent',
            border: profile.highlight ? 'none' : '1.5px solid #C9922A',
            color: profile.highlight ? '#0C0B09' : '#C9922A',
            textDecoration: 'none', fontWeight: 700, fontSize: 14,
            minHeight: 50,
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: profile.highlight ? '0 8px 32px rgba(201,146,42,0.4)' : '0 0 0 1px #C9922A',
            background: profile.highlight ? 'linear-gradient(135deg, #C9922A, #E8B84B)' : 'rgba(201,146,42,0.08)',
          }}
          whileTap={{ scale: 0.97 }}
        >
          {profile.cta} →
        </motion.a>
      </motion.div>
    </motion.div>
  )
}

export default function ForWhom() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section style={{
      background: '#0C0B09',
      padding: 'clamp(56px,8vw,96px) clamp(20px,5vw,56px)',
    }}>
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
            TABIT est fait pour vous
          </h2>
          <p style={{
            fontFamily: 'var(--font-arabic), serif',
            fontSize: 20, color: '#C9922A', direction: 'rtl', display: 'block',
          }}>
            ثابت صُنع من أجلك
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(16px, 2vw, 24px)',
        }}>
          {PROFILES.map((p, i) => (
            <ProfileCard key={p.title} profile={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
