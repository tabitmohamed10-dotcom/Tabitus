'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function NewRequestPage() {
  const router = useRouter()
  const supabase = createClient()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', category_id: '',
    budget_min: '', budget_max: '', city: '',
    urgent: false, delivery_needed: true,
  })

  useEffect(() => {
    supabase.from('categories').select('id,name,icon').order('sort_order').then(({ data }) => setCategories(data || []))
  }, [])

  async function handleSubmit() {
    if (!form.title || !form.category_id || !form.city) return alert('Remplissez les champs obligatoires')
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    const { data, error } = await supabase.from('requests').insert({
      buyer_id: user.id,
      title: form.title,
      description: form.description || null,
      category_id: form.category_id,
      budget_min: form.budget_min ? Number(form.budget_min) : null,
      budget_max: form.budget_max ? Number(form.budget_max) : null,
      city: form.city,
      urgent: form.urgent,
      delivery_needed: form.delivery_needed,
    }).select().single()
    if (error) { alert('Erreur: ' + error.message); setLoading(false); return }
    router.push(`/dashboard/buyer/requests/${data.id}`)
  }

  const cities = ['Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda','Kénitra','Tétouan']

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
        <h1 className="text-2xl font-bold mb-2">Nouvelle demande</h1>
        <p className="text-gray-500 mb-8">Décrivez ce que vous cherchez et recevez des offres</p>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold mb-4">Que cherchez-vous ? *</h2>
            <input type="text" placeholder="Ex: iPhone 15 Pro, Lave-linge Samsung..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <textarea placeholder="Description (optionnel)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-xl p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold mb-4">Catégorie *</h2>
            <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Choisir une catégorie</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold mb-4">Budget (MAD)</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Minimum" value={form.budget_min} onChange={e => setForm({...form, budget_min: e.target.value})} className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <input type="number" placeholder="Maximum" value={form.budget_max} onChange={e => setForm({...form, budget_max: e.target.value})} className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold mb-4">Ville *</h2>
            <select value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Choisir votre ville</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-6 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.urgent} onChange={e => setForm({...form, urgent: e.target.checked})} className="h-4 w-4" />
                <span className="text-sm font-medium">⚡ Urgent</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.delivery_needed} onChange={e => setForm({...form, delivery_needed: e.target.checked})} className="h-4 w-4" />
                <span className="text-sm font-medium">🚚 Livraison souhaitée</span>
              </label>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading} className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 disabled:opacity-50 text-lg">
            {loading ? 'Publication...' : 'Publier ma demande →'}
          </button>
        </div>
      </main>
    </div>
  )
}
