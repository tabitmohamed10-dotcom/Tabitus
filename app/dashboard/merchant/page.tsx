'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Package, TrendingUp, Star, ArrowRight, ChevronRight,
  Bell, BarChart3,
} from 'lucide-react'
import { useMerchantStats, useMerchantOffers } from '@/lib/hooks'
import { formatPrice, formatTimeAgo, getStatusColor, getStatusLabel } from '@/lib/utils'
import { Skeleton, EmptyState } from '@/components/ui/index'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  const { stats, loading: statsLoading } = useMerchantStats()
  const { offers, loading: offersLoading } = useMerchantOffers()
  const loading = statsLoading || offersLoading

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-[110px] rounded-2xl" />)}
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
      icon: <Package className="h-4.5 w-4.5" />,
      iconBg: 'bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400',
      valueColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Offres acceptées',
      value: stats.accepted_offers,
      suffix: '',
      icon: <TrendingUp className="h-4.5 w-4.5" />,
      iconBg: 'bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400',
      valueColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Note moyenne',
      value: stats.rating,
      suffix: '/5',
      icon: <Star className="h-4.5 w-4.5" />,
      iconBg: 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
      valueColor: 'text-amber-600 dark:text-amber-400',
    },
  ]

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-7">
        <h1 className="font-display text-2xl sm:text-[1.75rem] font-bold tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Suivez vos performances en temps réel</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 mb-5">
        {statCards.map((s) => (
          <motion.div
            key={s.label}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="bg-card border border-border/60 rounded-2xl p-4 sm:p-5 shadow-premium cursor-default"
          >
            <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center mb-3', s.iconBg)}>
              {s.icon}
            </div>
            <p className={cn('text-2xl sm:text-3xl font-display font-bold leading-none', s.valueColor)}>
              <CountUp to={s.value} suffix={s.suffix} />
            </p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 leading-tight font-medium">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Banner — browse requests */}
      <motion.div variants={fadeUp} className="mb-5">
        <Link href="/dashboard/merchant/requests">
          <motion.div
            whileHover={{ scale: 1.008 }}
            whileTap={{ scale: 0.995 }}
            className="group relative bg-foreground rounded-2xl p-5 sm:p-6 flex items-center justify-between text-background shadow-elevated cursor-pointer overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -right-2 bottom-0 h-16 w-16 rounded-full bg-white/3 pointer-events-none" />
            <div className="relative z-10">
              <p className="font-display font-bold text-base sm:text-lg leading-tight">Voir les demandes</p>
              <p className="text-background/55 text-sm mt-0.5">Des acheteurs attendent votre offre maintenant</p>
            </div>
            <div className="h-11 w-11 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 relative z-10 transition-transform group-hover:scale-105">
              <Bell className="h-5 w-5 text-background" />
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
          <h2 className="font-display font-bold text-[15px]">Mes offres récentes</h2>
          <Link
            href="/dashboard/merchant/offers"
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:gap-1.5 transition-all"
          >
            Voir tout <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {!offers.length ? (
          <EmptyState
            icon="📭"
            title="Aucune offre envoyée"
            description="Consultez les demandes actives et envoyez vos premières offres pour développer votre activité"
            action={
              <Link href="/dashboard/merchant/requests">
                <Button variant="premium" size="sm">
                  <Bell className="h-4 w-4" />
                  Voir les demandes
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-border/40">
            <AnimatePresence initial={false}>
              {offers.slice(0, 6).map((offer, i) => {
                const req = (offer as any).request
                return (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                  >
                    <div className="group flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-lg shrink-0">
                        {req?.category?.icon || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{req?.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                          <span className="shrink-0">📍 {req?.city}</span>
                          <span className="text-border">·</span>
                          <span className="shrink-0">{formatTimeAgo(offer.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-sm font-bold text-primary">{formatPrice(offer.price)}</span>
                        <span className={cn(
                          'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                          getStatusColor(offer.status)
                        )}>
                          {getStatusLabel(offer.status)}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground transition-colors" />
                    </div>
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
