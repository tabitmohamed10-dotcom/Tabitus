'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Label, Card } from '@/components/ui/index'

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Au moins 6 caractères'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (authError) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }
    // Get role and redirect
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user!.id).single()

    toast.success('Bienvenue sur Tabitus !')
    if (profile?.role === 'merchant') {
      router.push('/dashboard/merchant')
    } else if (profile?.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard/buyer')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient opacity-10" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl" />

        <Link href="/" className="flex items-center gap-2 relative">
          <div className="h-9 w-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-display font-bold">T</div>
          <span className="font-display font-bold text-xl">tabitus</span>
        </Link>

        <div className="relative">
          <blockquote className="text-3xl font-display font-bold leading-tight mb-6">
            "Le marché qui<br />travaille pour vous."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {['A','K','F','M'].map(l => (
                <div key={l} className="h-9 w-9 rounded-full bg-brand-gradient border-2 border-foreground flex items-center justify-center text-white font-bold text-xs">{l}</div>
              ))}
            </div>
            <p className="text-sm text-background/60">50 000+ utilisateurs satisfaits</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 relative">
          {[
            { label: 'Demandes', value: '200k+' },
            { label: 'Commerçants', value: '8k+' },
            { label: 'Économies', value: '25%' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-display font-bold">{s.value}</p>
              <p className="text-xs text-background/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="h-8 w-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-display font-bold text-sm">T</div>
            <span className="font-display font-bold text-xl">tabitus</span>
          </Link>

          <h1 className="font-display text-3xl font-bold mb-2">Bon retour !</h1>
          <p className="text-muted-foreground mb-8">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="text-primary font-medium hover:underline">
              Créer un compte
            </Link>
          </p>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive text-sm mb-6">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email" className="mb-2 block">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                id="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
                suffix={
                  <button type="button" onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>
            <Button type="submit" variant="gradient" size="lg" loading={loading} className="w-full">
              Se connecter
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground bg-background px-4">
              ou continuer avec
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={async () => {
              await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${location.origin}/auth/callback` },
              })
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </Button>
        </div>
      </div>
    </div>
  )
}
