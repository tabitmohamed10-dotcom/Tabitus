import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardNavbar } from '@/components/shared/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'
import { LayoutDashboard, Settings, ShoppingBag, Package, User, Rss } from 'lucide-react'
import NotificationSystem from '@/app/components/NotificationSystem'

export default async function MerchantLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const links = [
    { href: '/dashboard/merchant',          label: 'Tableau de bord', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/dashboard/feed',              label: 'Fil des demandes', icon: <Rss className="h-4 w-4" /> },
    { href: '/dashboard/merchant/requests', label: 'Demandes',         icon: <ShoppingBag className="h-4 w-4" /> },
    { href: '/dashboard/merchant/offers',   label: 'Mes offres',       icon: <Package className="h-4 w-4" /> },
    { href: '/dashboard/merchant/profile',  label: 'Profil boutique',  icon: <User className="h-4 w-4" /> },
    { href: '/dashboard/merchant/settings', label: 'Paramètres',       icon: <Settings className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardNavbar profile={profile} links={links} />
      <main className="pt-14 pb-24 md:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
          {children}
        </div>
      </main>
      <BottomNav role="merchant" />
      <NotificationSystem userId={user.id} role="merchant" />
    </div>
  )
}
