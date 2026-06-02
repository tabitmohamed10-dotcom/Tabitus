'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    if (!email || !password) return setError('Remplissez tous les champs')
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user!.id).single()
    if (profile?.role === 'merchant') {
      window.location.href = '/dashboard/merchant'
    } else {
      window.location.href = '/dashboard/buyer'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm">T</div>
          <span className="font-bold text-xl">tabitus</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Bon retour !</h1>
        <p className="text-gray-500 mb-6">Pas de compte ? <Link href="/auth/register" className="text-orange-500 font-medium">S'inscrire</Link></p>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          className="w-full border rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          className="w-full border rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
        <p className="text-center mt-4 text-sm text-gray-500">
          <Link href="/auth/forgot-password" className="text-orange-500">Mot de passe oublié ?</Link>
        </p>
      </div>
    </div>
  )
}
