'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/index'
import { cn } from '@/lib/utils'

const schema = z.object({
  full_name: z.string().min(2, 'Au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Au moins 8 caractères'),
  phone: z.string().optional(),
  city: z.string().min(1, 'Ville requise'),
  business_name: z.string().optional(),
  role: z.enum(['buyer', 'merchant']),
})
type FormData = z.infer<typeof schema>

const CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
  'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Safi', 'Autre'
]

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const defaultRole = searchParams.get('role') === 'merchant' ? 'merchant' : 'buyer'
  const [role, setRole] = useState<'buyer' | 'merchant'>(defaultRole)
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: defaultRole },
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError('')

    // Create auth user
    const { data: auth, error: authErr } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: data.role,
        },
      },
    })

    if (authErr) {
      setError(authErr.message === 'User already registered'
        ? 'Cet email est déjà utilisé.'
        : authErr.message)
      setLoading(false)
      return
    }

    if (!auth.user) {
      setError('Erreur lors de la création du compte')
      setLoading(false)
      return
    }

    // Update profile with city + phone
    await supabase.from('profiles').update({
      phone: data.phone,
      city: data.city,
    }).eq('id', auth.user.id)

    // If merchant: create merchant profile
    if (data.role === 'merchant' && data.business_name) {
      await supabase.from('merchants').insert({
        user_id: auth.user.id,
        business_name: data.business_name,
        city: data.city,
      })
    }

    toast.success('Compte créé ! Bienvenue sur Tabitus 🎉')
    router.push(data.role === 'merchant' ? '/dashboard/merchant' : '/dashboard/buyer')
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient opacity-10" />
        <Link href="/" className="flex items-center gap-2 relative">
          <div className="h-9 w-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-display font-bold">T</div>
          <span className="font-display font-bold text-xl">tabitus</span>
        </Link>

        <div className="relative space-y-6">
          <h2 className="font-display text-4xl font-bold leading-tight">
            {role === 'buyer'
              ? 'Trouvez tout ce que vous cherchez, au meilleur prix.'
              : 'Développez votre activité avec de nouveaux clients chaque jour.'
            }
          </h2>

          <div className="space-y-4">
            {role === 'buyer' ? [
              '✓ Inscription gratuite',
              '✓ Des offres en moins de 2 heures',
              '✓ Économisez en moyenne 25%',
              '✓ Commerçants vérifiés',
            ] : [
              '✓ 0 DH à l\'inscription',
              '✓ Clients qualifiés prêts à acheter',
              '✓ Interface ultra simple',
              '✓ Statistiques en temps réel',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 text-background/80">
                <CheckCircle2 className="h-5 w-5 text-orange-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-background/40 relative">
          © 2024 Tabitus · Casablanca, Maroc
        </p>
      </div>

      {/* Right form */}
      <div className="flex flex-col justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-8 w-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-display font-bold text-sm">T</div>
            <span className="font-display font-bold text-xl">tabitus</span>
          </Link>

          <h1 className="font-display text-3xl font-bold mb-2">Créer un compte</h1>
          <p className="text-muted-foreground mb-8">
            Déjà inscrit ?{' '}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              Se connecter
            </Link>
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {(['buyer', 'merchant'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => { setRole(r); setValue('role', r) }}
                className={cn(
                  'p-4 rounded-2xl border-2 text-left transition-all',
                  role === r
                    ? 'border-primary bg-accent'
                    : 'border-border hover:border-primary/30'
                )}
              >
                <div className="text-2xl mb-2">{r === 'buyer' ? '🛍️' : '🏪'}</div>
                <div className="font-semibold text-sm">
                  {r === 'buyer' ? 'Je suis acheteur' : 'Je suis commerçant'}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {r === 'buyer' ? 'Publier des demandes' : 'Répondre aux demandes'}
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive text-sm mb-6">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register('role')} />

            <div>
              <Label htmlFor="full_name" className="mb-2 block">Nom complet</Label>
              <Input
                id="full_name"
                placeholder="Mohammed Alaoui"
                {...register('full_name')}
                error={errors.full_name?.message}
              />
            </div>

            {role === 'merchant' && (
              <div>
                <Label htmlFor="business_name" className="mb-2 block">Nom de l'entreprise</Label>
                <Input
                  id="business_name"
                  placeholder="Mon Commerce SARL"
                  {...register('business_name')}
                  error={errors.business_name?.message}
                />
              </div>
            )}

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
              <Label htmlFor="phone" className="mb-2 block">Téléphone <span className="text-muted-foreground font-normal">(optionnel)</span></Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+212 6 00 00 00 00"
                {...register('phone')}
              />
            </div>

            <div>
              <Label htmlFor="city" className="mb-2 block">Ville</Label>
              <select
                id="city"
                {...register('city')}
                className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Choisir votre ville</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city.message}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="mb-2 block">Mot de passe</Label>
              <Input
                id="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="8 caractères minimum"
                {...register('password')}
                error={errors.password?.message}
                suffix={
                  <button type="button" onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            <Button type="submit" variant="gradient" size="lg" loading={loading} className="w-full mt-2">
              {role === 'buyer' ? 'Créer mon compte acheteur' : 'Créer mon compte commerçant'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            En créant un compte, vous acceptez nos{' '}
            <Link href="/cgu" className="underline hover:text-foreground">CGU</Link>{' '}
            et notre{' '}
            <Link href="/confidentialite" className="underline hover:text-foreground">politique de confidentialité</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
