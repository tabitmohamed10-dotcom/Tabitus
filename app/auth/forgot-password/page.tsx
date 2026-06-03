'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/index'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleReset(e?: React.FormEvent) {
    e?.preventDefault()
    if (!email) { setError('Entrez votre email'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/auth/reset-password`
      : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl })
    if (resetError) { setError(resetError.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="flex items-center gap-2.5 mb-12 group">
          <div className="h-9 w-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand">
            <span className="font-display font-bold text-white text-base">T</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight">tabit</span>
        </Link>

        {sent ? (
          <div className="text-center animate-fade-up">
            <div className="h-16 w-16 rounded-2xl bg-green-100 dark:bg-green-950/50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Email envoyé !</h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Vérifiez votre boîte mail. Vous recevrez un lien pour réinitialiser votre mot de passe dans quelques minutes.
            </p>
            <Link href="/auth/login">
              <Button variant="gradient" className="w-full">
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
                Mot de passe oublié ?
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Entrez votre email et nous vous enverrons un lien de réinitialisation.
              </p>
            </div>

            {error && (
              <div className="mb-5 bg-destructive/8 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm font-medium animate-fade-up">
                {error}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <Input
                type="email"
                placeholder="votre@email.com"
                label="Adresse email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                autoFocus
                autoComplete="email"
              />
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                loading={loading}
                className="w-full"
              >
                {!loading && 'Envoyer le lien'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>

            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-1.5 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour à la connexion
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
