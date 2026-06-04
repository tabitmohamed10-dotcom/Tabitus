'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Bell, CheckCircle2, Star, Zap, Trophy, Truck, ChevronLeft } from 'lucide-react'
import { useRequest } from '@/lib/hooks'
import { playOfferNotification } from '@/lib/utils/sound'
import { Skeleton } from '@/components/ui/index'

// ── Animated "New offer" banner ─────────────────────────────────
function NewOfferBanner({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground rounded-2xl px-5 py-3 shadow-2xl shadow-brand-500/30 flex items-center gap-3 whitespace-nowrap"
        >
          <motion.div animate={{ rotate: [0, -15, 15, -10, 10, 0] }} transition={{ duration: 0.6 }}>
            <Bell className="h-5 w-5" />
          </motion.div>
          <span className="font-semibold text-sm">Nouvelle offre reçue !</span>
          <span className="text-primary-foreground/70 text-xs">🔔</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Pulse dot ───────────────────────────────────────────────────
function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
    </span>
  )
}

function isNewOffer(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < 5 * 60 * 1000
}

export default function RequestDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { request, offers, loading } = useRequest(id as string)
  const [accepting, setAccepting] = useState<string | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const prevCount = useRef(0)
  const bannerRef = useRef<NodeJS.Timeout | null>(null)

  // Play sound + show banner when a new offer arrives
  useEffect(() => {
    if (loading) return
    if (offers.length > prevCount.current && prevCount.current > 0) {
      playOfferNotification()
      setShowBanner(true)
      if (bannerRef.current) clearTimeout(bannerRef.current)
      bannerRef.current = setTimeout(() => setShowBanner(false), 4000)
    }
    prevCount.current = offers.length
    return () => { if (bannerRef.current) clearTimeout(bannerRef.current) }
  }, [offers.length, loading])

  async function acceptOffer(offerId: string) {
    if (!confirm('Accepter cette offre ?')) return
    setAccepting(offerId)
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { error } = await supabase.rpc('accept_offer', { p_offer_id: offerId })
    if (error) { alert('Erreur: ' + error.message); setAccepting(null); return }
    router.push(`/chat/${offerId}`)
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-6 w-40" />
        {[1,2,3].map(i => <Skeleton key={i} className="h-44 rounded-2xl" />)}
      </div>
    )
  }

  const isClosed = ['closed','accepted','cancelled','completed'].includes(request?.status || '')

  return (
    <div className="max-w-2xl mx-auto">
      <NewOfferBanner show={showBanner} />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5"
      >
        <ChevronLeft className="h-4 w-4" /> Retour
      </motion.button>

      {/* Request card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 border border-border/60 shadow-premium mb-6"
      >
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-2xl shrink-0">
            {(request as any)?.category?.icon || '📦'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h1 className="font-display font-bold text-xl leading-tight">{request?.title}</h1>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${
                  isClosed ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                }`}
              >
                {isClosed ? 'Fermée' : '🟢 Ouverte'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">
              {(request as any)?.category?.name} · 📍 {request?.city}
            </p>
            {request?.description && (
              <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{request.description}</p>
            )}
            {request?.budget_max && (
              <div className="mt-3 inline-flex items-center gap-1.5 bg-accent border border-primary/15 text-primary font-semibold text-sm px-3 py-1.5 rounded-xl">
                💰 Budget max : {request.budget_max} MAD
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Offers header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        className="flex items-center gap-2.5 mb-4"
      >
        <h2 className="font-display font-bold text-lg">
          {offers.length} offre{offers.length !== 1 ? 's' : ''} reçue{offers.length !== 1 ? 's' : ''}
        </h2>
        {!isClosed && <LiveDot />}
      </motion.div>

      {/* Empty state */}
      {offers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-14 text-center border border-border/60 shadow-premium"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.5 }}
            className="text-5xl mb-4"
          >
            ⏳
          </motion.div>
          <p className="font-semibold">En attente d'offres</p>
          <p className="text-muted-foreground text-sm mt-2">Les commerçants vont répondre bientôt</p>
        </motion.div>
      )}

      {/* Offers list */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-4">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              layout
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.06, type: 'spring', stiffness: 280, damping: 24 }}
              className={`bg-card rounded-2xl p-5 sm:p-6 border shadow-premium transition-shadow ${
                index === 0 && !isClosed
                  ? 'border-primary/60 ring-2 ring-primary/20'
                  : offer.status === 'accepted'
                  ? 'border-green-300 ring-2 ring-green-400/20'
                  : 'border-border/60'
              }`}
            >
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {index === 0 && !isClosed && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-primary bg-accent px-2.5 py-1 rounded-full">
                    <Trophy className="h-3.5 w-3.5" /> MEILLEURE OFFRE
                  </span>
                )}
                {offer.status === 'accepted' && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="h-3.5 w-3.5" /> ACCEPTÉE
                  </span>
                )}
                {isNewOffer(offer.created_at) && offer.status !== 'accepted' && (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="flex items-center gap-1 text-[11px] font-bold text-primary bg-brand-50 px-2.5 py-1 rounded-full"
                  >
                    <Zap className="h-3.5 w-3.5" /> NOUVEAU
                  </motion.span>
                )}
              </div>

              {/* Merchant info + price */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-display font-bold text-lg shrink-0">
                    {offer.business_name?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{offer.business_name || 'Commerçant'}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{offer.merchant_rating > 0 ? offer.merchant_rating : 'Nouveau'}</span>
                      {offer.merchant_verified && (
                        <span className="text-primary font-medium">✓ Vérifié</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-display font-bold text-primary">{offer.price} MAD</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 justify-end">
                    <Truck className="h-3 w-3" />
                    <span>{offer.delivery_days}j · {offer.free_delivery ? 'Gratuit' : `+${offer.delivery_fee || 0} MAD`}</span>
                  </div>
                </div>
              </div>

              {/* Note */}
              {offer.note && (
                <div className="mt-4 bg-muted/60 rounded-xl p-3 text-sm text-muted-foreground italic">
                  "{offer.note}"
                </div>
              )}

              {/* Action */}
              {offer.status === 'accepted' ? (
                <Link
                  href={`/chat/${offer.id}`}
                  className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-center block transition-colors"
                >
                  💬 Ouvrir le chat
                </Link>
              ) : !isClosed && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => acceptOffer(offer.id)}
                  disabled={!!accepting}
                  className="mt-4 w-full bg-brand-gradient text-noir font-bold py-3.5 rounded-xl disabled:opacity-60 shadow-md shadow-brand-500/20 text-sm"
                >
                  {accepting === offer.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Acceptation en cours...
                    </span>
                  ) : (
                    `Accepter cette offre — ${offer.price} MAD`
                  )}
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}
