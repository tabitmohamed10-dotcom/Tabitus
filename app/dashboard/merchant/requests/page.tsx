'use client'
import { useState, useEffect } from 'react'
import { Search, Filter, Clock, MapPin, Zap, Package, X, Send, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Label, Card, Badge } from '@/components/ui/index'
import { formatPrice, formatTimeAgo, MOROCCAN_CITIES } from '@/lib/utils'

interface Request {
  id: string
  title: string
  description: string
  budget_min: number | null
  budget_max: number | null
  city: string
  urgent: boolean
  delivery_needed: boolean
  offers_count: number
  created_at: string
  category_name: string
  category_icon: string
  category_color: string
  buyer_name: string
}

interface OfferForm {
  price: string
  delivery_days: string
  free_delivery: boolean
  note: string
}

export default function MerchantRequestsPage() {
  const supabase = createClient()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [myMerchantId, setMyMerchantId] = useState<string | null>(null)
  const [myOfferIds, setMyOfferIds] = useState<Set<string>>(new Set())

  // Offer modal
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [offerForm, setOfferForm] = useState<OfferForm>({
    price: '', delivery_days: '3', free_delivery: false, note: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: m } = await supabase
        .from('merchants').select('id').eq('user_id', user.id).single()
      if (m) {
        setMyMerchantId(m.id)
        // Load my offer request IDs to show "already offered"
        const { data: offers } = await supabase
          .from('offers').select('request_id').eq('merchant_id', m.id)
        if (offers) setMyOfferIds(new Set(offers.map(o => o.request_id)))
      }

      await loadRequests()
    }
    init()
  }, [])

  async function loadRequests(city?: string, q?: string) {
    setLoading(true)
    let query = supabase
      .from('v_request_feed')
      .select('*')
      .order('urgent', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(30)

    if (city) query = query.eq('city', city)
    if (q) query = query.ilike('title', `%${q}%`)

    const { data } = await query
    setRequests(data || [])
    setLoading(false)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadRequests(cityFilter || undefined, search || undefined)
    }, 300)
    return () => clearTimeout(timeout)
  }, [search, cityFilter])

  async function submitOffer() {
    if (!selectedRequest || !myMerchantId) return
    if (!offerForm.price) { toast.error('Indiquez un prix'); return }

    setSubmitting(true)

    const { error } = await supabase.from('offers').insert({
      request_id: selectedRequest.id,
      merchant_id: myMerchantId,
      price: Number(offerForm.price),
      delivery_days: Number(offerForm.delivery_days),
      free_delivery: offerForm.free_delivery,
      note: offerForm.note || null,
    })

    if (error) {
      if (error.code === '23505') {
        toast.error('Vous avez déjà envoyé une offre pour cette demande')
      } else {
        toast.error('Erreur lors de l\'envoi')
      }
    } else {
      toast.success('🎉 Offre envoyée ! L\'acheteur a été notifié.')
      setMyOfferIds(prev => new Set([...prev, selectedRequest.id]))
      setSelectedRequest(null)
      setOfferForm({ price: '', delivery_days: '3', free_delivery: false, note: '' })
    }
    setSubmitting(false)
  }

  const filtered = requests.filter(r => !myOfferIds.has(r.id) || true) // show all, mark offered

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold">Demandes disponibles</h1>
        <p className="text-muted-foreground mt-1">
          Répondez aux demandes qui correspondent à votre activité
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une demande..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <select
          value={cityFilter}
          onChange={e => setCityFilter(e.target.value)}
          className="h-11 rounded-xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-48"
        >
          <option value="">Toutes les villes</option>
          {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} demande{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
      </p>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-semibold mb-2">Aucune demande trouvée</p>
          <p className="text-sm text-muted-foreground">Essayez d'autres filtres</p>
        </Card>
      ) : (
        <div className="space-y-4 stagger-children">
          {filtered.map(req => {
            const alreadyOffered = myOfferIds.has(req.id)
            return (
              <Card
                key={req.id}
                className={`p-5 transition-all ${alreadyOffered ? 'opacity-60' : 'hover:shadow-premium-hover hover:-translate-y-0.5 cursor-pointer'}`}
              >
                <div className="flex items-start gap-4">
                  {/* Category icon */}
                  <div
                    className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: (req.category_color || '#f97316') + '20' }}
                  >
                    {req.category_icon || '📦'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate">{req.title}</h3>
                          {req.urgent && <Badge variant="urgent" className="text-[10px]">⚡ Urgent</Badge>}
                          {req.delivery_needed && <Badge variant="info" className="text-[10px]">🚚 Livraison</Badge>}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                          <span>{req.category_name}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{req.city}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />{formatTimeAgo(req.created_at)}
                          </span>
                        </div>
                        {req.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                            {req.description}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        {req.budget_max ? (
                          <p className="font-bold text-primary text-sm">
                            Budget: {formatPrice(req.budget_max)}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">Budget non précisé</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {req.offers_count} offre{req.offers_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      {alreadyOffered ? (
                        <Badge variant="success">✓ Offre envoyée</Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="gradient"
                          onClick={() => setSelectedRequest(req)}
                        >
                          <Send className="h-3.5 w-3.5" />
                          Faire une offre
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Offer Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-3xl w-full max-w-lg shadow-2xl animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="font-display font-bold text-lg">Envoyer une offre</h2>
                <p className="text-sm text-muted-foreground mt-0.5 truncate max-w-xs">
                  {selectedRequest.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Request summary */}
            <div className="px-6 py-4 bg-muted/30 border-b">
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {selectedRequest.city}
                </span>
                {selectedRequest.budget_max && (
                  <span className="flex items-center gap-1.5 font-medium text-primary">
                    <DollarSign className="h-4 w-4" />
                    Budget max: {formatPrice(selectedRequest.budget_max)}
                  </span>
                )}
                {selectedRequest.offers_count > 0 && (
                  <span className="text-muted-foreground">
                    {selectedRequest.offers_count} concurrent{selectedRequest.offers_count > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Votre prix *</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 4500"
                    suffix="DH"
                    value={offerForm.price}
                    onChange={e => setOfferForm(p => ({ ...p, price: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Délai de livraison</Label>
                  <Input
                    type="number"
                    placeholder="3"
                    suffix="jours"
                    value={offerForm.delivery_days}
                    onChange={e => setOfferForm(p => ({ ...p, delivery_days: e.target.value }))}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={offerForm.free_delivery}
                  onChange={e => setOfferForm(p => ({ ...p, free_delivery: e.target.checked }))}
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm font-medium">🚚 Livraison gratuite incluse</span>
              </label>

              <div>
                <Label className="mb-2 block">Message <span className="text-muted-foreground font-normal">(optionnel)</span></Label>
                <Textarea
                  placeholder="Présentez votre offre, garanties, conditions..."
                  value={offerForm.note}
                  onChange={e => setOfferForm(p => ({ ...p, note: e.target.value }))}
                  rows={3}
                />
              </div>

              {selectedRequest.budget_max && offerForm.price && (
                Number(offerForm.price) <= selectedRequest.budget_max ? (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700">
                    ✓ Votre prix est dans le budget de l'acheteur
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-sm text-yellow-700">
                    ⚠ Votre prix dépasse le budget indiqué — l'acheteur peut quand même accepter
                  </div>
                )
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 pt-0">
              <Button variant="outline" onClick={() => setSelectedRequest(null)} className="flex-1">
                Annuler
              </Button>
              <Button
                variant="gradient"
                loading={submitting}
                onClick={submitOffer}
                className="flex-2"
              >
                <Send className="h-4 w-4" />
                Envoyer l'offre
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
