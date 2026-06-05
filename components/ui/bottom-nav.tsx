'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, ShoppingBag, PlusCircle, User, Package, Bell, Store } from 'lucide-react'
import { cn } from '@/lib/utils'

type Role = 'buyer' | 'merchant'

interface NavLink {
  href: string
  icon: React.ElementType
  label: string
  exact?: boolean
  primary?: boolean
}

const BUYER_LINKS: NavLink[] = [
  { href: '/dashboard/buyer',              icon: LayoutDashboard, label: 'Accueil',  exact: true },
  { href: '/dashboard/buyer/requests',     icon: ShoppingBag,     label: 'Demandes' },
  { href: '/dashboard/buyer/requests/new', icon: PlusCircle,      label: 'Nouvelle', exact: true, primary: true },
  { href: '/marche-libre',                 icon: Store,           label: 'Marché',   exact: true },
  { href: '/dashboard/buyer/profile',      icon: User,            label: 'Profil',   exact: true },
]

const MERCHANT_LINKS: NavLink[] = [
  { href: '/dashboard/merchant',           icon: LayoutDashboard, label: 'Accueil',  exact: true },
  { href: '/dashboard/merchant/requests',  icon: Bell,            label: 'Demandes' },
  { href: '/dashboard/merchant/offers',    icon: Package,         label: 'Offres' },
  { href: '/dashboard/merchant/profile',   icon: User,            label: 'Profil',   exact: true },
]

export function BottomNav({ role }: { role: Role }) {
  const pathname = usePathname()
  const links = role === 'buyer' ? BUYER_LINKS : MERCHANT_LINKS

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        className="mx-3 mb-3 rounded-2xl border border-border/50 overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px) saturate(200%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
      >
        <div className="flex h-[60px] items-center justify-around px-1">
          {links.map(link => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href)
            const Icon = link.icon

            return (
              <Link key={link.href} href={link.href} className="flex-1 flex justify-center">
                <motion.div
                  whileTap={{ scale: 0.80 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="relative flex flex-col items-center justify-center gap-0.5 py-1.5 min-w-[44px]"
                >
                  {link.primary ? (
                    <motion.div
                      whileTap={{ scale: 0.88 }}
                      className="h-11 w-11 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-brand"
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </motion.div>
                  ) : (
                    <>
                      <div className={cn(
                        'h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-200',
                        isActive
                          ? 'bg-accent'
                          : 'bg-transparent'
                      )}>
                        <Icon
                          className={cn(
                            'h-[18px] w-[18px] transition-colors duration-200',
                            isActive ? 'text-primary' : 'text-muted-foreground'
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          'text-[10px] font-semibold leading-none transition-colors duration-200',
                          isActive ? 'text-primary' : 'text-muted-foreground/60'
                        )}
                      >
                        {link.label}
                      </span>
                    </>
                  )}
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
