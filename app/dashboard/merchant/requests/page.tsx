'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function MerchantRequestsPage() {
  const supabase = createClient()
  const [requests, setRequests] = useState<any[]>([])
  const [merchant, setMerchant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [price, setPrice] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: m } = await supabase.from('merchants').select('*').eq('user_id', user.id).single()
      setMerchant(m)
      const { data } = await supabase.from('v_request_feed').select('*').order('created_at', { ascending: false }).limit(30)
      setRequests(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function submitOffer() {
    if (!price || !merchant) return
    setSubmitting(true)
    await supabase.from('offers').insert({
      request_id: selectedRequest.id,
      merchant_id: merchant.id,
      price: Number(price),
      note: note || null,
      delivery_days: 3,
    })
    setSelectedRequest(null)
    setPrice('')
    setNote('')
    setSubmitting(false)
    alert('Offre envoyée !')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm">T</div>
          <span className="font-bold text-xl">tabitus</span>
        </div>
        <Link href="/dashboard/merchant" className="text-sm text-gray-500">← Retour</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Demandes disponibles</h1>
        <p className="text-gray-500 mb-8">Répondez aux demandes qui correspondent à votre activité</p>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Chargement...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold">Aucune demande disponible</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{req.category_icon || '📦'}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{req.title}</h3>
                        {req.urgent && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">⚡ Urgent</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{req.category_name} · 📍 {req.city}</p>
                      {req.description && <p className="text-sm text-gray-600 mt-2">{req.description}</p>}
                      <div className="flex gap-4 mt-3 text-sm">
                        {req.budget_max && <span className="font-semibold text-orange-500">Budget max: {req.budget_max} MAD</span>}
                        <span className="text-gray-400">{req.offers_count || 0} offre(s)</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedRequest(req)} className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl text-sm whitespace-nowrap">
                    Faire une offre
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md p-6">
            <h2 className="font-bold text-lg mb-1">Envoyer une offre</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedRequest.title}</p>
            <input type="number" placeholder="Votre prix (MAD)" value={price} onChange={e => setPrice(e.target.value)} className="w-full border rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <textarea placeholder="Message (optionnel)" value={note} onChange={e => setNote(e.target.value)} className="w-full border rounded-xl p-3 mb-4 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <div className="flex gap-3">
              <button onClick={() => setSelectedRequest(null)} className="flex-1 border border-gray-300 font-semibold py-3 rounded-xl">Annuler</button>
              <button onClick={submitOffer} disabled={submitting || !price} className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-xl disabled:opacity-50">
                {submitting ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
