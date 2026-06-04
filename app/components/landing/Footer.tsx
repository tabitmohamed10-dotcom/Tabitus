'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'

const COLUMNS = [
  {
    title: 'À propos',
    links: [
      { label: 'Notre mission', href: '/#how-it-works' },
      { label: 'Marché Libre', href: '/marche-libre' },
      { label: 'Presse & Médias', href: 'mailto:presse@tabit.ma' },
      { label: 'Investisseurs', href: 'mailto:invest@tabit.ma' },
      { label: 'Carrières', href: 'mailto:jobs@tabit.ma' },
      { label: 'Blog TABIT', href: '/#faq' },
    ],
  },
  {
    title: 'Acheteurs',
    links: [
      { label: '🏪 Marché Libre', href: '/marche-libre' },
      { label: 'Comment ça marche', href: '/#how-it-works' },
      { label: 'Déposer une demande', href: '/auth/register' },
      { label: 'Catégories', href: '/#categories' },
      { label: 'Protection acheteur', href: '/#confiance' },
      { label: 'FAQ Acheteurs', href: '/#faq' },
    ],
  },
  {
    title: 'Commerçants',
    links: [
      { label: 'S\'inscrire comme commerçant', href: '/auth/register?role=merchant' },
      { label: 'Tarifs & Commission', href: '/#faq' },
      { label: 'Comment vendre sur TABIT', href: '/#how-it-works' },
      { label: 'Processus de vérification', href: '/#confiance' },
      { label: 'Support commerçants', href: 'mailto:support@tabit.ma' },
      { label: 'Success stories', href: '/#temoignages' },
    ],
  },
  {
    title: 'Entreprises',
    links: [
      { label: 'TABIT B2B', href: '/auth/register?role=merchant' },
      { label: 'Appels d\'offres', href: '/marche-libre' },
      { label: 'API & Intégrations', href: 'mailto:api@tabit.ma' },
      { label: 'Partenariats', href: 'mailto:partenaires@tabit.ma' },
      { label: 'Contactez les ventes', href: 'mailto:sales@tabit.ma' },
      { label: 'Cas d\'usage PME', href: '/#temoignages' },
    ],
  },
  {
    title: 'Légal & Contact',
    links: [
      { label: 'CGU & CGV', href: 'mailto:legal@tabit.ma' },
      { label: 'Politique de confidentialité', href: 'mailto:privacy@tabit.ma' },
      { label: 'Gestion des cookies', href: '/' },
      { label: 'Mentions légales', href: '/' },
      { label: 'Nous contacter', href: 'mailto:contact@tabit.ma' },
      { label: 'Signaler un problème', href: 'mailto:support@tabit.ma' },
    ],
  },
]

const SOCIALS = [
  { name: 'LinkedIn', icon: 'in', href: '#' },
  { name: 'Instagram', icon: '◈', href: '#' },
  { name: 'Facebook', icon: 'f', href: '#' },
  { name: 'X / Twitter', icon: '✕', href: '#' },
  { name: 'YouTube', icon: '▶', href: '#' },
]

