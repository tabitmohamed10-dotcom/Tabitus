import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PlusCircle, ArrowRight, Clock, CheckCircle2, Package, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, StatCard, Badge, Skeleton, Avatar } from '@/components/ui/index'
import { formatPrice, formatTimeAgo, getStatusColor, getStatusLabel } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function BuyerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch stats + recent requests in parallel
  const [{ data: profile }, { data: requests }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('requests')
      .select('*, category:categories(name,icon,color)')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = {
    total: requests?.length || 0,
    open: requests?.filter(r => r.status === 'open').length || 0,
    offers: requests?.reduce((s, r) => s + (r.offers_count || 0), 0) || 0,
    completed: requests?.filter(r => r.status === 'completed').length || 0,
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">
            Bonjour, {profile?.full_name?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {stats.open > 0
              ? `Vous avez ${stats.open} demande${stats.open > 1 ? 's' : ''} active${stats.open > 1 ? 's' : ''}`
              : 'Publiez votre première demande'
            }
          </p>
        </div>
        <Link href="/dashboard/buyer/requests/new">
          <Button variant="gradient">
            <PlusCircle className="h-4 w-4" />
            Nouvelle demande
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard
          title="Demandes totales"
          value={stats.total}
          icon={<Package className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Demandes ouvertes"
          value={stats.open}
          icon={<Clock className="h-5 w-5 text-blue-500" />}
        />
        <StatCard
          title="Offres reçues"
          value={stats.offers}
          subtitle="Sur toutes vos demandes"
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
        />
        <StatCard
          title="Deals conclus"
          value={stats.completed}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
      </div>

      {/* Recent requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold">Demandes récentes</h2>
          <Link href="/dashboard/buyer/requests" className="text-sm text-primary hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {!requests?.length ? (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">🛍️</div>
            <h3 className="font-display font-bold text-lg mb-2">Aucune demande pour l'instant</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Publiez votre première demande et recevez des offres de commerçants en quelques minutes.
            </p>
            <Link href="/dashboard/buyer/requests/new">
              <Button variant="gradient">
                <PlusCircle className="h-4 w-4" />
                Publier ma première demande
              </Button>
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
                      style={{ background: req.category?.color + '20' }}
                    >
                      {req.category?.icon || '📦'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold truncate">{req.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span>{req.category?.name}</span>
                            <span>·</span>
                            <span>📍 {req.city}</span>
                            <span>·</span>
                            <span>{formatTimeAgo(req.created_at)}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(req.status)}>
                          {getStatusLabel(req.status)}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        {req.budget_max && (
                          <span className="text-sm font-semibold text-primary">
                            Budget: {formatPrice(req.budget_max)}
                          </span>
                        )}
                        {req.offers_count > 0 && (
                          <span className="text-sm font-medium text-green-600">
                            💬 {req.offers_count} offre{req.offers_count > 1 ? 's' : ''}
                          </span>
                        )}
                        {req.best_offer_price && (
                          <span className="text-sm text-muted-foreground">
                            Meilleure: {formatPrice(req.best_offer_price)}
                          </span>
                        )}
                        {req.urgent && <Badge variant="urgent">Urgent</Badge>}
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

      {/* Tips */}
      {stats.total === 0 && (
        <Card className="p-6 bg-accent/50 border-accent">
          <h3 className="font-display font-bold mb-3">💡 Conseils pour recevoir plus d'offres</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              'Ajoutez une photo du produit pour plus de précision',
              'Indiquez votre budget pour des offres adaptées',
              'Précisez votre délai pour des propositions rapides',
              'Soyez précis dans votre description',
            ].map(tip => (
              <li key={tip} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
