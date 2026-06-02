'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, ShoppingBag, PlusCircle, User, Package, Bell } from 'lucide-react'
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
  { href: '/dashboard/buyer',                icon: LayoutDashboard, label: 'Accueil',  exact: true },
  { href: '/dashboard/buyer/requests',       icon: ShoppingBag,     label: 'Demandes' },
  { href: '/dashboard/buyer/requests/new',   icon: PlusCircle,      label: 'Publier',  exact: true, primary: true },
  { href: '/dashboard/buyer/profile',        icon: User,            label: 'Profil',   exact: true },
]

const MERCHANT_LINKS: NavLink[] = [
  { href: '/dashboard/merchant',             icon: LayoutDashboard, label: 'Accueil',  exact: true },
  { href: '/dashboard/merchant/requests',    icon: Bell,            label: 'Demandes' },
  { href: '/dashboard/merchant/offers',      icon: Package,         label: 'Offres' },
  { href: '/dashboard/merchant/profile',     icon: User,            label: 'Profil',   exact: true },
]

export function BottomNav({ role }: { role: Role }) {
  const pathname = usePathname()
  const links = role === 'buyer' ? BUYER_LINKS : MERCHANT_LINKS

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-border"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px) saturate(180%)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex h-16 items-center justify-around px-2 max-w-sm mx-auto">
        {links.map(link => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href)
          const Icon = link.icon

          return (
            <Link key={link.href} href={link.href} className="flex-1 flex justify-center">
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="relative flex flex-col items-center gap-0.5 py-1 min-w-[52px]"
              >
                {isActive && !link.primary && (
                  <motion.div
                    layoutId={`bnav-active-${role}`}
                    className="absolute -top-2 w-6 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {link.primary ? (
                  <div className="h-11 w-11 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/40">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <>
                    <Icon
                      className={cn(
                        'h-[22px] w-[22px] transition-colors duration-200',
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                    <span
                      className={cn(
                        'text-[10px] font-medium leading-tight transition-colors duration-200',
                        isActive ? 'text-primary' : 'text-muted-foreground'
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
    </nav>
  )
}
