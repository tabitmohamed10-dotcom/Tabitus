import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PlusCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, Badge } from '@/components/ui/index'
import { formatPrice, formatTimeAgo, getStatusColor, getStatusLabel } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function BuyerRequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: requests } = await supabase
    .from('requests')
    .select('*, category:categories(name,icon,color)')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  const stats = {
    open: requests?.filter(r => r.status === 'open').length || 0,
    accepted: requests?.filter(r => r.status === 'accepted').length || 0,
    completed: requests?.filter(r => r.status === 'completed').length || 0,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Mes demandes</h1>
          <p className="text-muted-foreground mt-1">{requests?.length || 0} demande{(requests?.length || 0) > 1 ? 's' : ''} au total</p>
        </div>
        <Link href="/dashboard/buyer/requests/new">
          <Button variant="gradient">
            <PlusCircle className="h-4 w-4" />
            Nouvelle demande
          </Button>
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Ouvertes', count: stats.open, color: 'text-green-600' },
          { label: 'Acceptées', count: stats.accepted, color: 'text-primary' },
          { label: 'Terminées', count: stats.completed, color: 'text-muted-foreground' },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <p className={`text-2xl font-display font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* List */}
      {!requests?.length ? (
        <Card className="p-12 text-center">
          <div className="text-5xl mb-4">🛍️</div>
          <h3 className="font-display font-bold text-lg mb-2">Aucune demande</h3>
          <Link href="/dashboard/buyer/requests/new">
            <Button variant="gradient">Publier ma première demande</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3 stagger-children">
          {requests.map(req => (
            <Link key={req.id} href={`/dashboard/buyer/requests/${req.id}`}>
              <Card hover className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: (req as any).category?.color + '20' }}
                  >
                    {(req as any).category?.icon || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-semibold">{req.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {(req as any).category?.name} · 📍 {req.city} · {formatTimeAgo(req.created_at)}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(req.status)} shrink-0`}>
                        {getStatusLabel(req.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      {req.budget_max && (
                        <span className="font-semibold text-primary">
                          {formatPrice(req.budget_max)}
                        </span>
                      )}
                      {req.offers_count > 0 && (
                        <span className="text-green-600 font-medium">
                          💬 {req.offers_count} offre{req.offers_count > 1 ? 's' : ''}
                        </span>
                      )}
                      {req.urgent && <Badge variant="urgent" className="text-[10px]">Urgent</Badge>}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
