import { createAdminClient } from '@/lib/supabase/server'
import { Card, Badge, Avatar } from '@/components/ui/index'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const supabase = await createAdminClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Utilisateurs ({users?.length || 0})</h1>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                {['Utilisateur', 'Email', 'Rôle', 'Ville', 'Inscrit le', 'Statut'].map(h => (
                  <th key={h} className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users?.map(user => (
                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={user.full_name} size="sm" />
                      <span className="font-medium">{user.full_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={user.role === 'admin' ? 'destructive' : user.role === 'merchant' ? 'orange' : 'secondary'}
                      className="text-[10px] capitalize"
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{user.city || '—'}</td>
                  <td className="py-3 px-4 text-muted-foreground">{formatDate(user.created_at)}</td>
                  <td className="py-3 px-4">
                    <Badge variant={user.active ? 'success' : 'destructive'} className="text-[10px]">
                      {user.active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
