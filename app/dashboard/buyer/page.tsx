'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, TrendingUp, MessageSquare, PlusCircle, ArrowRight, Clock, ChevronRight } from 'lucide-react'
import { useBuyerStats, useMyRequests } from '@/lib/hooks'
import { formatTimeAgo, getStatusColor, getStatusLabel } from '@/lib/utils'
import { Skeleton } from '@/components/ui/index'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } },
}

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = nodeRef.current
    if (!node) return
    let frame = 0
    const total = 45
    const update = () => {
      frame++
      const progress = frame / total
      const eased = 1 - Math.pow(1 - progress, 3)
      node.textContent = Math.round(to * eased) + suffix
      if (frame < total) requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  }, [to, suffix])
  return <span ref={nodeRef}>0{suffix}</span>
}

export default function BuyerDashboard() {
  const { stats, loading: statsLoading } = useBuyerStats()
  const { requests, loading: reqLoading } = useMyRequests()
  const loading = statsLoading || reqLoading

  const statCards = [
    {
      label: 'Demandes totales',
      value: stats.total_requests,
      icon: <ShoppingBag className="h-5 w-5" />,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      label: 'Demandes ouvertes',
      value: stats.open_requests,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Offres reçues',
      value: stats.total_offers_received,
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
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
        <Skeleton className="h-16 rounded-2xl" />
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
      {/* Greeting */}
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">
          Tableau de bord 👋
        </h1>
        <p className="text-muted-foreground mt-1">Voici un résumé de votre activité</p>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        {statCards.map((s) => (
          <motion.div
            key={s.label}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="bg-card rounded-2xl p-4 sm:p-5 border border-border/60 shadow-premium cursor-default"
          >
            <div className={`h-9 w-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <p className={`text-2xl sm:text-3xl font-display font-bold ${s.color}`}>
              <CountUp to={s.value} />
            </p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-tight">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Banner */}
      <motion.div variants={fadeUp} className="mb-6">
        <Link href="/dashboard/buyer/requests/new">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="bg-brand-gradient rounded-2xl p-5 sm:p-6 flex items-center justify-between text-white shadow-lg shadow-orange-500/25 cursor-pointer overflow-hidden relative"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -right-2 bottom-0 h-20 w-20 rounded-full bg-white/5" />
            <div className="relative">
              <p className="font-display font-bold text-lg sm:text-xl">Nouvelle demande</p>
              <p className="text-white/80 text-sm mt-0.5">Recevez des offres en quelques minutes</p>
            </div>
            <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 relative">
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Recent requests */}
      <motion.div
        variants={fadeUp}
        className="bg-card rounded-2xl border border-border/60 shadow-premium overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <h2 className="font-display font-bold text-base">Demandes récentes</h2>
          <Link
            href="/dashboard/buyer/requests"
            className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            Voir tout <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {!requests.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-14 px-6"
          >
            <div className="text-5xl mb-4">🛍️</div>
            <p className="font-semibold mb-1">Aucune demande pour l'instant</p>
            <p className="text-muted-foreground text-sm mb-5">Publiez votre première demande et recevez des offres</p>
            <Link
              href="/dashboard/buyer/requests/new"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-xl text-sm"
            >
              <PlusCircle className="h-4 w-4" />
              Publier une demande
            </Link>
          </motion.div>
        ) : (
          <div className="divide-y divide-border/40">
            <AnimatePresence>
              {requests.slice(0, 5).map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link href={`/dashboard/buyer/requests/${req.id}`}>
                    <motion.div
                      whileHover={{ backgroundColor: 'hsl(var(--muted)/0.5)' }}
                      className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                        {(req as any).category?.icon || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{req.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                          <span className="truncate">{(req as any).category?.name}</span>
                          <span>·</span>
                          <span>📍 {req.city}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 shrink-0">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(req.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusColor(req.status)}`}>
                          {getStatusLabel(req.status)}
                        </span>
                        {req.offers_count > 0 && (
                          <span className="text-xs text-primary font-semibold">
                            {req.offers_count} offre{req.offers_count > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                    </motion.div>
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
