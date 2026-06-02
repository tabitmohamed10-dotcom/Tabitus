import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function MerchantDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: merchant } = await supabase.from('merchants').select('*').eq('user_id', user.id).single()
  const { data: offers } = await supabase.from('offers').select('*, request:requests(title,city,category:categories(name,icon))').eq('merchant_id', merchant?.id).order('created_at', { ascending: false }).limit(5)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Bonjour, {profile?.full_name?.split(' ')[0]} 👋</h1>
      <p className="text-gray-500 mb-8">{merchant?.business_name || 'Complétez votre profil boutique'}</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Offres envoyées', value: merchant?.total_offers || 0 },
          { label: 'Offres acceptées', value: merchant?.accepted_offers || 0 },
          { label: 'Note moyenne', value: merchant?.rating > 0 ? `${merchant.rating}/5` : '—' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-3xl font-bold text-orange-500">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {!merchant && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-6">
          <h3 className="font-bold mb-2">Complétez votre profil boutique</h3>
          <p className="text-sm text-gray-600 mb-4">Pour recevoir des demandes, configurez votre profil commerçant.</p>
          <Link href="/dashboard/merchant/profile" className="bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-sm">Configurer mon profil</Link>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Mes offres récentes</h2>
          <Link href="/dashboard/merchant/offers" className="text-orange-500 text-sm">Voir tout</Link>
        </div>
        {!offers?.length ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📭</div>
            <p className="font-semibold mb-2">Aucune offre envoyée</p>
            <p className="text-gray-500 text-sm mb-6">Consultez les demandes et commencez à proposer vos offres</p>
            <Link href="/dashboard/merchant/requests" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl">Voir les demandes</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map(offer => (
              <div key={offer.id} className="flex items-center justify-between p-4 border rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{(offer as any).request?.category?.icon || '📦'}</span>
                  <div>
                    <p className="font-semibold">{(offer as any).request?.title}</p>
                    <p className="text-sm text-gray-500">{(offer as any).request?.city}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-500">{offer.price} MAD</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${offer.status === 'accepted' ? 'bg-green-100 text-green-700' : offer.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                    {offer.status === 'accepted' ? 'Acceptée' : offer.status === 'rejected' ? 'Refusée' : 'En attente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
