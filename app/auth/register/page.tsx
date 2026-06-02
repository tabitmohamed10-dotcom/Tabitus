'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<'buyer' | 'merchant'>('buyer')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    if (role === 'merchant') router.push('/dashboard/merchant')
    else router.push('/dashboard/buyer')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm">T</div>
          <span className="font-bold text-xl">tabitus</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Créer un compte</h1>
        <p className="text-gray-500 mb-6">Déjà inscrit ? <Link href="/auth/login" className="text-orange-500 font-medium">Se connecter</Link></p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => setRole('buyer')} className={`p-4 rounded-xl border-2 text-left transition-all ${role === 'buyer' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
            <div className="text-2xl mb-1">🛍️</div>
            <div className="font-semibold text-sm">Acheteur</div>
            <div className="text-xs text-gray-500">Publier des demandes</div>
          </button>
          <button onClick={() => setRole('merchant')} className={`p-4 rounded-xl border-2 text-left transition-all ${role === 'merchant' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
            <div className="text-2xl mb-1">🏪</div>
            <div className="font-semibold text-sm">Commerçant</div>
            <div className="text-xs text-gray-500">Répondre aux demandes</div>
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}
        <input type="text" placeholder="Nom complet" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500" />
        <input type="password" placeholder="Mot de passe (8 caractères min)" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500" />
        <button onClick={handleRegister} disabled={loading} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 disabled:opacity-50">
          {loading ? 'Création...' : `Créer mon compte ${role === 'buyer' ? 'acheteur' : 'commerçant'}`}
        </button>
      </div>
    </div>
  )
}
