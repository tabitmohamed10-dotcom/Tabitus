'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Package, TrendingUp, Star, ArrowRight, ChevronRight, Bell } from 'lucide-react'
import { useMerchantStats, useMerchantOffers } from '@/lib/hooks'
import { formatPrice, formatTimeAgo, getStatusColor, getStatusLabel } from '@/lib/utils'
import { Skeleton } from '@/components/ui/index'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } },
}

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = nodeRef.current
    if (!node || to === 0) { if (node) node.textContent = '0' + suffix; return }
    let frame = 0
    const total = 45
    const update = () => {
      frame++
      const eased = 1 - Math.pow(1 - frame / total, 3)
      node.textContent = Math.round(to * eased) + suffix
      if (frame < total) requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  }, [to, suffix])
  return <span ref={nodeRef}>0{suffix}</span>
}

export default function MerchantDashboard() {
  const { stats, loading: statsLoading } = useMerchantStats()
  const { offers, loading: offersLoading } = useMerchantOffers()
  const loading = statsLoading || offersLoading

  const statCards = [
    {
      label: 'Offres envoyées',
      value: stats.total_offers,
      icon: <Package className="h-5 w-5" />,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      label: 'Offres acceptées',
      value: stats.accepted_offers,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Note moyenne',
      value: stats.rating,
      icon: <Star className="h-5 w-5" />,
      suffix: '/5',
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
  ]

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">Suivez vos performances en temps réel</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        {statCards.map((s) => (
          <motion.div
            key={s.label}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="bg-card rounded-2xl p-4 sm:p-5 border border-border/60 shadow-premium"
          >
            <div className={`h-9 w-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <p className={`text-2xl sm:text-3xl font-display font-bold ${s.color}`}>
              <CountUp to={s.value} suffix={s.suffix || ''} />
            </p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-tight">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Banner */}
      <motion.div variants={fadeUp} className="mb-6">
        <Link href="/dashboard/merchant/requests">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="bg-foreground rounded-2xl p-5 sm:p-6 flex items-center justify-between text-background shadow-lg cursor-pointer overflow-hidden relative"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
            <div className="relative">
              <p className="font-display font-bold text-lg sm:text-xl">Voir les demandes</p>
              <p className="text-background/60 text-sm mt-0.5">Des clients attendent votre offre</p>
            </div>
            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 relative">
              <Bell className="h-6 w-6 text-background" />
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Recent offers */}
      <motion.div
        variants={fadeUp}
        className="bg-card rounded-2xl border border-border/60 shadow-premium overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <h2 className="font-display font-bold text-base">Mes offres récentes</h2>
          <Link
            href="/dashboard/merchant/offers"
            className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            Voir tout <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {!offers.length ? (
          <div className="text-center py-14 px-6">
            <div className="text-5xl mb-4">📭</div>
            <p className="font-semibold mb-1">Aucune offre envoyée</p>
            <p className="text-muted-foreground text-sm mb-5">Consultez les demandes actives</p>
            <Link
              href="/dashboard/merchant/requests"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-xl text-sm"
            >
              <Bell className="h-4 w-4" />
              Voir les demandes
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            <AnimatePresence>
              {offers.slice(0, 5).map((offer, i) => {
                const req = (offer as any).request
                return (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 px-5 py-3.5"
                  >
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                      {req?.category?.icon || '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{req?.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span>📍 {req?.city}</span>
                        <span>·</span>
                        <span>{formatTimeAgo(offer.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-sm font-bold text-primary">{formatPrice(offer.price)}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusColor(offer.status)}`}>
                        {getStatusLabel(offer.status)}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
