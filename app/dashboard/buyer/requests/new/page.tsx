'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  FileText, Tag, DollarSign, MapPin, Zap, Truck, ChevronRight,
  ArrowLeft, Sparkles, CheckCircle2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/index'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const CITIES = ['Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda','Kénitra','Tétouan','El Jadida','Settat','Beni Mellal','Nador','Mohammedia']

const STEPS = [
  { id: 1, label: 'Besoin', icon: FileText },
  { id: 2, label: 'Budget & Ville', icon: DollarSign },
  { id: 3, label: 'Options', icon: Sparkles },
]

export default function NewRequestPage() {
  const router = useRouter()
  const supabase = createClient()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    budget_min: '',
    budget_max: '',
    city: '',
    urgent: false,
    delivery_needed: true,
  })

  useEffect(() => {
    supabase.from('categories').select('id,name,icon').order('sort_order').then(({ data }) => setCategories(data || []))
  }, [])

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  function nextStep() {
    if (step === 1 && (!form.title || !form.category_id)) {
      toast.error('Remplissez le titre et la catégorie')
      return
    }
    if (step === 2 && !form.city) {
      toast.error('Choisissez votre ville')
      return
    }
    setStep(s => s + 1)
  }

  async function handleSubmit() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { data, error } = await supabase.from('requests').insert({
      buyer_id: user.id,
      title: form.title,
      description: form.description || null,
      category_id: form.category_id,
      budget_min: form.budget_min ? Number(form.budget_min) : null,
      budget_max: form.budget_max ? Number(form.budget_max) : null,
      city: form.city,
      urgent: form.urgent,
      delivery_needed: form.delivery_needed,
    }).select().single()

    if (error) {
      toast.error('Erreur lors de la publication')
      setLoading(false)
      return
    }

    toast.success('Demande publiée ! Les commerçants vont vous répondre.')
    router.push(`/dashboard/buyer/requests/${data.id}`)
  }

  const selectedCategory = categories.find(c => c.id === form.category_id)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : router.back()}
          className="h-9 w-9 rounded-xl border border-border/60 bg-card flex items-center justify-center hover:bg-muted/60 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Nouvelle demande</h1>
          <p className="text-sm text-muted-foreground">Étape {step} sur {STEPS.length}</p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const done = step > s.id
          const active = step === s.id
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all',
                done ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400' :
                active ? 'bg-accent text-accent-foreground' :
                'bg-muted/40 text-muted-foreground'
              )}>
                {done
                  ? <CheckCircle2 className="h-3.5 w-3.5" />
                  : <Icon className="h-3.5 w-3.5" />
                }
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border/40" />}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Step 1: What are you looking for */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-premium space-y-5">
              <div>
                <h2 className="font-display font-bold text-base mb-4 flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-primary" />
                  Que cherchez-vous ?
                </h2>
                <Input
                  label="Titre de votre demande *"
                  placeholder="Ex: iPhone 15 Pro 256GB, Lave-linge Samsung 7kg..."
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <h2 className="font-display font-bold text-base mb-4 flex items-center gap-2">
                  <Tag className="h-4.5 w-4.5 text-primary" />
                  Catégorie *
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => set('category_id', cat.id)}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-xl border text-left transition-all duration-150 text-sm',
                        form.category_id === cat.id
                          ? 'border-primary/40 bg-accent/60 text-accent-foreground'
                          : 'border-border/60 bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="font-medium text-xs truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-premium">
              <Textarea
                label="Description (optionnel)"
                placeholder="Plus de détails : couleur, modèle précis, état souhaité, délai..."
                value={form.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => set('description', e.target.value)}
                className="min-h-[90px]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Budget & city */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-premium">
              <h2 className="font-display font-bold text-base mb-5 flex items-center gap-2">
                <DollarSign className="h-4.5 w-4.5 text-primary" />
                Budget (MAD)
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Minimum"
                  placeholder="0"
                  value={form.budget_min}
                  onChange={e => set('budget_min', e.target.value)}
                  suffix="DH"
                />
                <Input
                  type="number"
                  label="Maximum"
                  placeholder="Ex: 14 000"
                  value={form.budget_max}
                  onChange={e => set('budget_max', e.target.value)}
                  suffix="DH"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Renseignez une fourchette pour recevoir des offres pertinentes
              </p>
            </div>

            <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-premium">
              <h2 className="font-display font-bold text-base mb-4 flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-primary" />
                Votre ville *
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CITIES.map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => set('city', city)}
                    className={cn(
                      'px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150',
                      form.city === city
                        ? 'border-primary/40 bg-accent/60 text-accent-foreground'
                        : 'border-border/60 bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Options + review */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-premium">
              <h2 className="font-display font-bold text-base mb-5 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                Options supplémentaires
              </h2>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => set('urgent', !form.urgent)}
                  className={cn(
                    'w-full flex items-center justify-between p-4 rounded-xl border transition-all',
                    form.urgent
                      ? 'border-red-300/60 bg-red-50/60 dark:border-red-700/40 dark:bg-red-950/30'
                      : 'border-border/60 bg-muted/20 hover:bg-muted/40'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'h-9 w-9 rounded-xl flex items-center justify-center',
                      form.urgent ? 'bg-red-100 dark:bg-red-950/50 text-red-600' : 'bg-muted text-muted-foreground'
                    )}>
                      <Zap className="h-4.5 w-4.5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">Demande urgente</p>
                      <p className="text-xs text-muted-foreground">Priorité haute · Les commerçants sont alertés en premier</p>
                    </div>
                  </div>
                  <div className={cn(
                    'h-5 w-9 rounded-full transition-all',
                    form.urgent ? 'bg-red-500' : 'bg-muted'
                  )}>
                    <div className={cn(
                      'h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                      form.urgent ? 'translate-x-4' : 'translate-x-0'
                    )} />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => set('delivery_needed', !form.delivery_needed)}
                  className={cn(
                    'w-full flex items-center justify-between p-4 rounded-xl border transition-all',
                    form.delivery_needed
                      ? 'border-primary/30 bg-accent/40 dark:border-primary/20'
                      : 'border-border/60 bg-muted/20 hover:bg-muted/40'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'h-9 w-9 rounded-xl flex items-center justify-center',
                      form.delivery_needed ? 'bg-brand-500/10 text-primary' : 'bg-muted text-muted-foreground'
                    )}>
                      <Truck className="h-4.5 w-4.5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">Livraison souhaitée</p>
                      <p className="text-xs text-muted-foreground">Inclure les offres avec livraison à domicile</p>
                    </div>
                  </div>
                  <div className={cn(
                    'h-5 w-9 rounded-full transition-all',
                    form.delivery_needed ? 'bg-primary' : 'bg-muted'
                  )}>
                    <div className={cn(
                      'h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                      form.delivery_needed ? 'translate-x-4' : 'translate-x-0'
                    )} />
                  </div>
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-accent/40 border border-primary/15 rounded-2xl p-5">
              <h3 className="font-display font-bold text-sm mb-4 text-foreground/70 uppercase tracking-wide">
                Récapitulatif
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Titre', value: form.title },
                  { label: 'Catégorie', value: selectedCategory ? `${selectedCategory.icon} ${selectedCategory.name}` : '—' },
                  { label: 'Budget', value: form.budget_max ? `≤ ${Number(form.budget_max).toLocaleString('fr-MA')} DH` : 'Non précisé' },
                  { label: 'Ville', value: form.city },
                ].map(item => (
                  <div key={item.label} className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <Button variant="outline" size="lg" onClick={() => setStep(s => s - 1)} className="flex-1">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        )}
        {step < STEPS.length ? (
          <Button variant="gradient" size="lg" onClick={nextStep} className="flex-1">
            Continuer
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="gradient" size="lg" loading={loading} onClick={handleSubmit} className="flex-1">
            {!loading && 'Publier ma demande'}
            {!loading && <Sparkles className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  )
}
