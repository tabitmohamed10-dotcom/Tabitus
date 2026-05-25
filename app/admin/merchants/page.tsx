import { createAdminClient } from '@/lib/supabase/server'
import { Card, Badge } from '@/components/ui/index'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminMerchantsPage() {
  const supabase = await createAdminClient()

  const { data: merchants } = await supabase
    .from('merchants')
    .select('*, user:profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Commerçants ({merchants?.length || 0})</h1>
        <div className="flex gap-2">
          <Badge variant="warning">{merchants?.filter(m => !m.verified).length} à vérifier</Badge>
          <Badge variant="success">{merchants?.filter(m => m.verified).length} vérifiés</Badge>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                {['Boutique', 'Propriétaire', 'Ville', 'Catégories', 'Note', 'Plan', 'Vérifié', 'Inscrit'].map(h => (
                  <th key={h} className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {merchants?.map(m => (
                <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      {m.logo_url ? (
                        <img src={m.logo_url} alt="" className="h-8 w-8 rounded-lg object-cover" />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-brand-gradient flex items-center justify-center text-white font-bold text-xs">
                          {m.business_name?.[0]}
                        </div>
                      )}
                      <span className="font-medium">{m.business_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">{(m as any).user?.full_name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{m.city}</td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">{m.categories?.length || 0} cat.</td>
                  <td className="py-3 px-4">
                    {m.rating > 0 ? (
                      <span className="font-medium">⭐ {m.rating.toFixed(1)}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="orange" className="text-[10px] capitalize">{m.tier}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={m.verified ? 'success' : 'warning'} className="text-[10px]">
                      {m.verified ? '✅ Vérifié' : '⏳ En attente'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">{formatDate(m.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
