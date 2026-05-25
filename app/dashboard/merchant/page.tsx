import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  ArrowRight, TrendingUp, Package, CheckCircle2,
  Star, PlusCircle, Clock, Store,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, StatCard, Badge, Avatar, Skeleton } from '@/components/ui/index'
import { formatPrice, formatTimeAgo, getStatusColor, getStatusLabel } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function MerchantDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: merchant }, { data: recentOffers }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('merchants').select('*').eq('user_id', user.id).single(),
    supabase
      .from('offers')
      .select(`
        *,
        request:requests(title, budget_max, city, status, category:categories(name, icon))
      `)
      .eq('merchant_id', (await supabase.from('merchants').select('id').eq('user_id', user.id).single()).data?.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  // If no merchant profile, redirect to setup
  if (!merchant) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="text-6xl mb-6">🏪</div>
        <h1 className="font-display text-2xl font-bold mb-3">Configurez votre boutique</h1>
        <p className="text-muted-foreground mb-8">
          Avant de commencer à recevoir des demandes, complétez votre profil commerçant.
        </p>
        <Link href="/dashboard/merchant/profile">
          <Button variant="gradient" size="lg">
            Créer mon profil boutique
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  const acceptRate = merchant.total_offers > 0
    ? Math.round((merchant.accepted_offers / merchant.total_offers) * 100)
    : 0

  // Monthly earnings (mock for MVP — real data from payments table)
  const monthlyData = [
    { month: 'Jan', amount: 12400 },
    { month: 'Fév', amount: 18200 },
    { month: 'Mar', amount: 15800 },
    { month: 'Avr', amount: 22100 },
    { month: 'Mai', amount: 19600 },
    { month: 'Jun', amount: 28400 },
  ]
  const maxAmount = Math.max(...monthlyData.map(d => d.amount))

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-2xl font-bold">{merchant.business_name}</h1>
            {merchant.verified && (
              <Badge variant="info" className="text-xs">✅ Vérifié</Badge>
            )}
            <Badge variant="orange" className="text-xs capitalize">{merchant.tier}</Badge>
          </div>
          <p className="text-muted-foreground">
            📍 {merchant.city} · ⭐ {merchant.rating > 0 ? merchant.rating.toFixed(1) : 'Nouveau'}
            {merchant.total_ratings > 0 && ` (${merchant.total_ratings} avis)`}
          </p>
        </div>
        <Link href="/dashboard/merchant/requests">
          <Button variant="gradient">
            Voir les nouvelles demandes
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard
          title="Offres envoyées"
          value={merchant.total_offers}
          icon={<Package className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Offres acceptées"
          value={merchant.accepted_offers}
          subtitle={`${acceptRate}% d'acceptation`}
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
        />
        <StatCard
          title="Note moyenne"
          value={merchant.rating > 0 ? `${merchant.rating.toFixed(1)}/5` : '—'}
          icon={<Star className="h-5 w-5 fill-amber-400 text-amber-400" />}
        />
        <StatCard
          title="Taux de réponse"
          value={`${merchant.response_rate || 0}%`}
          icon={<Clock className="h-5 w-5 text-blue-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Earnings chart */}
        <Card className="p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-lg">Revenus estimés</h2>
            <Badge variant="success">+34% ce mois</Badge>
          </div>
          {/* Simple bar chart */}
          <div className="flex items-end gap-3 h-36">
            {monthlyData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">
                  {formatPrice(d.amount, 'MAD').replace(' DH', '')}
                </span>
                <div
                  className="w-full rounded-t-xl transition-all duration-500"
                  style={{
                    height: `${(d.amount / maxAmount) * 100}px`,
                    background: i === monthlyData.length - 1
                      ? 'linear-gradient(to top, #f97316, #f59e0b)'
                      : 'hsl(var(--muted))',
                  }}
                />
                <span className="text-xs text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick stats */}
        <Card className="p-6 lg:col-span-2 space-y-5">
          <h2 className="font-display font-bold text-lg">Performance</h2>
          {[
            {
              label: 'Taux d\'acceptation',
              value: `${acceptRate}%`,
              bar: acceptRate,
              color: '#22c55e',
            },
            {
              label: 'Taux de réponse',
              value: `${merchant.response_rate || 75}%`,
              bar: merchant.response_rate || 75,
              color: '#3b82f6',
            },
            {
              label: 'Satisfaction client',
              value: merchant.rating > 0 ? `${((merchant.rating / 5) * 100).toFixed(0)}%` : 'N/A',
              bar: merchant.rating > 0 ? (merchant.rating / 5) * 100 : 0,
              color: '#f59e0b',
            },
          ].map(stat => (
            <div key={stat.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">{stat.label}</span>
                <span className="font-semibold">{stat.value}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${stat.bar}%`, background: stat.color }}
                />
              </div>
            </div>
          ))}

          {merchant.tier === 'free' && (
            <div className="mt-6 p-4 rounded-xl bg-accent/60 border border-accent text-center">
              <p className="text-sm font-semibold mb-1">🚀 Passez à Pro</p>
              <p className="text-xs text-muted-foreground mb-3">
                Offres en avant, plus de visibilité, analytics avancés
              </p>
              <Button variant="gradient" size="sm" className="w-full">
                Upgrader maintenant
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Recent offers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold">Offres récentes</h2>
          <Link href="/dashboard/merchant/offers" className="text-sm text-primary hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {!recentOffers?.length ? (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-display font-bold text-lg mb-2">Aucune offre pour l'instant</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Consultez les demandes actives et répondez pour obtenir vos premiers clients.
            </p>
            <Link href="/dashboard/merchant/requests">
              <Button variant="gradient">
                <Store className="h-4 w-4" />
                Voir les demandes
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3 stagger-children">
            {recentOffers.map(offer => (
              <Card key={offer.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                    {(offer as any).request?.category?.icon || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm truncate">
                          {(offer as any).request?.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>📍 {(offer as any).request?.city}</span>
                          <span>·</span>
                          <span>{formatTimeAgo(offer.created_at)}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-primary">{formatPrice(offer.price)}</p>
                        <Badge className={`mt-1 ${getStatusColor(offer.status)} text-[10px]`}>
                          {getStatusLabel(offer.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
