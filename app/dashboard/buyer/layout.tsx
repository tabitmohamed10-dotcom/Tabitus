import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardNavbar } from '@/components/shared/navbar'
import { LayoutDashboard, PlusCircle, Settings, ShoppingBag, User } from 'lucide-react'

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role === 'merchant') redirect('/dashboard/merchant')

  const links = [
    { href: '/dashboard/buyer', label: 'Tableau de bord', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/dashboard/buyer/requests', label: 'Mes demandes', icon: <ShoppingBag className="h-4 w-4" /> },
    { href: '/dashboard/buyer/requests/new', label: 'Nouvelle demande', icon: <PlusCircle className="h-4 w-4" /> },
    { href: '/dashboard/buyer/profile', label: 'Profil', icon: <User className="h-4 w-4" /> },
    { href: '/dashboard/buyer/settings', label: 'Paramètres', icon: <Settings className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-muted/20">
      <DashboardNavbar profile={profile} links={links} />
      <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
