'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, TrendingUp, Star, ArrowRight, Bell, MessageCircle, Clock, DollarSign } from 'lucide-react'
import { useMerchantStats, useMerchantOffers } from '@/lib/hooks'
import { formatPrice, formatTimeAgo, getStatusColor, getStatusLabel } from '@/lib/utils'
import { Skeleton, EmptyState } from '@/components/ui/index'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = nodeRef.current
    if (!node) return
    if (to === 0) { node.textContent = '0' + suffix; return }
    let frame = 0
    const total = 50
    const update = () => {
      frame++
      const v = to * (1 - Math.pow(1 - frame / total, 3))
      node.textContent = (to < 10 ? v.toFixed(1) : Math.round(v).toString()) + suffix
      if (frame < total) requestAnimationFrame(update)
      else node.textContent = (to < 10 ? to.toFixed(1) : to.toString()) + suffix
    }
    requestAnimationFrame(update)
  }, [to, suffix])
  return <span ref={nodeRef}>0{suffix}</span>
}

export default function MerchantDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const { stats, loading: statsLoading } = useMerchantStats()
  const { offers, loading: offersLoading } = useMerchantOffers()
  const [matchingRequests, setMatchingRequests] = useState<any[]>([])
  const [reqLoading, setReqLoading] = useState(true)

  const loading = statsLoading || offersLoading

  const acceptedOffers = offers.filter(o => o.status === 'accepted')
  const pendingOffers = offers.filter(o => o.status === 'pending')
  const revenue = acceptedOffers.reduce((sum, o) => sum + (o.price || 0), 0)
  const acceptRate = stats.total_offers > 0
    ? Math.round((stats.accepted_offers / stats.total_offers) * 100)
    : 0

  useEffect(() => {
    async function loadMatchingRequests() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setReqLoading(false); return }

      const { data: merchant } = await supabase
        .from('merchants')
        .select('id, categories')
        .eq('user_id', user.id)
        .single()

      if (!merchant) { setReqLoading(false); return }

      const alreadyOffered = offers.map((o: any) => (o.request_id || o.request?.id)).filter(Boolean)

      let query = supabase
        .from('requests')
        .select('id, title, city, budget_max, urgent, created_at, offers_count, category:categories(name, icon)')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(6)

      if (alreadyOffered.length > 0) {
        query = query.not('id', 'in', `(${alreadyOffered.join(',')})`)
      }

      const { data } = await query
      setMatchingRequests(data || [])
      setReqLoading(false)
    }
    if (!offersLoading) loadMatchingRequests()
  }, [offersLoading])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-[110px] rounded-2xl" />)}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    )
  }

  const statCards = [
    {
      label: 'Offres envoyées',
      value: stats.total_offers,
      suffix: '',
      icon: <Package className="h-4 w-4" />,
      iconBg: 'bg-gold-100 text-gold-700',
      valueColor: 'text-gold-700',
    },
    {
      label: 'Acceptées',
      value: stats.accepted_offers,
      suffix: '',
      icon: <TrendingUp className="h-4 w-4" />,
      iconBg: 'bg-green-100 text-green-700',
      valueColor: 'text-green-700',
    },
    {
      label: 'Note moyenne',
      value: stats.rating,
      suffix: '/5',
      icon: <Star className="h-4 w-4" />,
      iconBg: 'bg-amber-100 text-amber-700',
      valueColor: 'text-amber-700',
    },
    {
      label: 'Taux acceptation',
      value: acceptRate,
      suffix: '%',
      icon: <DollarSign className="h-4 w-4" />,
      iconBg: 'bg-blue-100 text-blue-700',
      valueColor: 'text-blue-700',
    },
  ]

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="font-display text-2xl sm:text-[1.75rem] font-bold tracking-tight" style={{fontFamily:'var(--font-playfair)'}}>
          Tableau de bord
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Suivez vos performances en temps réel</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <motion.div
            key={s.label}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-premium cursor-default"
          >
            <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center mb-3', s.iconBg)}>
              {s.icon}
            </div>
            <p className={cn('text-2xl sm:text-3xl font-display font-bold leading-none', s.valueColor)} style={{fontFamily:'var(--font-playfair)'}}>
              <CountUp to={s.value} suffix={s.suffix} />
            </p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 leading-tight font-medium">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue banner */}
      {revenue > 0 && (
        <motion.div variants={fadeUp} className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-premium">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{background:'rgba(201,146,42,0.12)'}}>
              <DollarSign className="h-5 w-5" style={{color:'#C9922A'}} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Chiffre d'affaires généré</p>
              <p className="text-xl font-bold" style={{color:'#C9922A',fontFamily:'var(--font-playfair)'}}>{formatPrice(revenue)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{acceptedOffers.length} vente{acceptedOffers.length > 1 ? 's' : ''} conclue{acceptedOffers.length > 1 ? 's' : ''}</p>
            <p className="text-xs font-semibold" style={{color:'#22C55E'}}>✓ Commission Tabit : {formatPrice(revenue * 0.05)}</p>
          </div>
        </motion.div>
      )}

      {/* CTA Banner */}
      <motion.div variants={fadeUp}>
        <Link href="/dashboard/merchant/requests">
          <motion.div
            whileHover={{ scale: 1.008 }}
            whileTap={{ scale: 0.995 }}
            className="group relative rounded-2xl p-5 sm:p-6 flex items-center justify-between text-white shadow-brand cursor-pointer overflow-hidden"
            style={{background:'#0C0B09'}}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#C9922A,transparent)'}} />
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10">
              <p className="font-bold text-base sm:text-lg leading-tight" style={{fontFamily:'var(--font-playfair)',color:'#F0E8D4'}}>Voir les demandes</p>
              <p className="text-sm mt-0.5" style={{color:'rgba(255,255,255,0.5)'}}>Des acheteurs attendent votre offre maintenant</p>
            </div>
            <div className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 relative z-10 transition-transform group-hover:scale-105" style={{background:'rgba(201,146,42,0.2)',border:'1px solid rgba(201,146,42,0.3)'}}>
              <Bell className="h-5 w-5" style={{color:'#C9922A'}} />
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Accepted offers with Chat button */}
      <motion.div variants={fadeUp} className="bg-card rounded-2xl border border-border shadow-premium overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <h2 className="font-display font-bold text-[15px]" style={{fontFamily:'var(--font-playfair)'}}>
              Offres acceptées ({acceptedOffers.length})
            </h2>
          </div>
          <Link href="/dashboard/merchant/offers" className="flex items-center gap-1 text-sm text-primary font-semibold hover:gap-1.5 transition-all">
            Voir tout <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {acceptedOffers.length === 0 ? (
          <div className="px-5 py-8 text-center text-muted-foreground text-sm">
            <p className="text-2xl mb-2">🤝</p>
            <p>Aucune offre acceptée pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {acceptedOffers.slice(0, 5).map((offer, i) => {
              const req = (offer as any).request
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  className="flex items-center gap-3 px-5 py-3.5"
                >
                  <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center text-lg shrink-0">
                    {req?.category?.icon || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{req?.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                      <span className="shrink-0">📍 {req?.city}</span>
                      <span>·</span>
                      <span className="font-bold text-green-600">{formatPrice(offer.price)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/chat/${offer.id}`)}
                    style={{background:'linear-gradient(135deg,#8B6914,#C9922A)',color:'#0C0B09',border:'none',padding:'8px 16px',borderRadius:8,cursor:'pointer',fontSize:12,fontWeight:700,display:'flex',alignItems:'center',gap:5,flexShrink:0,whiteSpace:'nowrap'}}
                  >
                    💬 Ouvrir le chat
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Pending offers */}
      <motion.div variants={fadeUp} className="bg-card rounded-2xl border border-border shadow-premium overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <h2 className="font-display font-bold text-[15px]" style={{fontFamily:'var(--font-playfair)'}}>
              Offres en attente ({pendingOffers.length})
            </h2>
          </div>
        </div>
        {pendingOffers.length === 0 ? (
          <div className="px-5 py-8 text-center text-muted-foreground text-sm">
            <p className="text-2xl mb-2">📤</p>
            <p>Aucune offre en attente de réponse</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {pendingOffers.slice(0, 5).map((offer, i) => {
              const req = (offer as any).request
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  className="group flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-lg shrink-0">
                    {req?.category?.icon || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{req?.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                      <span className="shrink-0">📍 {req?.city}</span>
                      <span>·</span>
                      <span className="shrink-0">{formatTimeAgo(offer.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-sm font-bold text-primary">{formatPrice(offer.price)}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      En attente
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* New matching requests */}
      <motion.div variants={fadeUp} className="bg-card rounded-2xl border border-border shadow-premium overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <h2 className="font-display font-bold text-[15px]" style={{fontFamily:'var(--font-playfair)'}}>
              Nouvelles demandes pour vous
            </h2>
          </div>
          <Link href="/dashboard/merchant/requests" className="flex items-center gap-1 text-sm text-primary font-semibold hover:gap-1.5 transition-all">
            Voir tout <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {reqLoading ? (
          <div className="divide-y divide-border/40">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : matchingRequests.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="Aucune nouvelle demande"
            description="Revenez bientôt, de nouvelles demandes sont publiées chaque jour"
            action={
              <Link href="/dashboard/merchant/requests">
                <Button variant="premium" size="sm">
                  <Bell className="h-4 w-4" />
                  Voir toutes les demandes
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-border/40">
            <AnimatePresence initial={false}>
              {matchingRequests.map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <Link href={`/dashboard/merchant/requests?highlight=${req.id}`}>
                    <div className="group flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors cursor-pointer">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-lg shrink-0">
                        {(req.category as any)?.icon || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-sm truncate">{req.title}</p>
                          {req.urgent && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full shrink-0">URGENT</span>}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                          <span className="shrink-0">📍 {req.city}</span>
                          <span>·</span>
                          <span className="shrink-0">{req.offers_count || 0} offre{(req.offers_count || 0) !== 1 ? 's' : ''}</span>
                          {req.budget_max && <><span>·</span><span className="text-primary font-medium">≤{req.budget_max} MAD</span></>}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground shrink-0">{formatTimeAgo(req.created_at)}</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
