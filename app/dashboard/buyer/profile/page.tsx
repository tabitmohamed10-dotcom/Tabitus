'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, Camera, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Avatar, Skeleton } from '@/components/ui/index'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const CITIES = ['Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda','Kénitra','Tétouan','El Jadida','Settat','Beni Mellal','Nador']

export default function BuyerProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>({})

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setForm(data || {})
      setLoading(false)
    }
    load()
  }, [])

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      full_name: form.full_name,
      phone: form.phone,
      city: form.city,
    }).eq('id', profile.id)
    if (error) {
      toast.error('Erreur lors de la sauvegarde')
    } else {
      toast.success('Profil mis à jour !')
      setProfile(form)
    }
    setSaving(false)
  }

  const isDirty = profile && (
    form.full_name !== profile.full_name ||
    form.phone !== profile.phone ||
    form.city !== profile.city
  )

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-7 w-40" />
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Mon profil</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gérez vos informations personnelles</p>
      </div>

      {/* Avatar section */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-premium mb-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar src={profile?.avatar_url} name={profile?.full_name} size="xl" />
            <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-brand hover:bg-primary/90 transition-colors">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <h2 className="font-display font-bold text-lg leading-tight">{profile?.full_name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{profile?.email}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground font-medium">Compte actif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-card border border-border/60 rounded-2xl p-6 shadow-premium space-y-5">
        <h3 className="font-display font-bold text-base">Informations personnelles</h3>

        <Input
          label="Nom complet"
          type="text"
          value={form.full_name || ''}
          onChange={e => set('full_name', e.target.value)}
          icon={<User className="h-4 w-4" />}
          placeholder="Votre nom complet"
        />

        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1.5">Email</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="flex h-11 w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm pl-10 text-muted-foreground cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">L'email ne peut pas être modifié</p>
        </div>

        <Input
          label="Téléphone"
          type="tel"
          value={form.phone || ''}
          onChange={e => set('phone', e.target.value)}
          icon={<Phone className="h-4 w-4" />}
          placeholder="+212 6XX XXX XXX"
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground/80">Ville</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <MapPin className="h-4 w-4" />
            </div>
            <select
              value={form.city || ''}
              onChange={e => set('city', e.target.value)}
              className={cn(
                'flex h-11 w-full rounded-xl border border-border/70 bg-background px-4 py-2.5 text-sm pl-10',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-primary/50',
                'transition-all duration-150 hover:border-border appearance-none cursor-pointer'
              )}
            >
              <option value="">Choisir votre ville</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {isDirty && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setForm(profile)}
              className="flex-1"
            >
              Annuler
            </Button>
          )}
          <Button
            type="submit"
            variant="gradient"
            loading={saving}
            disabled={!isDirty}
            className={cn('flex-1', !isDirty && 'opacity-50 cursor-not-allowed')}
          >
            {!saving && (isDirty ? 'Sauvegarder les modifications' : 'Aucune modification')}
          </Button>
        </div>
      </form>
    </div>
  )
}
