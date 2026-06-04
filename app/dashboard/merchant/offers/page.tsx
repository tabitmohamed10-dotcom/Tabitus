import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, Badge, EmptyState } from '@/components/ui/index'
import { formatPrice, formatTimeAgo, getStatusColor, getStatusLabel } from '@/lib/utils'
import Link from 'next/link'
import { Truck, CheckCircle2, Clock, XCircle, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5" />,
  accepted: <CheckCircle2 className="h-3.5 w-3.5" />,
  rejected: <XCircle className="h-3.5 w-3.5" />,
}

export default async function MerchantOffersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: merchant } = await supabase
    .from('merchants').select('id').eq('user_id', user.id).single()

  if (!merchant) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">Mes offres</h1>
        <div className="bg-card border border-border/60 rounded-2xl shadow-premium p-8 text-center text-muted-foreground">
          <p className="text-2xl mb-2">🏪</p>
          <p className="font-semibold">Configurez votre profil boutique d&apos;abord</p>
        </div>
      </div>
    )
  }

  const { data: offers } = await supabase
    .from('offers')
    .select(`
      *,
      request:requests(
        id, title, city, status, budget_max,
        category:categories(name, icon, color)
      )
    `)
    .eq('merchant_id', merchant.id)
    .order('created_at', { ascending: false })

  const grouped = {
    pending: offers?.filter(o => o.status === 'pending') || [],
    accepted: offers?.filter(o => o.status === 'accepted') || [],
    rejected: offers?.filter(o => ['rejected', 'expired', 'withdrawn'].includes(o.status)) || [],
  }

  const statCards = [
    { label: 'En attente', count: grouped.pending.length, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
    { label: 'Acceptées', count: grouped.accepted.length, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/40' },
    { label: 'Refusées', count: grouped.rejected.length, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Mes offres</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {offers?.length || 0} offre{(offers?.length || 0) > 1 ? 's' : ''} envoyée{(offers?.length || 0) > 1 ? 's' : ''}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {statCards.map(s => (
          <div key={s.label} className={cn('rounded-2xl p-4 text-center border border-border/40', s.bg)}>
            <p className={cn('text-2xl font-display font-bold', s.color)}>{s.count}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Offers list */}
      {!offers?.length ? (
        <div className="bg-card border border-border/60 rounded-2xl shadow-premium">
          <EmptyState
            icon="📤"
            title="Aucune offre envoyée"
            description="Consultez les demandes actives et proposez vos premières offres"
            action={
              <Link href="/dashboard/merchant/requests">
                <Button variant="premium" size="sm">
                  <Package className="h-4 w-4" />
                  Voir les demandes
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="space-y-2.5">
          {offers.map((offer, i) => {
            const req = (offer as any).request
            const statusStyle = getStatusColor(offer.status)

            return (
              <div
                key={offer.id}
                className={cn(
                  'bg-card border border-border/60 rounded-2xl p-4 sm:p-5 shadow-premium',
                  'hover:shadow-elevated transition-all duration-200',
                  'animate-fade-up'
                )}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{
                      background: (req?.category?.color || '#f97316') + '18',
                    }}
                  >
                    {req?.category?.icon || '📦'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm truncate">{req?.title}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground flex-wrap">
                          <span>{req?.category?.name}</span>
                          <span>·</span>
                          <span>📍 {req?.city}</span>
                          <span>·</span>
                          <span>{formatTimeAgo(offer.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="font-bold text-primary text-base leading-none">
                          {formatPrice(offer.price)}
                        </span>
                        <span className={cn(
                          'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full',
                          statusStyle
                        )}>
                          {STATUS_ICONS[offer.status]}
                          {getStatusLabel(offer.status)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        {offer.delivery_days} jour{offer.delivery_days > 1 ? 's' : ''}
                      </span>
                      {offer.free_delivery && (
                        <span className="text-green-600 font-semibold">Livraison gratuite</span>
                      )}
                      {req?.budget_max && (
                        <span className="text-muted-foreground/60">
                          Budget: {formatPrice(req.budget_max)}
                        </span>
                      )}
                    </div>

                    {offer.note && (
                      <p className="text-xs text-muted-foreground mt-2 italic line-clamp-1 bg-muted/30 rounded-lg px-2.5 py-1.5">
                        "{offer.note}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
