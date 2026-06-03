'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Bell, Shield, Globe, LogOut, ChevronRight, Moon, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Skeleton, Separator } from '@/components/ui/index'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const CITIES = ['Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda','Kénitra','Tétouan','El Jadida','Settat']

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        checked ? 'bg-primary' : 'bg-muted'
      )}
    >
      <div className={cn(
        'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
        checked ? 'translate-x-5' : 'translate-x-0.5'
      )} />
    </button>
  )
}

function SettingRow({
  icon, title, description, children
}: {
  icon: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="h-9 w-9 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          {description && <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export default function BuyerSettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ full_name: '', phone: '', city: '' })
  const [profile, setProfile] = useState<any>(null)
  const [notifs, setNotifs] = useState({ offers: true, messages: true, tips: false })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setForm({ full_name: data?.full_name || '', phone: data?.phone || '', city: data?.city || '' })
      setLoading(false)
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('profiles').update(form).eq('id', user!.id)
    if (error) toast.error('Erreur lors de la sauvegarde')
    else toast.success('Paramètres sauvegardés !')
    setSaving(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Personnalisez votre expérience Tabit</p>
      </div>

      {/* Account settings */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-premium">
        <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-5">Compte</h3>
        <div className="space-y-4">
          <Input
            label="Nom complet"
            value={form.full_name}
            onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
            placeholder="Votre nom"
          />
          <Input
            label="Téléphone"
            type="tel"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="+212 6XX XXX XXX"
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground/80">Ville</label>
            <select
              value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              className={cn(
                'flex h-11 w-full rounded-xl border border-border/70 bg-background px-4 py-2.5 text-sm',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                'transition-all appearance-none cursor-pointer hover:border-border'
              )}
            >
              <option value="">Choisir votre ville</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-border/40">
          <Button variant="gradient" loading={saving} onClick={save} className="w-full sm:w-auto">
            {!saving && 'Sauvegarder les modifications'}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-premium">
        <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">Notifications</h3>
        <div className="divide-y divide-border/40">
          <SettingRow icon={<Bell className="h-4.5 w-4.5" />} title="Nouvelles offres" description="Soyez alerté quand un commerçant répond à votre demande">
            <Toggle checked={notifs.offers} onChange={v => setNotifs(n => ({ ...n, offers: v }))} />
          </SettingRow>
          <SettingRow icon={<Smartphone className="h-4.5 w-4.5" />} title="Messages" description="Notifications pour les nouveaux messages de chat">
            <Toggle checked={notifs.messages} onChange={v => setNotifs(n => ({ ...n, messages: v }))} />
          </SettingRow>
          <SettingRow icon={<Sparkle className="h-4.5 w-4.5" />} title="Conseils & actualités" description="Astuces pour faire de meilleures économies">
            <Toggle checked={notifs.tips} onChange={v => setNotifs(n => ({ ...n, tips: v }))} />
          </SettingRow>
        </div>
      </div>

      {/* Security */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-premium">
        <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">Sécurité</h3>
        <div className="divide-y divide-border/40">
          <button className="w-full flex items-center justify-between py-4 hover:bg-muted/30 -mx-6 px-6 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Changer le mot de passe</p>
                <p className="text-xs text-muted-foreground">Mettre à jour votre mot de passe</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-card border border-destructive/20 rounded-2xl p-6 shadow-premium">
        <h3 className="font-display font-bold text-sm uppercase tracking-wider text-destructive/70 mb-4">Zone de danger</h3>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
              <LogOut className="h-4.5 w-4.5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-destructive">Se déconnecter</p>
              <p className="text-xs text-muted-foreground">Fermer la session sur cet appareil</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-destructive/50 group-hover:text-destructive transition-colors" />
        </button>
      </div>
    </div>
  )
}

// Small Sparkle icon (not in lucide)
function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  )
}
