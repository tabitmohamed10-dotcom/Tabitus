import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, Badge } from '@/components/ui/index'
import { formatPrice, formatTimeAgo, getStatusColor, getStatusLabel } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function MerchantOffersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: merchant } = await supabase
    .from('merchants').select('id').eq('user_id', user.id).single()

  const { data: offers } = await supabase
    .from('offers')
    .select(`
      *,
      request:requests(
        id, title, city, status, budget_max,
        category:categories(name, icon, color)
      )
    `)
    .eq('merchant_id', merchant?.id)
    .order('created_at', { ascending: false })

  const grouped = {
    pending: offers?.filter(o => o.status === 'pending') || [],
    accepted: offers?.filter(o => o.status === 'accepted') || [],
    rejected: offers?.filter(o => o.status === 'rejected') || [],
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold">Mes offres</h1>
        <p className="text-muted-foreground mt-1">Suivez le statut de toutes vos offres</p>
      </div>

      {/* Summary tabs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'En attente', count: grouped.pending.length, color: 'text-yellow-600' },
          { label: 'Acceptées', count: grouped.accepted.length, color: 'text-green-600' },
          { label: 'Refusées', count: grouped.rejected.length, color: 'text-red-500' },
        ].map(tab => (
          <Card key={tab.label} className="p-4 text-center">
            <p className={`text-2xl font-display font-bold ${tab.color}`}>{tab.count}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{tab.label}</p>
          </Card>
        ))}
      </div>

      {!offers?.length ? (
        <Card className="p-12 text-center">
          <div className="text-5xl mb-4">📤</div>
          <h3 className="font-display font-bold text-lg mb-2">Aucune offre envoyée</h3>
          <p className="text-sm text-muted-foreground">
            Consultez les demandes actives et commencez à proposer vos offres.
          </p>
        </Card>
      ) : (
        <div className="space-y-3 stagger-children">
          {offers.map(offer => {
            const req = (offer as any).request
            return (
              <Card key={offer.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: (req?.category?.color || '#f97316') + '20' }}
                  >
                    {req?.category?.icon || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-sm">{req?.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                          <span>{req?.category?.name}</span>
                          <span>·</span>
                          <span>📍 {req?.city}</span>
                          <span>·</span>
                          <span>{formatTimeAgo(offer.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-bold text-primary text-sm">{formatPrice(offer.price)}</span>
                        <Badge className={`${getStatusColor(offer.status)} text-[10px]`}>
                          {getStatusLabel(offer.status)}
                        </Badge>
                      </div>
                    </div>
                    {offer.note && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-1 italic">
                        "{offer.note}"
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>🚚 {offer.delivery_days} jour{offer.delivery_days > 1 ? 's' : ''}</span>
                      {offer.free_delivery && <span>· Livraison gratuite</span>}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
