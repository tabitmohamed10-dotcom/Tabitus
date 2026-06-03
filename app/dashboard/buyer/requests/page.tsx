'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, Clock, ChevronRight, X, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input, Skeleton, EmptyState, Badge } from '@/components/ui/index'
import { cn } from '@/lib/utils'

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  open:      { label: 'Ouverte',    class: 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400 border border-green-200/60 dark:border-green-800/40' },
  in_review: { label: 'En examen', class: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40' },
  accepted:  { label: 'Acceptée',   class: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40' },
  completed: { label: 'Terminée',   class: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40' },
  cancelled: { label: 'Annulée',    class: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-200/60 dark:border-red-800/40' },
}

export default function BuyerRequestsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'open' | 'completed' | 'cancelled'>('all')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase
        .from('requests')
        .select('*, category:categories(name,icon)')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })
      setRequests(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function cancelRequest(id: string) {
    if (!confirm('Voulez-vous vraiment annuler cette demande ?')) return
    setCancelling(id)
    await supabase.from('requests').update({ status: 'cancelled' }).eq('id', id)
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r))
    setCancelling(null)
  }

  const filtered = requests.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Mes demandes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? '...' : `${requests.length} demande${requests.length > 1 ? 's' : ''} au total`}
          </p>
        </div>
        <Link href="/dashboard/buyer/requests/new">
          <Button variant="gradient" size="sm">
            <Plus className="h-4 w-4" />
            Nouvelle
          </Button>
        </Link>
      </div>

      {/* Filters */}
      {!loading && requests.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <Input
            placeholder="Rechercher une demande..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="flex-1"
          />
          <div className="flex gap-1 bg-muted/40 p-1 rounded-xl shrink-0">
            {[
              { key: 'all', label: 'Toutes' },
              { key: 'open', label: 'Ouvertes' },
              { key: 'completed', label: 'Terminées' },
              { key: 'cancelled', label: 'Annulées' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as any)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  filter === f.key
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-[88px] rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        search || filter !== 'all' ? (
          <div className="bg-card border border-border/60 rounded-2xl shadow-premium">
            <EmptyState
              icon={<Search className="h-6 w-6" />}
              title="Aucun résultat"
              description="Essayez d'autres mots clés ou changez le filtre"
              action={
                <Button variant="outline" size="sm" onClick={() => { setSearch(''); setFilter('all') }}>
                  Réinitialiser
                </Button>
              }
            />
          </div>
        ) : (
          <div className="bg-card border border-border/60 rounded-2xl shadow-premium">
            <EmptyState
              icon="🛍️"
              title="Aucune demande"
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
          </div>
        )
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {filtered.map((req, i) => {
              const status = STATUS_MAP[req.status] || { label: req.status, class: 'bg-muted text-muted-foreground' }
              const daysLeft = req.expires_at
                ? Math.max(0, Math.ceil((new Date(req.expires_at).getTime() - Date.now()) / 86400000))
                : null

              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  className="bg-card border border-border/60 rounded-2xl shadow-premium hover:shadow-elevated transition-all duration-200 overflow-hidden group"
                >
                  <div className="flex items-center gap-3 p-4 sm:p-5">
                    <Link href={`/dashboard/buyer/requests/${req.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                        {req.category?.icon || '📦'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-semibold text-sm truncate">{req.title}</p>
                          {req.urgent && <Badge variant="urgent" size="sm">Urgent</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          <span>{req.category?.name || 'Général'}</span>
                          <span>·</span>
                          <span>📍 {req.city}</span>
                          {req.budget_max && (
                            <>
                              <span>·</span>
                              <span>≤ {req.budget_max.toLocaleString('fr-MA')} DH</span>
                            </>
                          )}
                          {daysLeft !== null && req.status === 'open' && (
                            <>
                              <span>·</span>
                              <span className={cn('flex items-center gap-0.5', daysLeft <= 1 && 'text-destructive font-semibold')}>
                                <Clock className="h-3 w-3" />
                                {daysLeft}j restants
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap', status.class)}>
                        {status.label}
                      </span>
                      {req.offers_count > 0 && (
                        <span className="text-xs font-bold text-primary">
                          {req.offers_count} offre{req.offers_count > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground transition-colors" />
                  </div>

                  {req.status === 'open' && (
                    <div className="border-t border-border/40 px-5 py-2.5 flex items-center justify-between bg-muted/20">
                      <span className="text-xs text-muted-foreground">
                        {new Date(req.created_at).toLocaleDateString('fr-MA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <button
                        onClick={() => cancelRequest(req.id)}
                        disabled={cancelling === req.id}
                        className="flex items-center gap-1 text-xs text-destructive/80 hover:text-destructive font-semibold transition-colors disabled:opacity-50"
                      >
                        <X className="h-3 w-3" />
                        {cancelling === req.id ? 'Annulation...' : 'Annuler'}
                      </button>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
