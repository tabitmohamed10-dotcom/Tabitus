'use client'
import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = ((searchParams.get('role') || searchParams.get('type')) as 'buyer' | 'merchant') || 'buyer'

  const [role, setRole] = useState<'buyer' | 'merchant'>(initialRole)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleRegister = async () => {
    setError('')
    if (!fullName.trim()) { setError('Entrez votre nom complet'); return }
    if (!email.trim()) { setError('Entrez votre email'); return }
    if (!password || password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères'); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim(), role } },
      })
      if (err) throw err
      if (data.session) {
        router.push(role === 'merchant' ? '/dashboard/merchant' : '/dashboard/buyer')
        router.refresh()
      } else {
        setEmailSent(true)
      }
    } catch (err: any) {
      const msg = err.message || ''
      if (msg.includes('already registered') || msg.includes('User already registered')) setError('Cet email est déjà utilisé. Connectez-vous.')
      else setError(msg || 'Une erreur est survenue. Réessayez.')
    } finally { setLoading(false) }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '14px 14px 14px 42px',
    border: '1px solid #E8E0CC', borderRadius: 10,
    fontSize: 14, color: '#0C0B09', outline: 'none',
    background: '#FAFAF7', fontFamily: 'inherit', boxSizing: 'border-box',
  }

  /* ── Email sent screen ── */
  if (emailSent) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: '#FAFAF7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, zIndex: 9999, fontFamily: 'var(--font-inter)',
      }}>
        <div style={{ width: '100%', maxWidth: 420, textAlign: 'center', background: '#fff', borderRadius: 16, padding: 'clamp(28px,6vw,40px) clamp(24px,6vw,32px)', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>📧</div>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 26, fontWeight: 400, color: '#0C0B09', marginBottom: 12 }}>Vérifiez votre email</h1>
          <p style={{ fontSize: 14, color: '#8A856E', lineHeight: 1.6, marginBottom: 20 }}>
            Un email de confirmation a été envoyé à<br />
            <strong style={{ color: '#0C0B09' }}>{email}</strong>
          </p>
          <div style={{ background: '#FFF8E7', border: '1px solid rgba(201,146,42,0.3)', borderRadius: 10, padding: '14px 16px', marginBottom: 24, fontSize: 13, color: '#8B6914', lineHeight: 1.5, textAlign: 'left' }}>
            💡 Si vous ne voyez pas l'email, vérifiez vos spams.
          </div>
          <Link href="/auth/login" style={{ color: '#C9922A', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  /* ── Main form ── */
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
        width: '100%', maxWidth: 440,
        background: '#ffffff', borderRadius: 16,
        padding: 'clamp(28px,6vw,40px) clamp(24px,6vw,32px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        margin: 'auto',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#8B6914,#C9922A)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-playfair)', fontSize: 20, fontWeight: 400 }}>T</div>
            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 22, letterSpacing: '0.2em', color: '#0C0B09' }}>TABIT</span>
          </div>
          <div style={{ width: 40, height: 1, background: '#C9922A', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9922A' }}>INSCRIPTION</p>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 26, fontWeight: 400, color: '#0C0B09', margin: '8px 0 4px' }}>Créer un compte</h1>
          <p style={{ fontSize: 13, color: '#8A856E' }}>
            Déjà inscrit ?{' '}
            <Link href="/auth/login" style={{ color: '#C9922A', textDecoration: 'none', fontWeight: 500 }}>Se connecter →</Link>
          </p>
        </div>

        {/* Role selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {(['buyer', 'merchant'] as const).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              style={{
                padding: '14px 12px', borderRadius: 10, cursor: 'pointer',
                textAlign: 'left', border: `2px solid ${role === r ? '#C9922A' : '#E8E0CC'}`,
                background: role === r ? 'rgba(201,146,42,0.06)' : '#FAFAF7',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 16, marginBottom: 4 }}>{r === 'buyer' ? '🛍️' : '🏪'}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: role === r ? '#C9922A' : '#0C0B09', marginBottom: 2 }}>
                {r === 'buyer' ? 'Acheteur' : 'Commerçant'}
              </div>
              <div style={{ fontSize: 11, color: '#8A856E' }}>
                {r === 'buyer' ? 'Publier mes besoins' : 'Répondre aux demandes'}
              </div>
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', padding: '12px 16px', marginBottom: 16, color: '#991B1B', fontSize: 13, borderRadius: 8 }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Name */}
          <div>
            <label style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A856E', display: 'block', marginBottom: 8, fontWeight: 500 }}>Nom complet</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#C4BCA8', pointerEvents: 'none' }}>👤</span>
              <input
                type="text" value={fullName}
                onChange={e => setFullName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRegister()}
                placeholder="Votre nom complet"
                autoComplete="name" autoFocus
                style={inp}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A856E', display: 'block', marginBottom: 8, fontWeight: 500 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#C4BCA8', pointerEvents: 'none' }}>✉</span>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRegister()}
                placeholder="votre@email.com"
                autoComplete="email"
                style={inp}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A856E', display: 'block', marginBottom: 8, fontWeight: 500 }}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#C4BCA8', pointerEvents: 'none' }}>🔒</span>
              <input
                type={show ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRegister()}
                placeholder="8 caractères minimum"
                autoComplete="new-password"
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
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: '100%', marginTop: 24, padding: '16px',
            background: loading ? '#E8E0CC' : 'linear-gradient(135deg,#8B6914,#C9922A)',
            color: loading ? '#8A856E' : '#0C0B09',
            border: 'none', borderRadius: 10,
            fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'inherit', transition: 'all 0.3s',
          }}
        >
          {loading ? 'Création du compte...' : `CRÉER MON COMPTE ${role === 'buyer' ? 'ACHETEUR' : 'COMMERÇANT'} →`}
        </button>

        <p style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: '#C4BCA8', lineHeight: 1.5 }}>
          En créant un compte, vous acceptez nos{' '}
          <Link href="/tarifs" style={{ color: '#C9922A', textDecoration: 'none' }}>CGU</Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div style={{ position: 'fixed', inset: 0, background: '#FAFAF7', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #C9922A', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
