'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, CheckCircle2, ShoppingBag, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/index'
import { cn } from '@/lib/utils'

const BENEFITS = {
  buyer: [
    { icon: '💰', text: 'Économisez en moyenne 25%' },
    { icon: '⚡', text: 'Réponses en moins de 2h' },
    { icon: '🛡️', text: 'Commerçants vérifiés' },
    { icon: '🆓', text: '100% gratuit pour les acheteurs' },
  ],
  merchant: [
    { icon: '🎯', text: 'Clients qualifiés & prêts à acheter' },
    { icon: '📣', text: 'Aucune dépense publicitaire' },
    { icon: '⭐', text: 'Construisez votre réputation' },
    { icon: '🚀', text: 'Démarrez gratuitement' },
  ],
}

function RegisterForm() {
  const searchParams = useSearchParams()
  const initialRole = (searchParams.get('role') as 'buyer' | 'merchant') || 'buyer'

  const router = useRouter()
  const [role, setRole] = useState<'buyer' | 'merchant'>(initialRole)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister(e?: React.FormEvent) {
    e?.preventDefault()
    if (!fullName || !email || !password) { setError('Remplissez tous les champs'); return }
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } }
    })
    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }
    router.push(role === 'merchant' ? '/dashboard/merchant' : '/dashboard/buyer')
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (brand) ── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] relative bg-foreground flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-brand-gradient opacity-95" />
          <div className="absolute inset-0 bg-grid opacity-[0.06]" />
          <div className="absolute top-24 right-0 w-96 h-96 rounded-full bg-violet-500/20 blur-[80px]" />
          <div className="absolute bottom-32 left-0 w-80 h-80 rounded-full bg-indigo-800/25 blur-[60px]" />
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center group">
            <img src="/logo.svg" alt="Tabitus" className="h-9 w-auto brightness-200 transition-opacity group-hover:opacity-85" />
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-3">
              {role === 'buyer' ? 'Pour les acheteurs' : 'Pour les commerçants'}
            </p>
            <h2 className="font-display text-4xl xl:text-5xl font-bold text-white leading-[1.1] mb-5">
              {role === 'buyer' ? (
                <>Arrêtez de chercher.<br />Laissez-les<br />venir à vous.</>
              ) : (
                <>Des clients.<br />Sans<br />publicité.</>
              )}
            </h2>
          </div>

          <div className="space-y-3">
            {BENEFITS[role].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-white/80"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-8 w-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                  <span className="text-base">{item.icon}</span>
                </div>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-xs">
            Déjà {role === 'buyer' ? '50 000+ acheteurs' : '8 000+ commerçants'} nous font confiance
          </p>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden mb-10">
            <Link href="/">
              <img src="/logo.svg" alt="Tabitus" className="h-9 w-auto" />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
              Créer un compte
            </h1>
            <p className="text-muted-foreground">
              Déjà inscrit ?{' '}
              <Link href="/auth/login" className="text-primary font-semibold hover:underline underline-offset-4">
                Se connecter
              </Link>
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(['buyer', 'merchant'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  'relative p-4 rounded-2xl border-2 text-left transition-all duration-200',
                  'hover:border-primary/40',
                  role === r
                    ? 'border-primary bg-accent/60 shadow-brand/20'
                    : 'border-border/60 bg-card hover:bg-muted/30'
                )}
              >
                {role === r && (
                  <div className="absolute top-2.5 right-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className={cn(
                  'h-9 w-9 rounded-xl flex items-center justify-center mb-3',
                  role === r ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                )}>
                  {r === 'buyer'
                    ? <ShoppingBag className="h-4.5 w-4.5" />
                    : <Store className="h-4.5 w-4.5" />
                  }
                </div>
                <div className="font-semibold text-sm text-foreground mb-0.5">
                  {r === 'buyer' ? 'Acheteur' : 'Commerçant'}
                </div>
                <div className="text-xs text-muted-foreground leading-snug">
                  {r === 'buyer' ? 'Publier des demandes' : 'Répondre aux demandes'}
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-5 bg-destructive/8 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-up">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.5a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4zm.75 7.25a.875.875 0 110-1.75.875.875 0 010 1.75z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              type="text"
              placeholder="Votre nom complet"
              label="Nom complet"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              icon={<User className="h-4 w-4" />}
              autoComplete="name"
              autoFocus
            />

            <Input
              type="email"
              placeholder="votre@email.com"
              label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              autoComplete="email"
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground/80">Mot de passe</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="8 caractères minimum"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className={cn(
                    'flex h-11 w-full rounded-xl border border-border/70 bg-background px-4 py-2.5 text-sm pl-10 pr-11',
                    'placeholder:text-muted-foreground/60 transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-primary/50',
                    'hover:border-border',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              {!loading && `Créer mon compte ${role === 'buyer' ? 'acheteur' : 'commerçant'}`}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
            En créant un compte, vous acceptez nos{' '}
            <Link href="#" className="underline underline-offset-4 hover:text-foreground">CGU</Link>
            {' '}et notre{' '}
            <Link href="#" className="underline underline-offset-4 hover:text-foreground">Politique de confidentialité</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
