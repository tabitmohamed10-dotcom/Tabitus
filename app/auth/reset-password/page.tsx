'use client'
import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleReset() {
    if (!password || !passwordConfirm) return setError('Remplissez tous les champs')
    if (password !== passwordConfirm) return setError('Les mots de passe ne correspondent pas')
    if (password.length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères')
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) { setError(err.message); setLoading(false); return }
    setSuccess(true)
    setTimeout(() => router.push('/auth/login'), 2500)
  }

  const inputClass = cn(
    'flex h-11 w-full rounded-xl border border-border/70 bg-background px-4 py-2.5 text-sm pl-10',
    'text-foreground placeholder:text-muted-foreground/60 transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-primary/50',
    'hover:border-border'
  )

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border/60 rounded-3xl shadow-dramatic w-full max-w-[400px] p-8 animate-scale-in">
        <Link href="/" className="flex items-center mb-8 group">
          <img src="/logo.svg" alt="Tabit" className="h-8 w-auto transition-opacity group-hover:opacity-85" />
        </Link>

        {success ? (
          <div className="text-center py-4">
            <div className="h-16 w-16 rounded-full bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="font-display text-xl font-bold mb-2">Mot de passe réinitialisé !</h1>
            <p className="text-muted-foreground text-sm">Redirection vers la connexion...</p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold tracking-tight mb-1.5">Nouveau mot de passe</h1>
            <p className="text-muted-foreground text-sm mb-7">Entrez et confirmez votre nouveau mot de passe.</p>

            {error && (
              <div className="mb-5 bg-destructive/8 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm font-medium animate-fade-up">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  value={passwordConfirm}
                  onChange={e => setPasswordConfirm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReset()}
                  className={inputClass}
                />
              </div>
            </div>

            <Button variant="gradient" size="lg" loading={loading} className="w-full mb-5" onClick={handleReset}>
              {!loading && 'Réinitialiser le mot de passe'}
            </Button>

            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
