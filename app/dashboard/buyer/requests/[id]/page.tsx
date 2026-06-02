'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function RequestDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [request, setRequest] = useState<any>(null)
  const [offers, setOffers] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      const { data: req } = await supabase.from('requests').select('*, category:categories(name,icon)').eq('id', id).single()
      setRequest(req)
      const { data: offs } = await supabase.from('v_offer_detail').select('*').eq('request_id', id).order('price', { ascending: true })
      setOffers(offs || [])
      setLoading(false)
    }
    load()
  }, [id])

  async function acceptOffer(offerId: string, price: number) {
    setAccepting(offerId)
    const { error } = await supabase.rpc('accept_offer', { p_offer_id: offerId })
    if (error) { alert('Erreur: ' + error.message); setAccepting(null); return }
    router.push(`/chat/${offerId}`)
  }

  if (loading) return <div className="flex items-center justify-center py-20"><p className="text-gray-400">Chargement...</p></div>

  const commission = (price: number) => Math.round(price * 0.05)
  const isClosed = request?.status === 'closed'

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{request?.category?.icon || '📦'}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-xl">{request?.title}</h1>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isClosed ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                {isClosed ? 'Fermée' : 'Ouverte'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{request?.category?.name} · 📍 {request?.city}</p>
            {request?.description && <p className="text-sm text-gray-600 mt-3">{request?.description}</p>}
            {request?.budget_max && <p className="text-orange-500 font-semibold mt-3">Budget max : {request?.budget_max} MAD</p>}
          </div>
        </div>
      </div>

      <h2 className="font-bold text-lg mb-4">{offers.length} offre{offers.length > 1 ? 's' : ''} reçue{offers.length > 1 ? 's' : ''}</h2>

      {offers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">⏳</div>
          <p className="font-semibold">En attente d'offres</p>
          <p className="text-gray-500 text-sm mt-2">Les commerçants vont répondre bientôt</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer, index) => (
            <div key={offer.id} className={`bg-white rounded-2xl p-6 shadow-sm ${index === 0 && !isClosed ? 'ring-2 ring-orange-400' : ''} ${offer.status === 'accepted' ? 'ring-2 ring-green-400' : ''}`}>
              {index === 0 && !isClosed && <div className="text-xs font-bold text-orange-500 mb-3">⭐ MEILLEURE OFFRE</div>}
              {offer.status === 'accepted' && <div className="text-xs font-bold text-green-500 mb-3">✅ OFFRE ACCEPTÉE</div>}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                    {offer.business_name?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="font-semibold">{offer.business_name || 'Commerçant'}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <span>⭐</span>
                      <span>{offer.merchant_rating > 0 ? offer.merchant_rating : 'Nouveau'}</span>
                      {offer.merchant_verified && <span className="text-blue-500 text-xs ml-1">✓ Vérifié</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-500">{offer.price} MAD</p>
                  <p className="text-xs text-gray-400">Commission Tabitus : {commission(offer.price)} MAD</p>
                  <p className="text-xs text-gray-400">Vous payez : {offer.price} MAD</p>
                </div>
              </div>
              {offer.note && <div className="mt-4 bg-gray-50 rounded-xl p-3 text-sm text-gray-600">"{offer.note}"</div>}
              {offer.status === 'accepted' ? (
                <Link href={`/chat/${offer.id}`} className="mt-4 w-full bg-green-500 text-white font-bold py-3 rounded-xl text-center block">
                  💬 Ouvrir le chat
                </Link>
              ) : !isClosed && (
                <button
                  onClick={() => acceptOffer(offer.id, offer.price)}
                  disabled={!!accepting}
                  className="mt-4 w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 disabled:opacity-50"
                >
                  {accepting === offer.id ? 'Acceptation...' : `Accepter cette offre — ${offer.price} MAD`}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
