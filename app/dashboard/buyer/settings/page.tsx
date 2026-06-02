'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function BuyerSettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const cities = ['Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda','Kénitra','Tétouan']

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setFullName(data?.full_name || '')
      setPhone(data?.phone || '')
      setCity(data?.city || '')
    }
    load()
  }, [])

  async function save() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').update({ full_name: fullName, phone, city }).eq('id', user!.id)
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm">T</div>
          <span className="font-bold text-xl">tabitus</span>
        </div>
        <Link href="/dashboard/buyer" className="text-sm text-gray-500">← Retour</Link>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Paramètres</h1>
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          {saved && <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm text-center">✅ Profil mis à jour !</div>}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Nom complet</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Téléphone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+212 6XX XXX XXX" className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Ville</label>
            <select value={city} onChange={e => setCity(e.target.value)} className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Choisir votre ville</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={save} disabled={loading} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 disabled:opacity-50">
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
          <hr />
          <Link href="/auth/logout" className="block w-full text-center bg-red-50 text-red-500 font-semibold py-3 rounded-xl">
            Se déconnecter
          </Link>
        </div>
      </main>
    </div>
  )
}
