'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BuyerRequestsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase
        .from('requests')
        .select('*, category:categories(name,icon)')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })
      setRequests(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm">T</div>
          <span className="font-bold text-xl">tabitus</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/buyer/requests/new" className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl text-sm">+ Nouvelle</Link>
          <Link href="/dashboard/buyer" className="text-sm text-gray-500">← Retour</Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mes demandes</h1>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Chargement...</div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">��️</div>
            <p className="font-semibold mb-2">Aucune demande</p>
            <p className="text-gray-500 text-sm mb-6">Publiez votre première demande</p>
            <Link href="/dashboard/buyer/requests/new" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl">Publier une demande</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map(req => (
              <Link key={req.id} href={`/dashboard/buyer/requests/${req.id}`}>
                <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{req.category?.icon || '📦'}</span>
                    <div>
                      <p className="font-semibold">{req.title}</p>
                      <p className="text-sm text-gray-500">{req.category?.name} · {req.city}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(req.created_at).toLocaleDateString('fr-MA')}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${req.status === 'open' ? 'bg-green-100 text-green-700' : req.status === 'closed' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'}`}>
                      {req.status === 'open' ? 'Ouverte' : req.status === 'closed' ? 'Fermée' : req.status}
                    </span>
                    {req.offers_count > 0 && <p className="text-xs text-orange-500 mt-1 font-semibold">{req.offers_count} offre{req.offers_count > 1 ? 's' : ''}</p>}
                    {req.budget_max && <p className="text-xs text-gray-400 mt-1">Budget: {req.budget_max} MAD</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