function MobileColumn({ col }: { col: typeof COLUMNS[0] }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(201,146,42,0.1)' }}>
      <motion.button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer',
          minHeight: 52,
        }}
        whileTap={{ scale: 0.99 }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: '#C9922A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {col.title}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ color: '#C9922A', fontSize: 18 }}
        >+</motion.span>
      </motion.button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden', paddingBottom: 12 }}
          >
            {col.links.map((link) => (
              <a key={link.label} href={link.href} style={{
                display: 'block', padding: '8px 0', fontSize: 14, color: '#8A856E',
                textDecoration: 'none',
              }}>
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Footer() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (email.includes('@')) setSubscribed(true)
  }

  return (
    <footer style={{ background: '#0C0B09', borderTop: '1px solid rgba(201,146,42,0.15)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(48px, 8vw, 72px) clamp(20px, 5vw, 56px) clamp(24px, 4vw, 40px)' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Desktop grid */}
          <div className="footer-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 32, marginBottom: 56 }}>
            {/* Brand column */}
            <div style={{ gridColumn: '1 / 2' }}>
              <div style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 24, fontWeight: 700, color: '#C9922A', marginBottom: 8,
              }}>TABIT</div>
              <div style={{
                fontFamily: 'var(--font-arabic), serif',
                fontSize: 12, color: '#8A856E', direction: 'rtl', marginBottom: 12,
              }}>ثابت — السوق يعمل من أجلك</div>
              <p style={{ fontSize: 12, color: '#8A856E', lineHeight: 1.7 }}>
                La première marketplace inversée du Maroc. Publiez votre besoin, recevez les meilleures offres.
              </p>
            </div>

            {/* Link columns */}
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 style={{
                  fontSize: 11, fontWeight: 700, color: '#C9922A',
                  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16,
                }}>
                  {col.title}
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none' }}>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <motion.a
                        href={link.href}
                        style={{ fontSize: 13, color: '#8A856E', textDecoration: 'none', display: 'block' }}
                        whileHover={{ color: '#C4BCA8', x: 2 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.label}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile accordion */}
          <div className="footer-mobile" style={{ display: 'none', marginBottom: 40 }}>
            <div style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 24, fontWeight: 700, color: '#C9922A', marginBottom: 6,
            }}>TABIT</div>
            <div style={{
              fontFamily: 'var(--font-arabic), serif',
              fontSize: 13, color: '#8A856E', direction: 'rtl', marginBottom: 24,
            }}>ثابت — السوق يعمل من أجلك</div>
            {COLUMNS.map((col) => (
              <MobileColumn key={col.title} col={col} />
            ))}
          </div>

          {/* Newsletter */}
          <div style={{
            borderRadius: 18, padding: 'clamp(20px, 4vw, 28px) clamp(20px, 5vw, 36px)',
            marginBottom: 40,
            background: 'linear-gradient(135deg, #171612, #1C1B16)',
            border: '1px solid rgba(201,146,42,0.15)',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20,
          }}>
            <div>
              <h4 style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 20, color: '#FAFAF7', marginBottom: 4,
              }}>Restez informé</h4>
              <p style={{ fontSize: 13, color: '#8A856E' }}>
                Nouvelles fonctionnalités, bons plans exclusifs, actualités TABIT.
              </p>
            </div>
            {subscribed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#C9922A', fontWeight: 600, fontSize: 14 }}>
                <span>✓</span> Merci, vous êtes inscrit !
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{
                display: 'flex', gap: 10, flex: '1 1 auto', maxWidth: 420,
              }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: 10, fontSize: 14,
                    background: '#0C0B09', border: '1px solid rgba(201,146,42,0.25)',
                    color: '#FAFAF7', outline: 'none', minHeight: 48,
                  }}
                />
                <motion.button
                  type="submit"
                  style={{
                    padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                    background: 'linear-gradient(135deg, #C9922A, #E8B84B)',
                    color: '#0C0B09', border: 'none', cursor: 'pointer', minHeight: 48,
                    flexShrink: 0,
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  S'abonner
                </motion.button>
              </form>
            )}
          </div>

          {/* Bottom bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: 16,
            paddingTop: 24, borderTop: '1px solid rgba(201,146,42,0.1)',
          }}>
            <p style={{ fontSize: 12, color: '#8A856E', lineHeight: 1.6 }}>
              © 2025 TABIT · Tous droits réservés · Made with ♥ in Casablanca, Maroc<br />
              <span style={{ fontSize: 11 }}>Loi 09-08 conforme · CNDP enregistré</span>
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {SOCIALS.map((s) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                    background: 'rgba(201,146,42,0.08)', color: '#8A856E',
                    border: '1px solid rgba(201,146,42,0.13)',
                    textDecoration: 'none',
                  }}
                  whileHover={{ background: 'rgba(201,146,42,0.18)', color: '#C9922A', scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>

            {/* App install */}
            <motion.button
              style={{
                fontSize: 12, padding: '8px 16px', borderRadius: 8,
                background: 'rgba(201,146,42,0.08)', color: '#C9922A',
                border: '1px solid rgba(201,146,42,0.2)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                minHeight: 36,
              }}
              whileHover={{ background: 'rgba(201,146,42,0.16)', scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {}}
            >
              📱 Installer l&apos;app PWA
            </motion.button>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .footer-desktop { display: grid !important; }
          .footer-mobile { display: none !important; }
        }
        @media (max-width: 1023px) {
          .footer-desktop { display: none !important; }
          .footer-mobile { display: block !important; }
        }
      `}</style>
    </footer>
  )
}
