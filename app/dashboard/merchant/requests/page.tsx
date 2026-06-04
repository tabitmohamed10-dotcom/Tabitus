'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useOpenRequests } from '@/lib/hooks'
import { MOROCCAN_CITIES } from '@/lib/utils'
import { Zap, Clock, MapPin, SlidersHorizontal, X, Send, ChevronDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/index'

const QUICK_CATEGORIES = [
  { slug: '',             name: 'Toutes' },
  { slug: 'smartphones',  name: '📱 Smartphones' },
  { slug: 'informatique', name: '💻 Informatique' },
  { slug: 'electromenager', name: '🏠 Électro' },
  { slug: 'mode-femme',   name: '👗 Mode' },
  { slug: 'alimentation', name: '🛒 Alimentaire' },
  { slug: 'voitures',     name: '🚗 Auto' },
  { slug: 'bricolage',    name: '🔧 Bricolage' },
  { slug: 'pharmacie',    name: '💊 Pharmacie' },
]

function getTimeInfo(createdAt: string): { label: string; hot: boolean } {
  const diff = Date.now() - new Date(createdAt).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 5)   return { label: 'NOUVEAU',        hot: true }
  if (mins < 60)  return { label: `${mins}min`,     hot: false }
  const h = Math.floor(mins / 60)
  if (h < 24)     return { label: `${h}h`,          hot: false }
  return           { label: `${Math.floor(h/24)}j`, hot: false }
}

export default function MerchantRequestsPage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [price, setPrice] = useState('')
  const [deliveryDays, setDeliveryDays] = useState('3')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { requests, loading } = useOpenRequests({
    category: selectedCategory || undefined,
    city: selectedCity || undefined,
  })

  const activeFilters = [selectedCategory, selectedCity].filter(Boolean).length

  async function submitOffer() {
    if (!price || !selectedRequest) return
    setSubmitting(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: merchant } = await supabase.from('merchants').select('id').eq('user_id', user.id).single()
    if (!merchant) { alert('Configurez votre profil boutique d\'abord.'); setSubmitting(false); return }
    const { error } = await supabase.from('offers').insert({
      request_id: selectedRequest.id,
      merchant_id: merchant.id,
      price: Number(price),
      delivery_days: Number(deliveryDays),
      note: note || null,
    })
    if (error) { alert('Erreur: ' + error.message); setSubmitting(false); return }
    setSelectedRequest(null)
    setPrice('')
    setNote('')
    setSubmitting(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Demandes disponibles</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {loading ? '...' : `${requests.length} demande${requests.length !== 1 ? 's' : ''}`} correspondent à votre profil
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-colors ${
              showFilters || activeFilters > 0
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
            {activeFilters > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-destructive rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </motion.button>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 bg-card rounded-2xl border border-border/60 shadow-premium">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">Filtrer par ville</span>
                  {activeFilters > 0 && (
                    <button
                      onClick={() => { setSelectedCategory(''); setSelectedCity('') }}
                      className="text-xs text-destructive flex items-center gap-1"
                    >
                      <X className="h-3 w-3" /> Effacer tout
                    </button>
                  )}
                </div>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background appearance-none focus:outline-none focus:ring-2 focus:ring-ring pr-8"
                  >
                    <option value="">Toutes les villes</option>
                    {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Category chips */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide -mx-4 px-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {QUICK_CATEGORIES.map(cat => (
          <motion.button
            key={cat.slug}
            whileTap={{ scale: 0.92 }}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
              selectedCategory === cat.slug
                ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                : 'bg-card border-border hover:border-primary/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : requests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-semibold text-lg mb-1">Aucune demande disponible</p>
          <p className="text-muted-foreground text-sm">
            {activeFilters > 0 ? 'Essayez de modifier vos filtres' : 'Revenez plus tard'}
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {requests.map((req, i) => {
              const time = getTimeInfo(req.created_at)
              return (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 24 }}
                  className="bg-card rounded-2xl p-5 border border-border/60 shadow-premium"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-2xl shrink-0">
                      {(req as any).category_icon || '📦'}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-sm leading-tight">{req.title}</h3>
                        {req.urgent && (
                          <motion.span
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 1.8 }}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full"
                          >
                            <Zap className="h-2.5 w-2.5" /> URGENT
                          </motion.span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap">
                        <span>{(req as any).category_name}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" /> {req.city}
                        </span>
                        <span>·</span>
                        <span className={`flex items-center gap-0.5 font-medium ${time.hot ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {time.hot ? (
                            <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                              🔴
                            </motion.span>
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {time.label}
                        </span>
                      </div>

                      {req.description && (
                        <p className="text-xs text-foreground/60 line-clamp-2 mb-3">{req.description}</p>
                      )}

                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3 text-xs">
                          {req.budget_max ? (
                            <span className="font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                              💰 max {req.budget_max} MAD
                            </span>
                          ) : null}
                          <span className="text-muted-foreground">
                            {req.offers_count || 0} offre{(req.offers_count || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedRequest(req)}
                          className="flex items-center gap-1.5 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-xl text-sm shadow-md shadow-primary/20"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Faire une offre
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </AnimatePresence>
      )}

      {/* Offer modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50"
            onClick={e => e.target === e.currentTarget && setSelectedRequest(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="bg-background rounded-3xl w-full max-w-md p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="font-display font-bold text-lg">Envoyer une offre</h2>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{selectedRequest.title}</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold block mb-2">Votre prix (MAD) *</label>
                  <input
                    type="number"
                    placeholder={selectedRequest.budget_max ? `Budget max : ${selectedRequest.budget_max} MAD` : 'Ex: 1500'}
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-2">Délai de livraison (jours)</label>
                  <select
                    value={deliveryDays}
                    onChange={e => setDeliveryDays(e.target.value)}
                    className="w-full border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  >
                    {[1,2,3,5,7,14,30].map(d => <option key={d} value={d}>{d} jour{d > 1 ? 's' : ''}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-2">Message (optionnel)</label>
                  <textarea
                    placeholder="Présentez votre offre, vos garanties..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="w-full border border-input rounded-xl px-4 py-3 h-20 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 border border-border font-semibold py-3 rounded-xl text-sm hover:bg-muted transition-colors"
                  >
                    Annuler
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={submitOffer}
                    disabled={submitting || !price}
                    className="flex-1 bg-brand-gradient text-noir font-bold py-3 rounded-xl text-sm disabled:opacity-50 shadow-md shadow-brand-500/20 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Envoi...
                      </>
                    ) : (
                      <><Send className="h-4 w-4" /> Envoyer l'offre</>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
