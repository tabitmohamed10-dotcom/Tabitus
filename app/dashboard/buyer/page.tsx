import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BuyerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: requests } = await supabase.from('requests').select('*, category:categories(name,icon)').eq('buyer_id', user.id).order('created_at', { ascending: false }).limit(5)

  const stats = {
    total: requests?.length || 0,
    open: requests?.filter(r => r.status === 'open').length || 0,
    offers: requests?.reduce((s, r) => s + (r.offers_count || 0), 0) || 0,
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Bonjour, {profile?.full_name?.split(' ')[0]} 👋</h1>
      <p className="text-gray-500 mb-8">Bienvenue sur votre tableau de bord</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Demandes totales', value: stats.total },
          { label: 'Demandes ouvertes', value: stats.open },
          { label: 'Offres reçues', value: stats.offers },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-3xl font-bold text-orange-500">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Mes demandes récentes</h2>
          <Link href="/dashboard/buyer/requests" className="text-orange-500 text-sm">Voir tout</Link>
        </div>
        {!requests?.length ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🛍️</div>
            <p className="font-semibold mb-2">Aucune demande pour l'instant</p>
            <p className="text-gray-500 text-sm mb-6">Publiez votre première demande et recevez des offres</p>
            <Link href="/dashboard/buyer/requests/new" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl">Publier ma première demande</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map(req => (
              <Link key={req.id} href={`/dashboard/buyer/requests/${req.id}`}>
                <div className="flex items-center justify-between p-4 border rounded-xl hover:border-orange-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{(req as any).category?.icon || '📦'}</span>
                    <div>
                      <p className="font-semibold">{req.title}</p>
                      <p className="text-sm text-gray-500">{(req as any).category?.name} · {req.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${req.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {req.status === 'open' ? 'Ouverte' : req.status}
                    </span>
                    {req.offers_count > 0 && <p className="text-xs text-orange-500 mt-1">{req.offers_count} offre{req.offers_count > 1 ? 's' : ''}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
