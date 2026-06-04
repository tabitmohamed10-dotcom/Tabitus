'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#FAFAF7', padding: 'clamp(24px,5vw,48px)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: 'linear-gradient(135deg, #8B6914, #C9922A)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Georgia, serif', fontWeight: 900, color: '#0C0B09', fontSize: 28,
        marginBottom: 24, boxShadow: '0 4px 20px rgba(201,146,42,0.35)',
      }}>T</div>
      <h1 style={{
        fontFamily: 'var(--font-playfair, Georgia, serif)',
        fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400,
        color: '#0C0B09', marginBottom: 12,
      }}>Une erreur est survenue</h1>
      <p style={{ fontSize: 15, color: '#8A856E', marginBottom: 32, maxWidth: 400 }}>
        Quelque chose s'est mal passé. Veuillez réessayer ou retourner à l'accueil.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: '12px 28px', borderRadius: 10,
            background: 'linear-gradient(135deg, #C9922A, #E8B84B)',
            color: '#0C0B09', fontWeight: 700, fontSize: 14,
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(201,146,42,0.35)',
          }}
        >
          Réessayer
        </button>
        <Link href="/" style={{
          padding: '12px 28px', borderRadius: 10,
          border: '1.5px solid #C9922A', color: '#C9922A',
          fontWeight: 600, fontSize: 14, textDecoration: 'none',
        }}>
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
