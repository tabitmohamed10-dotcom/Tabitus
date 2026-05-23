'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, Sparkles, MapPin, Calendar, DollarSign, ArrowRight, Info } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Label, Card, Badge } from '@/components/ui/index'
import { suggestCategory, suggestBudget, detectSpam } from '@/lib/ai/categorizer'
import { MOROCCAN_CITIES } from '@/lib/utils'

const schema = z.object({
  title: z.string().min(5, 'Au moins 5 caractères').max(120, 'Maximum 120 caractères'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Choisissez une catégorie'),
  budget_min: z.string().optional(),
  budget_max: z.string().optional(),
  city: z.string().min(1, 'Ville requise'),
  deadline: z.string().optional(),
  urgent: z.boolean().default(false),
  delivery_needed: z.boolean().default(true),
})
type FormData = z.infer<typeof schema>

export default function NewRequestPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [categoriesLoaded, setCategoriesLoaded] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<{
    category?: string; budgetMin?: number; budgetMax?: number
  } | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { urgent: false, delivery_needed: true },
  })

  const title = watch('title')
  const categoryId = watch('category_id')

  // Load categories on first focus
  async function loadCategories() {
    if (categoriesLoaded) return
    const { data } = await supabase
      .from('categories')
      .select('id, name, slug, icon, color')
      .order('sort_order')
    setCategories(data || [])
    setCategoriesLoaded(true)
  }

  // AI: analyze title to suggest category + budget
  function analyzeTitle(t: string) {
    if (t.length < 5) return
    const { slug, confidence } = suggestCategory(t)
    if (slug && confidence > 0.3) {
      // Find category ID by slug
      const cat = categories.find(c => c.slug === slug)
      const budget = suggestBudget(t, slug)
      setAiSuggestion({
        category: cat?.id,
        budgetMin: budget?.min,
        budgetMax: budget?.max,
      })
    }
  }

  function applyAiSuggestion() {
    if (!aiSuggestion) return
    if (aiSuggestion.category) setValue('category_id', aiSuggestion.category)
    if (aiSuggestion.budgetMin) setValue('budget_min', String(aiSuggestion.budgetMin))
    if (aiSuggestion.budgetMax) setValue('budget_max', String(aiSuggestion.budgetMax))
    toast.success('Suggestions appliquées !')
    setAiSuggestion(null)
  }

  function handleImageDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  async function onSubmit(data: FormData) {
    setLoading(true)

    // Spam check
    const spam = detectSpam(data.title, data.description)
    if (spam.isSpam) {
      toast.error('Votre demande semble contenir du contenu inapproprié')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let imageUrl: string | null = null

    // Upload image if provided
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `requests/${user.id}/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('tabitus-uploads')
        .upload(path, imageFile, { upsert: true })
      if (!uploadErr) {
        const { data: urlData } = supabase.storage.from('tabitus-uploads').getPublicUrl(path)
        imageUrl = urlData.publicUrl
      }
    }

    const { data: req, error } = await supabase.from('requests').insert({
      buyer_id: user.id,
      title: data.title,
      description: data.description,
      category_id: data.category_id,
      budget_min: data.budget_min ? Number(data.budget_min) : null,
      budget_max: data.budget_max ? Number(data.budget_max) : null,
      city: data.city,
      deadline: data.deadline || null,
      urgent: data.urgent,
      delivery_needed: data.delivery_needed,
      image_url: imageUrl,
    }).select().single()

    if (error) {
      toast.error('Erreur lors de la publication')
      setLoading(false)
      return
    }

    // Trigger matching via API
    fetch('/api/matching', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_id: req.id }),
    })

    toast.success('Demande publiée ! Les commerçants sont alertés 🚀')
    router.push(`/dashboard/buyer/requests/${req.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold">Nouvelle demande</h1>
        <p className="text-muted-foreground mt-1">
          Décrivez ce que vous cherchez et recevez des offres en quelques minutes
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <Card className="p-6">
          <h2 className="font-display font-semibold mb-4">Que cherchez-vous ?</h2>
          <div>
            <Label className="mb-2 block">Titre de votre demande *</Label>
            <Input
              placeholder="Ex: iPhone 15 Pro 256GB, Lave-linge Samsung, Cours d'anglais..."
              {...register('title')}
              error={errors.title?.message}
              onBlur={e => analyzeTitle(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Soyez précis pour attirer les bons commerçants
            </p>
          </div>

          {/* AI Suggestion */}
          {aiSuggestion && (
            <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-accent/80 border border-accent">
              <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Suggestions automatiques détectées</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Catégorie et budget suggérés selon votre titre
                </p>
              </div>
              <Button type="button" size="sm" onClick={applyAiSuggestion} variant="outline">
                Appliquer
              </Button>
            </div>
          )}

          <div className="mt-4">
            <Label className="mb-2 block">Description <span className="text-muted-foreground font-normal">(optionnel)</span></Label>
            <Textarea
              placeholder="Précisez la marque, la couleur, les caractéristiques souhaitées..."
              {...register('description')}
              rows={3}
            />
          </div>
        </Card>

        {/* Category */}
        <Card className="p-6">
          <h2 className="font-display font-semibold mb-4">Catégorie *</h2>
          <select
            {...register('category_id')}
            onFocus={loadCategories}
            className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">-- Choisir une catégorie --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="mt-1 text-xs text-destructive">{errors.category_id.message}</p>
          )}
        </Card>

        {/* Budget */}
        <Card className="p-6">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Budget
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Budget minimum (DH)</Label>
              <Input
                type="number"
                placeholder="Ex: 5000"
                suffix="DH"
                {...register('budget_min')}
              />
            </div>
            <div>
              <Label className="mb-2 block">Budget maximum (DH)</Label>
              <Input
                type="number"
                placeholder="Ex: 8000"
                suffix="DH"
                {...register('budget_max')}
              />
            </div>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
            <Info className="h-3.5 w-3.5" />
            Indiquer un budget attire 3x plus d'offres
          </p>
        </Card>

        {/* Location + Deadline */}
        <Card className="p-6">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Localisation & délai
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Ville *</Label>
              <select
                {...register('city')}
                className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Choisir votre ville</option>
                {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city.message}</p>}
            </div>
            <div>
              <Label className="mb-2 block flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Date limite
              </Label>
              <Input
                type="date"
                {...register('deadline')}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-4 mt-5">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                {...register('urgent')}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">⚡ Demande urgente</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                {...register('delivery_needed')}
                defaultChecked
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">🚚 Livraison souhaitée</span>
            </label>
          </div>
        </Card>

        {/* Image upload */}
        <Card className="p-6">
          <h2 className="font-display font-semibold mb-4">Photo du produit <span className="text-muted-foreground font-normal text-base">(recommandé)</span></h2>
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-2xl"
              />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null) }}
                className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive text-white flex items-center justify-center shadow-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleImageDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
                dragOver ? 'border-primary bg-accent' : 'border-border hover:border-primary/40'
              }`}
              onClick={() => document.getElementById('image-input')?.click()}
            >
              <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium">Glissez une image ou cliquez pour choisir</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP — Max 5 MB</p>
              <input
                id="image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Info className="h-3.5 w-3.5" />
            Les demandes avec photo reçoivent 40% plus d'offres
          </p>
        </Card>

        {/* Submit */}
        <Button type="submit" variant="gradient" size="lg" loading={loading} className="w-full">
          Publier ma demande
          <ArrowRight className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
