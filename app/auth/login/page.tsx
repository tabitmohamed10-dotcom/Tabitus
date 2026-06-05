'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    if (!email || !password) { setError('Veuillez remplir tous les champs'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) throw err
      const role = data.user?.user_metadata?.role || 'buyer'
      router.push(role === 'merchant' ? '/dashboard/merchant' : '/dashboard/buyer')
      router.refresh()
    } catch (err: any) {
      const msg = err.message || ''
      if (msg.includes('Invalid login') || msg.includes('invalid_credentials')) setError('Email ou mot de passe incorrect')
      else if (msg.includes('Email not confirmed')) setError('Confirmez votre email avant de vous connecter')
      else setError('Une erreur est survenue. Réessayez.')
    } finally { setLoading(false) }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '14px 14px 14px 42px',
    border: '1px solid #E8E0CC', borderRadius: 10,
    fontSize: 14, color: '#0C0B09', outline: 'none',
    background: '#FAFAF7', fontFamily: 'inherit', boxSizing: 'border-box',
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: '#FAFAF7',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, zIndex: 9999,
      fontFamily: 'var(--font-inter)',
      overflowY: 'auto',
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: '#ffffff', borderRadius: 16,
        padding: 'clamp(28px,6vw,40px) clamp(24px,6vw,32px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#8B6914,#C9922A)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-playfair)', fontSize: 20, fontWeight: 400 }}>T</div>
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 22, letterSpacing: '0.2em', color: '#0C0B09' }}>TABIT</span>
          </div>
          <div style={{ width: 40, height: 1, background: '#C9922A', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9922A' }}>CONNEXION</p>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 28, fontWeight: 400, color: '#0C0B09', margin: '8px 0 4px' }}>Bon retour</h1>
          <p style={{ fontSize: 13, color: '#8A856E' }}>
            Pas de compte ?{' '}
            <Link href="/auth/register" style={{ color: '#C9922A', textDecoration: 'none', fontWeight: 500 }}>Créer un compte gratuit →</Link>
          </p>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', padding: '12px 16px', marginBottom: 20, color: '#991B1B', fontSize: 13, borderRadius: 8 }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email */}
          <div>
            <label style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A856E', display: 'block', marginBottom: 8, fontWeight: 500 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#C4BCA8', pointerEvents: 'none' }}>✉</span>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="votre@email.com"
                autoComplete="email" autoFocus
                style={inp}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A856E', fontWeight: 500 }}>Mot de passe</label>
              <Link href="/auth/forgot-password" style={{ fontSize: 12, color: '#C9922A', textDecoration: 'none' }}>Oublié ?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#C4BCA8', pointerEvents: 'none' }}>🔒</span>
              <input
                type={show ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Votre mot de passe"
                autoComplete="current-password"
                style={{ ...inp, paddingRight: 44 }}
              />
              <button
                onClick={() => setShow(!show)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: '#C4BCA8', padding: 0 }}
              >
                {show ? '🙈' : '👁'}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          style={{
            width: '100%', marginTop: 24, padding: '16px',
            background: loading || !email || !password ? '#E8E0CC' : 'linear-gradient(135deg,#8B6914,#C9922A)',
            color: loading || !email || !password ? '#8A856E' : '#0C0B09',
            border: 'none', borderRadius: 10,
            fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600,
            cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'inherit', transition: 'all 0.3s',
          }}
        >
          {loading ? 'Connexion en cours...' : 'SE CONNECTER →'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: '#C4BCA8', lineHeight: 1.5 }}>
          En vous connectant, vous acceptez nos{' '}
          <Link href="/tarifs" style={{ color: '#C9922A', textDecoration: 'none' }}>CGU</Link>
        </p>
      </div>
    </div>
  )
}
