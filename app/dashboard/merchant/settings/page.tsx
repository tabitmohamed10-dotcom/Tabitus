'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { User, Store, Phone, MapPin, CheckCircle2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CITIES = ['Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda','Kénitra','Tétouan']

const inputClass = cn(
  'flex h-11 w-full rounded-xl border border-border/70 bg-background px-4 py-2.5 text-sm pl-10',
  'text-foreground placeholder:text-muted-foreground/60 transition-all duration-150',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-primary/50',
  'hover:border-border'
)

export default function MerchantSettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      const { data: m } = await supabase.from('merchants').select('*').eq('user_id', user.id).single()
      setFullName(p?.full_name || '')
      setPhone(p?.phone || '')
      setCity(m?.city || '')
      setBusinessName(m?.business_name || '')
    }
    load()
  }, [])

  async function save() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').update({ full_name: fullName, phone, city }).eq('id', user!.id)
    await supabase.from('merchants').update({ business_name: businessName, city }).eq('user_id', user!.id)
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold tracking-tight mb-7">Paramètres boutique</h1>

      <div className="bg-card border border-border/60 rounded-2xl shadow-premium overflow-hidden">
        {saved && (
          <div className="flex items-center gap-2 px-5 py-3.5 bg-emerald-950/40 border-b border-emerald-800/30 text-emerald-400 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Profil mis à jour avec succès
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground/80">Nom complet</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} placeholder="Votre nom" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground/80">Nom de la boutique</label>
            <div className="relative">
              <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} className={inputClass} placeholder="Ma boutique" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground/80">Téléphone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+212 6XX XXX XXX" className={inputClass} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground/80">Ville</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className={cn(inputClass, 'appearance-none cursor-pointer')}
              >
                <option value="">Choisir votre ville</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <Button variant="gradient" size="lg" loading={loading} className="w-full mt-2" onClick={save}>
            {!loading && 'Sauvegarder les modifications'}
          </Button>
        </div>

        <div className="px-6 pb-6">
          <div className="h-px bg-border/40 mb-5" />
          <Link href="/auth/logout">
            <Button variant="destructive" size="sm" className="w-full gap-2">
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
