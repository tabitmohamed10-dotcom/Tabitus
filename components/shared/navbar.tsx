'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  Bell, ChevronDown, LogOut, Settings, User, Menu, X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useNotifications } from '@/lib/hooks'
import { Avatar, Badge } from '@/components/ui/index'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatTimeAgo } from '@/lib/utils'
import type { Profile } from '@/lib/types'

interface NavbarProps {
  profile: Profile | null
  links: { href: string; label: string; icon: React.ReactNode }[]
}

function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return
      handler()
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [ref, handler])
}

export function DashboardNavbar({ profile, links }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { unread, notifications, markAllRead } = useNotifications()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(notifRef, () => setNotifOpen(false))
  useOnClickOutside(userMenuRef, () => setUserMenuOpen(false))

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isMerchant = pathname.startsWith('/dashboard/merchant')
  const profileHref = isMerchant ? '/dashboard/merchant/profile' : '/dashboard/buyer/profile'
  const settingsHref = isMerchant ? '/dashboard/merchant/settings' : '/dashboard/buyer/settings'

  const notifTypeColors: Record<string, string> = {
    offer_received: 'text-gold-500',
    offer_accepted: 'text-green-500',
    offer_rejected: 'text-red-500',
    new_message: 'text-primary',
    system: 'text-muted-foreground',
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/60 h-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">

          {/* Logo + nav */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center group">
              <img
                src="/logo.svg"
                alt="Tabit"
                className="h-8 w-auto transition-opacity group-hover:opacity-85"
              />
            </Link>

            <div className="hidden md:flex items-center gap-0.5">
              {links.map(link => {
                const active = pathname === link.href || pathname.startsWith(link.href + '/')
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                      active
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    )}
                  >
                    <span className="opacity-70">{link.icon}</span>
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen)
                  setUserMenuOpen(false)
                  if (!notifOpen && unread > 0) markAllRead()
                }}
                className={cn(
                  'relative h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-150',
                  notifOpen
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                <Bell className="h-4.5 w-4.5" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 min-h-4 min-w-4 px-1 bg-destructive rounded-full text-[10px] text-white font-bold flex items-center justify-center leading-none">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-11 w-[340px] bg-card border border-border/60 rounded-2xl shadow-floating overflow-hidden animate-scale-in">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                    <h3 className="font-display font-bold text-sm">Notifications</h3>
                    {unread > 0 && (
                      <Badge variant="default" size="sm">{unread} nouvelles</Badge>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-3xl mb-2">🔔</p>
                        <p className="text-sm text-muted-foreground font-medium">Aucune notification</p>
                      </div>
                    ) : (
                      notifications.slice(0, 8).map(n => (
                        <Link
                          key={n.id}
                          href={n.action_url || '#'}
                          onClick={() => setNotifOpen(false)}
                          className={cn(
                            'block px-4 py-3 transition-colors border-b border-border/40 last:border-0',
                            'hover:bg-muted/40',
                            !n.read && 'bg-accent/30'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              'h-2 w-2 rounded-full mt-1.5 shrink-0',
                              !n.read ? 'bg-primary' : 'bg-transparent'
                            )} />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold leading-snug">{n.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                              <p className="text-[10px] text-muted-foreground/60 mt-1">
                                {formatTimeAgo(n.created_at)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen)
                  setNotifOpen(false)
                }}
                className={cn(
                  'flex items-center gap-2 h-9 px-2 rounded-xl transition-all duration-150',
                  userMenuOpen
                    ? 'bg-accent'
                    : 'hover:bg-muted/60'
                )}
              >
                <Avatar src={profile?.avatar_url} name={profile?.full_name} size="xs" />
                <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
                  {profile?.full_name?.split(' ')[0]}
                </span>
                <ChevronDown className={cn(
                  'h-3.5 w-3.5 text-muted-foreground transition-transform duration-150',
                  userMenuOpen && 'rotate-180'
                )} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-11 w-52 bg-card border border-border/60 rounded-2xl shadow-floating overflow-hidden animate-scale-in">
                  <div className="px-4 py-3 border-b border-border/60">
                    <p className="text-sm font-semibold truncate">{profile?.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: <User className="h-4 w-4" />, label: 'Mon profil', href: profileHref },
                      { icon: <Settings className="h-4 w-4" />, label: 'Paramètres', href: settingsHref },
                    ].map(item => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <span className="text-muted-foreground">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-border/60 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden h-9 w-9 rounded-xl hover:bg-muted/60 flex items-center justify-center transition-colors"
            >
              {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 top-14 z-40 md:hidden animate-fade-in">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 right-0 top-0 bg-card border-b border-border/60 shadow-floating animate-fade-down">
            <div className="p-3 space-y-0.5">
              {links.map(link => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      active
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-muted/60 text-muted-foreground'
                    )}
                  >
                    <span className="opacity-70">{link.icon}</span>
                    {link.label}
                  </Link>
                )
              })}
              <div className="pt-2 border-t border-border/60 mt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
