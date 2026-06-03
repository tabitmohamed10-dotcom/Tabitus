import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  LayoutDashboard, Users, ShoppingBag, Store, Settings, Shield,
} from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard/buyer')

  const navItems = [
    { href: '/admin', label: 'Vue d\'ensemble', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/admin/users', label: 'Utilisateurs', icon: <Users className="h-4 w-4" /> },
    { href: '/admin/requests', label: 'Demandes', icon: <ShoppingBag className="h-4 w-4" /> },
    { href: '/admin/merchants', label: 'Commerçants', icon: <Store className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-foreground text-background min-h-screen fixed top-0 left-0 z-40">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-display font-bold">Admin Panel</span>
          </div>
          <p className="text-xs text-background/40 mt-0.5">Tabitus</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-background/70 hover:text-background hover:bg-white/10 transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
