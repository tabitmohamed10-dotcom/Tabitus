'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, User, MapPin, Phone, Store, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function OnboardingPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setFormData(data || {})
      setLoading(false)
    }
    load()
  }, [router])

  async function handleNext() {
    setSaving(true)
    const supabase = createClient()
    if (step === 1) {
      await supabase.from('profiles').update(formData).eq('id', profile.id)
      setStep(2)
    } else if (step === 2) {
      if (formData.role === 'merchant') {
        await supabase.from('merchants').insert({ user_id: profile.id, business_name: formData.business_name || 'Ma boutique' })
      }
      router.push(formData.role === 'merchant' ? '/dashboard/merchant' : '/dashboard/buyer')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  const inputClass = cn(
    'flex h-11 w-full rounded-xl border border-border/70 bg-background px-4 py-2.5 text-sm',
    'text-foreground placeholder:text-muted-foreground/60',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-primary/50',
    'hover:border-border'
  )

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border/60 rounded-3xl shadow-dramatic w-full max-w-md p-8 animate-scale-in">
        <Link href="/" className="flex items-center mb-8 group">
          <img src="/logo.svg" alt="Tabit" className="h-8 w-auto transition-opacity group-hover:opacity-85" />
        </Link>

        {step === 1 ? (
          <>
            <h1 className="font-display text-2xl font-bold tracking-tight mb-1.5">Bienvenue 👋</h1>
            <p className="text-muted-foreground text-sm mb-7">Complétez votre profil pour continuer</p>

            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground/80">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={formData.full_name || ''}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Votre nom complet"
                    className={cn(inputClass, 'pl-10')}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground/80">Ville</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Casablanca"
                    className={cn(inputClass, 'pl-10')}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground/80">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+212 6XX XXX XXX"
                    className={cn(inputClass, 'pl-10')}
                  />
                </div>
              </div>
            </div>

            <Button variant="gradient" size="lg" loading={saving} className="w-full" onClick={handleNext}>
              {!saving && 'Continuer'}
              {!saving && <ArrowRight className="h-4 w-4" />}
            </Button>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold tracking-tight mb-1.5">Quel est votre rôle ?</h1>
            <p className="text-muted-foreground text-sm mb-7">Choisissez votre profil pour personnaliser votre expérience</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {(['buyer', 'merchant'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r })}
                  className={cn(
                    'relative p-4 rounded-2xl border-2 text-left transition-all duration-200',
                    formData.role === r
                      ? 'border-primary bg-accent/60'
                      : 'border-border/60 bg-card hover:border-border hover:bg-muted/30'
                  )}
                >
                  {formData.role === r && (
                    <div className="absolute top-2.5 right-2.5">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className={cn(
                    'h-9 w-9 rounded-xl flex items-center justify-center mb-3',
                    formData.role === r ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  )}>
                    {r === 'buyer' ? <ShoppingBag className="h-4 w-4" /> : <Store className="h-4 w-4" />}
                  </div>
                  <div className="font-semibold text-sm mb-0.5">
                    {r === 'buyer' ? 'Acheteur' : 'Commerçant'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {r === 'buyer' ? 'Je veux acheter' : 'Je veux vendre'}
                  </div>
                </button>
              ))}
            </div>

            {formData.role === 'merchant' && (
              <div className="space-y-1.5 mb-6">
                <label className="block text-sm font-medium text-foreground/80">Nom de la boutique</label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={formData.business_name || ''}
                    onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                    placeholder="Ma boutique"
                    className={cn(inputClass, 'pl-10')}
                  />
                </div>
              </div>
            )}

            <Button
              variant="gradient"
              size="lg"
              loading={saving}
              disabled={!formData.role}
              className="w-full"
              onClick={handleNext}
            >
              {!saving && 'Terminer et accéder à mon espace'}
              {!saving && <ArrowRight className="h-4 w-4" />}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
