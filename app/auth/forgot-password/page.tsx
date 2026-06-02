'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleReset() {
    if (!email) return setError('Entrez votre email')
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://tabitus.vercel.app/auth/reset-password'
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm">T</div>
          <span className="font-bold text-xl">tabitus</span>
        </div>
        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h1 className="text-xl font-bold mb-2">Email envoyé !</h1>
            <p className="text-gray-500 text-sm mb-6">Vérifiez votre boîte mail pour réinitialiser votre mot de passe.</p>
            <Link href="/auth/login" className="text-orange-500 font-semibold">Retour à la connexion</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">Mot de passe oublié ?</h1>
            <p className="text-gray-500 mb-6">Entrez votre email et on vous envoie un lien de réinitialisation.</p>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleReset()}
              className="w-full border rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
            <p className="text-center mt-4 text-sm">
              <Link href="/auth/login" className="text-orange-500">← Retour à la connexion</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
