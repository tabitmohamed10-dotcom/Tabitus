'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, Save, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Label, Card, Badge } from '@/components/ui/index'
import { MOROCCAN_CITIES } from '@/lib/utils'

const schema = z.object({
  business_name: z.string().min(2),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(1),
  phone: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const ALL_CATEGORIES = [
  { slug: 'smartphones', name: '📱 Smartphones' },
  { slug: 'informatique', name: '💻 Informatique' },
  { slug: 'electromenager', name: '🏠 Électroménager' },
  { slug: 'meubles', name: '🛋️ Meubles' },
  { slug: 'mode-homme', name: '👔 Mode Homme' },
  { slug: 'mode-femme', name: '👗 Mode Femme' },
  { slug: 'chaussures', name: '👟 Chaussures' },
  { slug: 'alimentation', name: '🛒 Alimentation' },
  { slug: 'pharmacie', name: '💊 Pharmacie' },
  { slug: 'voitures', name: '🚗 Voitures' },
  { slug: 'bricolage', name: '🔧 Bricolage' },
  { slug: 'dev-web', name: '👨‍💻 Dev Web' },
  { slug: 'design', name: '🎨 Design' },
  { slug: 'menage', name: '🧹 Ménage' },
  { slug: 'coiffure', name: '💈 Coiffure' },
  { slug: 'parfums', name: '💄 Parfums & Cosmétiques' },
  { slug: 'bijoux', name: '💎 Bijoux & Montres' },
  { slug: 'hotels', name: '🏨 Hôtels' },
]

export default function MerchantProfilePage() {
  const supabase = createClient()
  const [merchant, setMerchant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: m } = await supabase
        .from('merchants').select('*').eq('user_id', user.id).single()
      if (m) {
        setMerchant(m)
        setSelectedCategories(m.categories || [])
        setLogoPreview(m.logo_url)
        reset({
          business_name: m.business_name,
          description: m.description || '',
          address: m.address || '',
          city: m.city,
          phone: m.phone || '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  function toggleCategory(slug: string) {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    )
  }

  async function onSubmit(data: FormData) {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let logoUrl = merchant?.logo_url || null

    if (logoFile) {
      const path = `logos/${user.id}/${Date.now()}.${logoFile.name.split('.').pop()}`
      const { error } = await supabase.storage
        .from('tabit-uploads').upload(path, logoFile, { upsert: true })
      if (!error) {
        const { data: urlData } = supabase.storage.from('tabit-uploads').getPublicUrl(path)
        logoUrl = urlData.publicUrl
      }
    }

    if (merchant) {
      await supabase.from('merchants').update({
        ...data,
        categories: selectedCategories,
        logo_url: logoUrl,
      }).eq('id', merchant.id)
    } else {
      await supabase.from('merchants').insert({
        user_id: user.id,
        ...data,
        categories: selectedCategories,
        logo_url: logoUrl,
      })
    }

    toast.success('Profil boutique mis à jour ✅')
    setSaving(false)
  }

  if (loading) return <div className="h-64 flex items-center justify-center text-muted-foreground">Chargement...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold">Profil boutique</h1>
        <p className="text-muted-foreground mt-1">
          Un profil complet reçoit 3x plus de visibilité
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Logo */}
        <Card className="p-6">
          <h2 className="font-display font-semibold mb-4">Logo de votre boutique</h2>
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-border bg-muted">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-brand-gradient flex items-center justify-center text-white font-bold text-2xl">
                  {merchant?.business_name?.[0] || '🏪'}
                </div>
              )}
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('logo-input')?.click()}
              >
                <Upload className="h-4 w-4" />
                Changer le logo
              </Button>
              <input
                id="logo-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)) }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG · Max 2 MB</p>
            </div>
          </div>
        </Card>

        {/* Infos principales */}
        <Card className="p-6 space-y-5">
          <h2 className="font-display font-semibold">Informations boutique</h2>
          <div>
            <Label className="mb-2 block">Nom de la boutique *</Label>
            <Input
              placeholder="Mon Commerce SARL"
              {...register('business_name')}
              error={errors.business_name?.message}
            />
          </div>
          <div>
            <Label className="mb-2 block">Description</Label>
            <Textarea
              placeholder="Décrivez votre activité, vos spécialités, votre expérience..."
              {...register('description')}
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Ville *</Label>
              <select
                {...register('city')}
                className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Choisir</option>
                {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label className="mb-2 block">Adresse</Label>
              <Input placeholder="Rue, quartier" {...register('address')} />
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Téléphone professionnel</Label>
            <Input type="tel" placeholder="+212 5 00 00 00 00" {...register('phone')} />
          </div>
        </Card>

        {/* Categories */}
        <Card className="p-6">
          <h2 className="font-display font-semibold mb-2">Vos catégories d'activité *</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Sélectionnez les catégories dans lesquelles vous proposez des produits/services.
            Vous recevrez uniquement les demandes correspondantes.
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => toggleCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                  selectedCategories.includes(cat.slug)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:border-primary/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {selectedCategories.length > 0 && (
            <p className="text-xs text-primary mt-3 font-medium">
              {selectedCategories.length} catégorie{selectedCategories.length > 1 ? 's' : ''} sélectionnée{selectedCategories.length > 1 ? 's' : ''}
            </p>
          )}
        </Card>

        <Button type="submit" variant="gradient" size="lg" loading={saving} className="w-full">
          <Save className="h-4 w-4" />
          Enregistrer le profil
        </Button>
      </form>
    </div>
  )
}
