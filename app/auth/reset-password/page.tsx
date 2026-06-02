'use client'
import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleReset() {
    if (!password || !passwordConfirm) return setError('Remplissez tous les champs')
    if (password !== passwordConfirm) return setError('Les mots de passe ne correspondent pas')
    if (password.length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères')

    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }
    setSuccess(true)
    setTimeout(() => router.push('/auth/login'), 2000)
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm">T</div>
        <span className="font-bold text-xl">tabitus</span>
      </div>
      {success ? (
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold mb-2">Mot de passe réinitialisé !</h1>
          <p className="text-gray-500 text-sm mb-6">Redirection vers la connexion...</p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-2">Nouveau mot de passe</h1>
          <p className="text-gray-500 mb-6">Entrez votre nouveau mot de passe.</p>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={passwordConfirm}
            onChange={e => setPasswordConfirm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleReset()}
            className="w-full border rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>
          <p className="text-center mt-4 text-sm">
            <Link href="/auth/login" className="text-orange-500">← Retour à la connexion</Link>
          </p>
        </>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense fallback={<div className="text-gray-400">Chargement...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
