import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminRequestsPage() {
  const supabase = await createAdminClient()

  const { data: requests } = await supabase
    .from('requests')
    .select('*, category:categories(name,icon), buyer:profiles(full_name,email)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Demandes</h1>
        <p className="text-gray-500 mt-1">Liste de toutes les demandes des acheteurs</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Titre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Acheteur</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Catégorie</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ville</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Budget</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests?.map(req => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium">{req.title}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{(req as any).buyer?.full_name || '—'}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className="flex items-center gap-1">
                      {(req as any).category?.icon} {(req as any).category?.name}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{req.city}</td>
                  <td className="px-6 py-3 text-sm">
                    {req.budget_max ? `${req.budget_min || 0} - ${req.budget_max} MAD` : '—'}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      req.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {req.status === 'open' ? 'Ouverte' : 'Fermée'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
