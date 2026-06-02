'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function BuyerProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setFormData(data || {})
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    setMessage('')
    const { error } = await supabase.from('profiles').update(formData).eq('id', profile.id)
    if (error) {
      setMessage('Erreur: ' + error.message)
    } else {
      setMessage('Profil sauvegardé !')
      setProfile(formData)
    }
    setSaving(false)
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Chargement...</div>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Mon profil</h1>
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Nom complet</label>
          <input
            type="text"
            value={formData.full_name || ''}
            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input type="email" value={profile?.email || ''} disabled className="w-full border rounded-xl p-3 bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Téléphone</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Ville</label>
          <input
            type="text"
            value={formData.city || ''}
            onChange={e => setFormData({ ...formData, city: e.target.value })}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        {message && <div className={`p-3 rounded-xl text-sm ${message.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message}</div>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  )
}
