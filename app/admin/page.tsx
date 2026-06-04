import { createAdminClient } from '@/lib/supabase/server'
import { Card, StatCard, Badge } from '@/components/ui/index'
import { formatPrice, formatTimeAgo } from '@/lib/utils'
import { Users, ShoppingBag, Store, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createAdminClient()

  // Fetch aggregate stats
  const [
    { count: totalUsers },
    { count: totalRequests },
    { count: totalMerchants },
    { count: openRequests },
    { data: recentRequests },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('requests').select('*', { count: 'exact', head: true }),
    supabase.from('merchants').select('*', { count: 'exact', head: true }),
    supabase.from('requests').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase
      .from('requests')
      .select('*, category:categories(name,icon), buyer:profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Vue d'ensemble</h1>
        <p className="text-muted-foreground mt-1">Données en temps réel — Tabit</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Utilisateurs totaux"
          value={totalUsers?.toLocaleString() || 0}
          icon={<Users className="h-5 w-5 text-primary" />}
          trend={{ value: 12, label: 'ce mois' }}
        />
        <StatCard
          title="Commerçants"
          value={totalMerchants?.toLocaleString() || 0}
          icon={<Store className="h-5 w-5 text-primary" />}
          trend={{ value: 8, label: 'ce mois' }}
        />
        <StatCard
          title="Demandes totales"
          value={totalRequests?.toLocaleString() || 0}
          icon={<ShoppingBag className="h-5 w-5 text-green-500" />}
          trend={{ value: 23, label: 'ce mois' }}
        />
        <StatCard
          title="Demandes ouvertes"
          value={openRequests?.toLocaleString() || 0}
          icon={<TrendingUp className="h-5 w-5 text-amber-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent requests */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="font-display font-bold mb-4">Demandes récentes</h2>
          <div className="space-y-3">
            {recentRequests?.map(req => (
              <div key={req.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <span className="text-xl">{(req as any).category?.icon || '📦'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{req.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {(req as any).buyer?.full_name} · {req.city} · {formatTimeAgo(req.created_at)}
                  </p>
                </div>
                <Badge className={`text-[10px] shrink-0 ${req.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {req.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent users */}
        <Card className="p-6">
          <h2 className="font-display font-bold mb-4">Nouveaux utilisateurs</h2>
          <div className="space-y-3">
            {recentUsers?.map(user => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.full_name?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <span className="text-xs text-muted-foreground">{formatTimeAgo(user.created_at)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
