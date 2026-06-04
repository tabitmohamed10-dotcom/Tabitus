'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const NAV_LINKS: { href: string; label: string; highlight?: boolean }[] = [
  { href: '#how-it-works', label: 'Comment ça marche' },
  { href: '#categories', label: 'Catégories' },
  { href: '/marche-libre', label: 'Marché Libre', highlight: true },
  { href: '#confiance', label: 'Confiance' },
  { href: '#faq', label: 'FAQ' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(12,11,9,0.97)' : 'rgba(12,11,9,0.2)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(201,146,42,0.2)' : '1px solid rgba(201,146,42,0)',
        transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '0 clamp(20px, 5vw, 56px)',
        height: 'clamp(60px, 8vw, 68px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <motion.div
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'linear-gradient(135deg, #8B6914, #C9922A, #E8B84B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, color: '#0C0B09', fontSize: 17,
              fontFamily: 'var(--font-playfair), Georgia, serif',
              boxShadow: '0 2px 12px rgba(201,146,42,0.35)',
            }}>T</div>
            <span style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 22, fontWeight: 700, color: '#C9922A', letterSpacing: '0.01em',
            }}>TABIT</span>
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {NAV_LINKS.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              style={{
                color: link.highlight ? '#C9922A' : '#C4BCA8',
                textDecoration: 'none', fontSize: 14, fontWeight: link.highlight ? 600 : 400, letterSpacing: '0.01em',
                ...(link.highlight ? { padding: '4px 10px', border: '1px solid rgba(201,146,42,0.35)', borderRadius: 100, fontSize: 13 } : {}),
              }}
              whileHover={{ color: '#C9922A', y: -1 }}
              transition={{ duration: 0.2 }}
            >
              {link.highlight && <span style={{ marginRight: 4 }}>🏪</span>}
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="nav-desktop-cta" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.a
            href="/auth/login"
            style={{ color: '#C9922A', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
            whileHover={{ color: '#E8B84B' }}
            transition={{ duration: 0.2 }}
          >
            Connexion
          </motion.a>
          <motion.a
            href="/auth/register"
            style={{
              background: 'linear-gradient(135deg, #C9922A, #E8B84B)',
              color: '#0C0B09', textDecoration: 'none',
              padding: '10px 20px', borderRadius: 8,
              fontSize: 13, fontWeight: 700, letterSpacing: '0.01em',
              minHeight: 44, display: 'flex', alignItems: 'center',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 12px rgba(201,146,42,0.3)',
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(201,146,42,0.5)' }}
            whileTap={{ scale: 0.97 }}
          >
            Commencer gratuitement
          </motion.a>
        </div>

        {/* Hamburger */}
        <motion.button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 8, minHeight: 44, minWidth: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          whileTap={{ scale: 0.9 }}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={menuOpen ? 'close' : 'open'}
              initial={{ opacity: 0, rotate: -60 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 60 }}
              transition={{ duration: 0.2 }}
              style={{ color: '#C9922A', fontSize: 22, lineHeight: 1, display: 'block' }}
            >
              {menuOpen ? '✕' : '☰'}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'rgba(12,11,9,0.99)',
              borderTop: '1px solid rgba(201,146,42,0.2)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '12px clamp(20px,5vw,32px) 24px', display: 'flex', flexDirection: 'column' }}>
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  style={{
                    color: link.highlight ? '#C9922A' : '#D4C5A9',
                    textDecoration: 'none',
                    padding: '15px 0', fontSize: 16, fontWeight: link.highlight ? 600 : 400,
                    borderBottom: '1px solid rgba(201,146,42,0.08)',
                    display: 'flex', alignItems: 'center', gap: 8, minHeight: 52,
                  }}
                >
                  {link.highlight && <span>🏪</span>}
                  {link.label}
                  {link.highlight && <span style={{ fontSize: 11, background: 'rgba(201,146,42,0.15)', color: '#C9922A', padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>Nouveau</span>}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}
              >
                <a href="/auth/login" style={{
                  color: '#C9922A', textDecoration: 'none',
                  padding: '14px 20px', border: '1px solid rgba(201,146,42,0.4)',
                  borderRadius: 10, textAlign: 'center', fontWeight: 600,
                  minHeight: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15,
                }}>Connexion</a>
                <a href="/auth/register" style={{
                  background: 'linear-gradient(135deg, #C9922A, #E8B84B)',
                  color: '#0C0B09', textDecoration: 'none',
                  padding: '14px 20px', borderRadius: 10, textAlign: 'center',
                  fontWeight: 700, minHeight: 50, fontSize: 15,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(201,146,42,0.4)',
                }}>Commencer gratuitement</a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .nav-hamburger { display: none !important; }
        }
        @media (max-width: 767px) {
          .nav-desktop-links { display: none !important; }
          .nav-desktop-cta { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
