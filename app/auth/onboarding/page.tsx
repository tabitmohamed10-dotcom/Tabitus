'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OnboardingPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    const supabase = createClient()
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

  async function handleNext() {
    const supabase = createClient()
    if (step === 1) {
      await supabase.from('profiles').update(formData).eq('id', profile.id)
      setStep(2)
    } else if (step === 2) {
      if (formData.role === 'merchant') {
        await supabase.from('merchants').insert({ user_id: profile.id, business_name: formData.business_name || 'Ma boutique' })
      }
      router.push(formData.role === 'merchant' ? '/dashboard/merchant' : '/dashboard/buyer')
    }
  }

  if (loading) return <div className="text-center py-12">Chargement...</div>

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm">T</div>
          <span className="font-bold text-xl">tabitus</span>
        </div>

        {step === 1 ? (
          <>
            <h1 className="text-2xl font-bold mb-2">Bienvenue ! 👋</h1>
            <p className="text-gray-500 mb-6">Complétez votre profil pour continuer</p>
            <div className="space-y-4 mb-6">
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
                <label className="block text-sm font-medium mb-2">Ville</label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
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
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600"
            >
              Continuer
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">Quel est votre rôle ?</h1>
            <p className="text-gray-500 mb-6">Choisissez votre profil pour continuer</p>
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setFormData({ ...formData, role: 'buyer' })}
                className={`p-4 rounded-xl border-2 w-full text-left transition-all ${
                  formData.role === 'buyer' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">🛍️</div>
                <div className="font-semibold">Acheteur</div>
                <div className="text-xs text-gray-500">Je veux acheter</div>
              </button>
              <button
                onClick={() => setFormData({ ...formData, role: 'merchant' })}
                className={`p-4 rounded-xl border-2 w-full text-left transition-all ${
                  formData.role === 'merchant' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">🏪</div>
                <div className="font-semibold">Commerçant</div>
                <div className="text-xs text-gray-500">Je veux vendre</div>
              </button>
            </div>
            {formData.role === 'merchant' && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Nom de la boutique</label>
                <input
                  type="text"
                  value={formData.business_name || ''}
                  onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                  placeholder="Ma boutique"
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}
            <button
              onClick={handleNext}
              disabled={!formData.role}
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 disabled:opacity-50"
            >
              Terminer
            </button>
          </>
        )}
      </div>
    </div>
  )
}
