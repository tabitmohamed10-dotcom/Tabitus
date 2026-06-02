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
  const [cancelling, setCancelling] = useState<string | null>(null)

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

  async function cancelRequest(id: string) {
    if (!confirm('Voulez-vous vraiment annuler cette demande ?')) return
    setCancelling(id)
    await supabase.from('requests').update({ status: 'cancelled' }).eq('id', id)
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r))
    setCancelling(null)
  }

  const statusLabel: any = { open: 'Ouverte', closed: 'Fermée', cancelled: 'Annulée' }
  const statusColor: any = { open: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-600', cancelled: 'bg-red-100 text-red-600' }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mes demandes</h1>
        <Link href="/dashboard/buyer/requests/new" className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl text-sm">+ Nouvelle</Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">🛍️</div>
          <p className="font-semibold mb-2">Aucune demande</p>
          <p className="text-gray-500 text-sm mb-6">Publiez votre première demande</p>
          <Link href="/dashboard/buyer/requests/new" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl">Publier une demande</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <Link href={`/dashboard/buyer/requests/${req.id}`} className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{req.category?.icon || '📦'}</span>
                  <div>
                    <p className="font-semibold">{req.title}</p>
                    <p className="text-sm text-gray-500">{req.category?.name} · {req.city}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(req.created_at).toLocaleDateString('fr-MA')}</p>
                  </div>
                </Link>
                <div className="text-right shrink-0 space-y-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full block ${statusColor[req.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabel[req.status] || req.status}
                  </span>
                  {req.offers_count > 0 && <p className="text-xs text-orange-500 font-semibold">{req.offers_count} offre{req.offers_count > 1 ? 's' : ''}</p>}
                  {req.status === 'open' && (
                    <button
                      onClick={() => cancelRequest(req.id)}
                      disabled={cancelling === req.id}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold block"
                    >
                      {cancelling === req.id ? 'Annulation...' : '✕ Annuler'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
