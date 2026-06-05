'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ShoppingBag, TrendingUp, MessageSquare, Plus,
  ArrowRight, Clock, ChevronRight,
} from 'lucide-react'
import { useBuyerStats, useMyRequests } from '@/lib/hooks'
import { formatTimeAgo, getStatusColor, getStatusLabel } from '@/lib/utils'
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
      node.textContent = Math.round(to * (1 - Math.pow(1 - frame / total, 3))) + suffix
      if (frame < total) requestAnimationFrame(update)
      else node.textContent = to + suffix
    }
    requestAnimationFrame(update)
  }, [to, suffix])
  return <span ref={nodeRef}>0{suffix}</span>
}

export default function BuyerDashboard() {
  const router = useRouter()
  const { stats, loading: statsLoading } = useBuyerStats()
  const { requests, loading: reqLoading } = useMyRequests()
  const loading = statsLoading || reqLoading

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/auth/login')
    }).catch(() => router.push('/auth/login'))
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-[110px] rounded-2xl" />)}
        </div>
        <Skeleton className="h-[88px] rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    )
  }

  const statCards = [
    {
      label: 'Demandes',
      value: stats.total_requests,
      icon: <ShoppingBag className="h-4 w-4" />,
      iconBg: 'bg-gold-100 text-gold-700',
      valueColor: 'text-gold-700',
    },
    {
      label: 'En cours',
      value: stats.open_requests,
      icon: <TrendingUp className="h-4 w-4" />,
      iconBg: 'bg-green-100 text-green-700',
      valueColor: 'text-green-700',
    },
    {
      label: 'Offres reçues',
      value: stats.total_offers_received,
      icon: <MessageSquare className="h-4 w-4" />,
      iconBg: 'bg-gold-50 text-gold-600',
      valueColor: 'text-gold-600',
    },
  ]

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-7">
        <h1 className="font-display text-2xl sm:text-[1.75rem] font-bold tracking-tight" style={{fontFamily:'var(--font-playfair)'}}>
          Tableau de bord
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Bienvenue, voici un résumé de votre activité</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
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
              <CountUp to={s.value} />
            </p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 leading-tight font-medium">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Banner */}
      <motion.div variants={fadeUp} className="mb-5">
        <Link href="/dashboard/buyer/requests/new">
          <motion.div
            whileHover={{ scale: 1.008 }}
            whileTap={{ scale: 0.995 }}
            className="group relative bg-brand-gradient rounded-2xl p-5 sm:p-6 flex items-center justify-between text-white shadow-brand cursor-pointer overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -right-2 bottom-0 h-16 w-16 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10">
              <p className="font-display font-bold text-base sm:text-lg leading-tight" style={{fontFamily:'var(--font-playfair)'}}>Nouvelle demande</p>
              <p className="text-white/75 text-sm mt-0.5">Recevez des offres en quelques minutes</p>
            </div>
            <div className="h-11 w-11 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 relative z-10 transition-transform group-hover:scale-105">
              <Plus className="h-5 w-5 text-white" />
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Recent requests */}
      <motion.div variants={fadeUp} className="bg-card rounded-2xl border border-border shadow-premium overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display font-bold text-[15px]" style={{fontFamily:'var(--font-playfair)'}}>Demandes récentes</h2>
          <Link href="/dashboard/buyer/requests" className="flex items-center gap-1 text-sm text-primary font-semibold hover:gap-1.5 transition-all">
            Voir tout <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {!requests.length ? (
          <EmptyState
            icon="🛍️"
            title="Aucune demande pour l'instant"
            description="Publiez votre première demande et recevez des offres de commerçants vérifiés"
            action={
              <Link href="/dashboard/buyer/requests/new">
                <Button variant="gradient" size="sm">
                  <Plus className="h-4 w-4" />
                  Publier une demande
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-border/40">
            <AnimatePresence initial={false}>
              {requests.slice(0, 6).map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <Link href={`/dashboard/buyer/requests/${req.id}`}>
                    <div className="group flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors cursor-pointer">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-lg shrink-0">
                        {(req as any).category?.icon || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{req.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                          <span className="truncate max-w-[80px]">{(req as any).category?.name || 'Général'}</span>
                          <span>·</span>
                          <span className="shrink-0">📍 {req.city}</span>
                          <span>·</span>
                          <Clock className="h-3 w-3 shrink-0" />
                          <span className="shrink-0">{formatTimeAgo(req.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', getStatusColor(req.status))}>
                          {getStatusLabel(req.status)}
                        </span>
                        {req.offers_count > 0 && (
                          <span className="text-xs text-primary font-bold">
                            {req.offers_count} offre{req.offers_count > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground transition-colors" />
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
