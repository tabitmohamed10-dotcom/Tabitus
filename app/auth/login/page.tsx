'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Mail, Lock, Star, TrendingDown, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/index'
import { cn } from '@/lib/utils'

const SOCIAL_PROOF = [
  { emoji: '💰', text: '2 200 DH économisés', sub: 'Fatima Z., Casablanca' },
  { emoji: '⚡', text: 'Réponse en 34 min', sub: 'Sur ma demande urgente' },
  { emoji: '⭐', text: '4.8/5 satisfaction', sub: '50 000+ utilisateurs' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault()
    if (!email || !password) { setError('Remplissez tous les champs'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user!.id).single()
    window.location.href = profile?.role === 'merchant' ? '/dashboard/merchant' : '/dashboard/buyer'
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

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center group">
            <img src="/logo.svg" alt="Tabitus" className="h-9 w-auto brightness-200 transition-opacity group-hover:opacity-85" />
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="font-display text-4xl xl:text-5xl font-bold text-white leading-[1.1] mb-5">
              Le marché qui<br />travaille pour vous
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-xs">
              Publiez votre besoin. Des centaines de commerçants vous envoient leurs meilleures offres.
            </p>
          </div>

          <div className="space-y-3">
            {SOCIAL_PROOF.map((item, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3.5 border border-white/15',
                  'animate-fade-up'
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-2xl shrink-0">{item.emoji}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{item.text}</p>
                  <p className="text-white/55 text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {['F','A','K','S'].map((l, i) => (
              <div key={i} className="h-8 w-8 rounded-full bg-brand-gradient ring-2 ring-foreground flex items-center justify-center text-white text-xs font-bold">
                {l}
              </div>
            ))}
          </div>
          <p className="text-white/60 text-sm">
            <span className="text-white font-semibold">50 000+</span> utilisateurs actifs
          </p>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden mb-10">
            <Link href="/">
              <img src="/logo.svg" alt="Tabitus" className="h-9 w-auto" />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
              Bon retour 👋
            </h1>
            <p className="text-muted-foreground">
              Pas de compte ?{' '}
              <Link href="/auth/register" className="text-primary font-semibold hover:underline underline-offset-4">
                Créer un compte gratuit
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-destructive/8 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-up">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.5a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4zm.75 7.25a.875.875 0 110-1.75.875.875 0 010 1.75z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="votre@email.com"
              label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              autoComplete="email"
              autoFocus
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground/80">Mot de passe</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary hover:underline underline-offset-4 font-medium"
                >
                  Oublié ?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
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
              {!loading && 'Se connecter'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            En vous connectant, vous acceptez nos{' '}
            <Link href="#" className="underline underline-offset-4 hover:text-foreground">CGU</Link>
            {' '}et notre{' '}
            <Link href="#" className="underline underline-offset-4 hover:text-foreground">Politique de confidentialité</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
