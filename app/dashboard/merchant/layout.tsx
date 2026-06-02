import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardNavbar } from '@/components/shared/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'
import { LayoutDashboard, Settings, ShoppingBag, Package, User } from 'lucide-react'

export default async function MerchantLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const links = [
    { href: '/dashboard/merchant',          label: 'Tableau de bord', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/dashboard/merchant/requests', label: 'Demandes',         icon: <ShoppingBag className="h-4 w-4" /> },
    { href: '/dashboard/merchant/offers',   label: 'Mes offres',       icon: <Package className="h-4 w-4" /> },
    { href: '/dashboard/merchant/profile',  label: 'Profil boutique',  icon: <User className="h-4 w-4" /> },
    { href: '/dashboard/merchant/settings', label: 'Paramètres',       icon: <Settings className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-muted/20">
      <DashboardNavbar profile={profile} links={links} />
      <main className="pt-16 pb-20 md:pb-8 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <BottomNav role="merchant" />
    </div>
  )
}
