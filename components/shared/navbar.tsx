'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Bell, ChevronDown, LogOut, Settings, User, Menu, X, Store,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useNotifications } from '@/lib/hooks'
import { Avatar, Badge } from '@/components/ui/index'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/types'

interface NavbarProps {
  profile: Profile | null
  links: { href: string; label: string; icon: React.ReactNode }[]
}

export function DashboardNavbar({ profile, links }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { unread, notifications, markAllRead } = useNotifications()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-display font-bold text-sm">T</div>
              <span className="font-display font-bold text-lg tracking-tight">tabitus</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead() }}
                className="relative h-10 w-10 rounded-xl hover:bg-muted flex items-center justify-center transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-destructive rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-background border rounded-2xl shadow-premium-hover overflow-hidden animate-scale-in">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">Aucune notification</p>
                    ) : notifications.map(n => (
                      <Link
                        key={n.id}
                        href={n.action_url || '#'}
                        onClick={() => setNotifOpen(false)}
                        className={cn(
                          'block px-4 py-3 hover:bg-muted/50 transition-colors border-b last:border-0',
                          !n.read && 'bg-accent/50'
                        )}
                      >
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 h-10 px-2 rounded-xl hover:bg-muted transition-colors"
              >
                <Avatar src={profile?.avatar_url} name={profile?.full_name} size="sm" />
                <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
                  {profile?.full_name?.split(' ')[0]}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-52 bg-background border rounded-2xl shadow-premium-hover overflow-hidden animate-scale-in">
                  <div className="p-3 border-b">
                    <p className="text-sm font-semibold truncate">{profile?.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                  </div>
                  {[
                    { icon: <User className="h-4 w-4" />, label: 'Profil', href: pathname.startsWith('/dashboard/merchant') ? '/dashboard/merchant/profile' : '/dashboard/buyer/profile' },
                    { icon: <Settings className="h-4 w-4" />, label: 'Paramètres', href: pathname.startsWith('/dashboard/merchant') ? '/dashboard/merchant/settings' : '/dashboard/buyer/settings' },
                  ].map(item => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden h-10 w-10 rounded-xl hover:bg-muted flex items-center justify-center"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background md:hidden animate-slide-in-right">
          <div className="p-4 space-y-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted'
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
