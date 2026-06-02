'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LogoutPage() {
  useEffect(() => {
    async function logout() {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = '/'
    }
    logout()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Déconnexion en cours...</p>
    </div>
  )
}
