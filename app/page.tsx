'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, CheckCircle2, Star, Zap, Shield, TrendingDown,
  Users, ShoppingBag, Store, ChevronDown, Globe2,
  MessageSquare, Trophy, Clock, Sparkles, Bell, Package,
  BarChart3, Lock, Truck, Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/index'
import { cn } from '@/lib/utils'

// ── Animated counter ──────────────────────────────────────────
function Counter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })

  useEffect(() => {
    if (!isInView || !ref.current) return
    const node = ref.current
    let frame = 0
    const total = 70
    const update = () => {
      frame++
      const eased = 1 - Math.pow(1 - frame / total, 4)
      const v = value * eased
      node.textContent = prefix + (v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 0) + 'k' : Math.round(v).toString()) + suffix
      if (frame < total) requestAnimationFrame(update)
      else node.textContent = prefix + (value >= 1000 ? (value / 1000) + 'k' : String(value)) + suffix
    }
    requestAnimationFrame(update)
  }, [isInView, value, suffix, prefix])

  return <div ref={containerRef} className="inline"><span ref={ref}>{prefix}0{suffix}</span></div>
}

// ── Data ──────────────────────────────────────────────────────
const STEPS_BUYER = [
  {
    n: '01',
    icon: <ShoppingBag className="h-6 w-6" />,
    color: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-950/40 text-indigo-300',
    title: 'Publiez votre besoin',
    desc: 'Décrivez ce que vous cherchez, votre budget et votre ville. En moins de 2 minutes, sans inscription obligatoire.',
    detail: 'Photos, vidéos, délai, livraison — tout est pris en charge.',
  },
  {
    n: '02',
    icon: <Bell className="h-6 w-6" />,
    color: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-950/40 text-violet-300',
    title: 'Recevez des offres',
    desc: 'Notre algorithme alerte les commerçants vérifiés de votre région. Ils vous répondent en temps réel.',
    detail: 'En moyenne 8 offres reçues en moins d\'1h30.',
  },
  {
    n: '03',
    icon: <CheckCircle2 className="h-6 w-6" />,
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-950/40 text-emerald-300',
    title: 'Choisissez la meilleure',
    desc: 'Comparez prix, délais, notes et avis. Échangez en direct et finalisez votre achat en toute sécurité.',
    detail: 'Économisez en moyenne 25% par rapport au prix marché.',
  },
]

const STEPS_MERCHANT = [
  {
    n: '01',
    icon: <Bell className="h-6 w-6" />,
    color: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-950/40 text-indigo-300',
    title: 'Recevez les demandes',
    desc: 'Soyez alerté instantanément des demandes qui correspondent à votre secteur et votre zone géographique.',
    detail: 'Notifications en temps réel, filtrées pour vous.',
  },
  {
    n: '02',
    icon: <Package className="h-6 w-6" />,
    color: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-950/40 text-violet-300',
    title: 'Proposez votre offre',
    desc: 'Prix, délai, livraison — formulaire ultra simple pour répondre en moins de 30 secondes.',
    detail: 'Interface mobile-first, conçue pour aller vite.',
  },
  {
    n: '03',
    icon: <Trophy className="h-6 w-6" />,
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-950/40 text-emerald-300',
    title: 'Développez votre activité',
    desc: 'Acquérez de nouveaux clients sans budget pub. Construisez votre réputation grâce aux avis certifiés.',
    detail: 'En moyenne +35% de CA pour nos commerçants actifs.',
  },
]

const CATEGORIES = [
  { icon: '💻', name: 'High-Tech', count: '2 400+' },
  { icon: '🏠', name: 'Maison', count: '1 800+' },
  { icon: '👗', name: 'Mode', count: '3 100+' },
  { icon: '🚗', name: 'Auto', count: '980+' },
  { icon: '🏗️', name: 'BTP', count: '1 200+' },
  { icon: '💊', name: 'Santé', count: '650+' },
  { icon: '🍎', name: 'Alimentaire', count: '2 800+' },
  { icon: '✈️', name: 'Voyage', count: '540+' },
  { icon: '👶', name: 'Enfants', count: '890+' },
  { icon: '🎓', name: 'Formation', count: '720+' },
  { icon: '🔧', name: 'Services', count: '1 500+' },
  { icon: '💄', name: 'Beauté', count: '1 100+' },
]

const TESTIMONIALS = [
  {
    name: 'Fatima Zohra',
    role: 'Enseignante',
    city: 'Casablanca',
    avatar: 'F',
    avatarColor: 'from-pink-500 to-rose-600',
    text: 'J\'ai trouvé un iPhone 15 Pro à 2 200 DH de moins que dans les magasins. En 1h30 j\'avais 11 offres. Je ne ferai plus jamais mes achats autrement.',
    stars: 5,
    badge: '2 200 DH économisés',
    badgeColor: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40',
  },
  {
    name: 'Ahmed Bennani',
    role: 'Gérant de boutique',
    city: 'Marrakech',
    avatar: 'A',
    avatarColor: 'from-indigo-500 to-violet-600',
    text: 'En un mois j\'ai reçu 43 demandes de clients qualifiés. Mon chiffre d\'affaires a augmenté de 35% sans dépenser un centime en publicité.',
    stars: 5,
    badge: '+35% de CA',
    badgeColor: 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/40',
  },
  {
    name: 'Karim Idrissi',
    role: 'Entrepreneur',
    city: 'Rabat',
    avatar: 'K',
    avatarColor: 'from-violet-500 to-purple-600',
    text: 'Machine à laver en urgence un samedi soir. En 2h j\'avais 8 offres avec livraison le lendemain. Le meilleur prix était 800 DH sous le tarif habituel.',
    stars: 5,
    badge: '800 DH économisés',
    badgeColor: 'bg-violet-950/60 text-violet-300 border border-violet-800/40',
  },
]

const FAQS = [
  {
    q: 'Est-ce gratuit pour les acheteurs ?',
    a: 'Oui, Tabitus est 100% gratuit pour les acheteurs. Publiez autant de demandes que vous voulez, recevez autant d\'offres que vous souhaitez, sans aucun frais.',
  },
  {
    q: 'Comment les commerçants sont-ils vérifiés ?',
    a: 'Chaque commerçant passe une vérification : identité, registre de commerce, numéro de téléphone. Le badge ✅ Vérifié est attribué après contrôle de notre équipe et engagement de qualité de service.',
  },
  {
    q: 'Dans quelles villes est-il disponible ?',
    a: 'Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir, Meknès, Oujda, Kénitra, Tétouan et plus de 12 autres villes marocaines. L\'expansion à l\'international (Sénégal, Côte d\'Ivoire) est prévue pour 2025.',
  },
  {
    q: 'Que faire si je ne reçois pas d\'offre ?',
    a: 'Vos demandes restent actives 7 jours. En cas d\'absence d\'offre, notre équipe vous contacte pour vous aider à reformuler votre demande et la rendre plus attractive pour les commerçants.',
  },
  {
    q: 'Comment Tabitus génère-t-il ses revenus ?',
    a: 'Tabitus prend une commission de 5% uniquement sur les transactions finalisées. Les acheteurs ne paient jamais de frais supplémentaires.',
  },
  {
    q: 'Puis-je négocier avec les commerçants ?',
    a: 'Absolument. Après avoir reçu une offre, vous pouvez discuter directement avec le commerçant via notre chat sécurisé. La transparence et la communication directe sont au cœur de Tabitus.',
  },
]

const LOGOS = ['Casablanca', 'Marrakech', 'Rabat', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda']

// ── Navbar ────────────────────────────────────────────────────
function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <nav className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass border-b border-white/[0.07] shadow-floating'
          : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand transition-transform group-hover:scale-105">
              <span className="font-display font-bold text-white text-sm">T</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">tabitus</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            {[
              { href: '#comment-ca-marche', label: 'Comment ça marche' },
              { href: '#categories', label: 'Catégories' },
              { href: '#pour-commercants', label: 'Commerçants' },
              { href: '#temoignages', label: 'Avis' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">Connexion</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="gradient" size="sm" className="gap-1.5">
                <span className="hidden sm:inline">Commencer</span>
                <span className="sm:hidden">S'inscrire</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden h-9 w-9 rounded-xl bg-white/[0.06] flex items-center justify-center"
            >
              <div className="space-y-1.5">
                <div className={cn('h-0.5 w-5 bg-foreground transition-all', mobileOpen && 'rotate-45 translate-y-2')} />
                <div className={cn('h-0.5 w-5 bg-foreground transition-all', mobileOpen && 'opacity-0')} />
                <div className={cn('h-0.5 w-5 bg-foreground transition-all', mobileOpen && '-rotate-45 -translate-y-2')} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed top-16 left-0 right-0 z-40 glass border-b border-white/[0.07] shadow-floating md:hidden"
          >
            <div className="p-4 space-y-1">
              {[
                { href: '#comment-ca-marche', label: 'Comment ça marche' },
                { href: '#categories', label: 'Catégories' },
                { href: '#pour-commercants', label: 'Commerçants' },
                { href: '#temoignages', label: 'Témoignages' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/[0.05] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/[0.07] grid grid-cols-2 gap-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="w-full">Connexion</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="gradient" size="sm" className="w-full">S'inscrire</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Hero ──────────────────────────────────────────────────────
function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 400], [0, 60])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3])

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-indigo-600/[0.10] blur-[120px]" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/[0.07] blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-800/[0.06] blur-[80px]" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 w-full">
        <motion.div style={{ y, opacity }} ref={containerRef}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 glass border border-white/[0.10] rounded-full px-4 py-2 shadow-premium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-foreground/80">Disponible au Maroc · 22 villes</span>
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-7"
          >
            <h1 className="font-display text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[1.04] tracking-[-0.04em] text-balance">
              Le marché qui{' '}
              <span className="relative inline-block">
                <span className="text-gradient">travaille pour vous</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-1 left-0 right-0 h-[3px] bg-brand-gradient rounded-full origin-left"
                />
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Publiez ce que vous cherchez. Des commerçants vérifiés vous envoient leurs meilleures offres.
            Comparez, choisissez, et{' '}
            <span className="font-semibold text-foreground">économisez jusqu'à 25%</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-14"
          >
            <Link href="/auth/register?role=buyer">
              <Button variant="gradient" size="xl" className="group w-full sm:w-auto shadow-brand">
                Publier ma première demande
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/auth/register?role=merchant">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Je suis commerçant
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-16"
          >
            {[
              { value: 50000, suffix: '+', label: 'utilisateurs', icon: <Users className="h-4 w-4" /> },
              { value: 8000, suffix: '+', label: 'commerçants', icon: <Store className="h-4 w-4" /> },
              { value: 200000, suffix: '+', label: 'demandes', icon: <ShoppingBag className="h-4 w-4" /> },
              { value: 4.8, suffix: '/5', label: 'satisfaction', icon: <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> },
            ].map(({ value, suffix, label, icon }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-foreground">{icon}</span>
                <span className="font-bold text-foreground text-base">
                  {value < 10 ? `${value}${suffix}` : <Counter value={value} suffix={suffix} />}
                </span>
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Product preview */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="absolute -inset-4 bg-indigo-600/[0.06] blur-2xl rounded-[2.5rem]" />

          <div className="relative bg-card border border-border/60 rounded-3xl shadow-dramatic overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/60 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-background/60 border border-border/60 rounded-lg px-4 py-1 text-xs text-muted-foreground font-medium">
                  tabitus.com/ma-demande
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wider">Votre demande</h3>
                  <Badge variant="urgent" size="sm">Urgent</Badge>
                </div>
                <div className="bg-accent/40 border border-primary/15 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-11 w-11 rounded-xl bg-indigo-950/50 flex items-center justify-center text-2xl">📱</div>
                    <div>
                      <h4 className="font-display font-bold">iPhone 15 Pro 256GB</h4>
                      <p className="text-xs text-muted-foreground">Titanium Black · Neuf</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-background/70 rounded-xl p-2.5">
                      <p className="text-muted-foreground mb-0.5">Budget</p>
                      <p className="font-bold text-foreground">12 – 14 000 DH</p>
                    </div>
                    <div className="bg-background/70 rounded-xl p-2.5">
                      <p className="text-muted-foreground mb-0.5">Ville</p>
                      <p className="font-bold text-foreground">Casablanca</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-semibold">
                    <Bell className="h-3.5 w-3.5" />
                    <span>12 commerçants alertés · Réponses en cours</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wider">
                  Offres reçues <span className="text-foreground">3</span>
                </h3>
                <div className="space-y-2.5">
                  {[
                    { name: 'TechShop Anfa', price: '12 400 DH', delay: '2j', rating: '4.9', verified: true, best: true, savings: '1 600 DH' },
                    { name: 'MobileCity', price: '12 800 DH', delay: '1j', rating: '4.7', verified: true, best: false, savings: '' },
                    { name: 'ElectroPro', price: '13 100 DH', delay: '3j', rating: '4.5', verified: false, best: false, savings: '' },
                  ].map((offer, i) => (
                    <motion.div
                      key={offer.name}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.12, duration: 0.4 }}
                      className={cn(
                        'flex items-center justify-between rounded-2xl p-3.5 border transition-all',
                        offer.best
                          ? 'border-emerald-700/40 bg-emerald-950/30 ring-1 ring-emerald-800/30'
                          : 'border-border/60 bg-card hover:bg-muted/30'
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-sm font-bold truncate">{offer.name}</span>
                          {offer.verified && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />}
                          {offer.best && <Badge variant="success" size="sm">Meilleure</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">⭐ {offer.rating} · {offer.delay} livraison</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm">{offer.price}</p>
                        {offer.savings && <p className="text-[10px] text-emerald-400 font-semibold">-{offer.savings}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="absolute -top-5 -left-5 hidden sm:block"
          >
            <div className="glass border border-white/[0.10] rounded-2xl shadow-floating px-4 py-3 animate-float">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="h-7 w-7 rounded-xl bg-emerald-950/60 flex items-center justify-center text-base">💰</span>
                <div>
                  <p className="text-xs text-muted-foreground leading-none mb-0.5">Économie</p>
                  <p className="font-bold leading-none">1 600 DH</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute -bottom-5 -right-5 hidden sm:block"
          >
            <div className="glass border border-white/[0.10] rounded-2xl shadow-floating px-4 py-3 animate-float-slow">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="h-7 w-7 rounded-xl bg-indigo-950/60 flex items-center justify-center text-base">⚡</span>
                <div>
                  <p className="text-xs text-muted-foreground leading-none mb-0.5">Réponse en</p>
                  <p className="font-bold leading-none">47 min</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ── City Marquee ──────────────────────────────────────────────
function CityMarquee() {
  const cities = [...LOGOS, ...LOGOS]
  return (
    <div className="py-10 border-y border-border/40 overflow-hidden bg-muted/10">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
        Disponible dans 22 villes marocaines
      </p>
      <div className="flex animate-marquee whitespace-nowrap gap-8">
        {cities.map((city, i) => (
          <div key={i} className="inline-flex items-center gap-2.5 shrink-0 px-4">
            <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
            <span className="text-sm font-semibold text-muted-foreground">{city}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── How it works ──────────────────────────────────────────────
function HowItWorksSection() {
  const [tab, setTab] = useState<'buyer' | 'merchant'>('buyer')
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const steps = tab === 'buyer' ? STEPS_BUYER : STEPS_MERCHANT

  return (
    <section id="comment-ca-marche" className="py-28 bg-muted/10" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="default" className="mb-4">Comment ça marche</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Simple comme bonjour
          </h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
            Que vous soyez acheteur ou commerçant, Tabitus s'adapte à vous.
          </p>

          <div className="inline-flex bg-card border border-border/60 rounded-2xl p-1.5 shadow-premium">
            {[
              { key: 'buyer', label: '👤 Acheteurs' },
              { key: 'merchant', label: '🏪 Commerçants' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key as 'buyer' | 'merchant')}
                className={cn(
                  'px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                  tab === key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-card border border-border/60 rounded-3xl p-8 shadow-premium h-full hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className={cn('h-12 w-12 rounded-2xl flex items-center justify-center text-white', `bg-gradient-to-br ${step.color}`)}>
                      {step.icon}
                    </div>
                    <span className="text-3xl font-display font-bold text-muted-foreground/20 leading-none">
                      {step.n}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{step.desc}</p>
                  <div className={cn('rounded-xl px-3 py-2 text-xs font-medium', step.bg)}>
                    {step.detail}
                  </div>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 z-10 items-center justify-center h-6 w-6 rounded-full bg-muted border border-border text-muted-foreground/60">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 text-center">
          <Link href={`/auth/register?role=${tab}`}>
            <Button variant={tab === 'buyer' ? 'gradient' : 'premium'} size="lg">
              {tab === 'buyer' ? 'Publier ma demande maintenant' : 'Rejoindre comme commerçant'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Categories ────────────────────────────────────────────────
function CategoriesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="categories" className="py-28" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="default" className="mb-4">Tous les secteurs</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Tout. Absolument tout.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            De l'iPhone au mouton de l'Aïd, de la formation professionnelle au déménagement — Tabitus couvre 60+ catégories.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/auth/register"
                className="group block bg-card border border-border/60 rounded-2xl p-4 text-center hover:border-primary/40 hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="text-3xl mb-2.5 transition-transform duration-200 group-hover:scale-110">
                  {cat.icon}
                </div>
                <h3 className="font-display font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-muted-foreground">{cat.count} demandes</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          + 48 autres catégories disponibles
        </p>
      </div>
    </section>
  )
}

// ── Advantages (dark section) ─────────────────────────────────
function AdvantagesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="pour-commercants" className="py-28 bg-card relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.08] blur-[80px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/[0.06] blur-[80px]" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Buyers column */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3.5 py-1.5 mb-8">
              <ShoppingBag className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-300">Pour les acheteurs</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-10 leading-[1.1] tracking-tight">
              Arrêtez de chercher.<br />
              <span className="text-gradient">Laissez-les venir.</span>
            </h2>
            <div className="space-y-5">
              {[
                { icon: <TrendingDown className="h-5 w-5" />, title: 'Économisez en moyenne 25%', desc: 'La concurrence entre commerçants fait baisser les prix naturellement. Vous gagnez sans négocier.' },
                { icon: <Zap className="h-5 w-5" />, title: 'Réponses en moins de 2h', desc: 'Les commerçants sont alertés instantanément et ont tout intérêt à répondre vite.' },
                { icon: <Shield className="h-5 w-5" />, title: 'Commerçants vérifiés', desc: 'Chaque vendeur est authentifié. Identité, RC, téléphone. Votre sécurité est notre priorité.' },
                { icon: <Globe2 className="h-5 w-5" />, title: 'Livraison partout', desc: 'Des offres avec livraison dans toutes les villes. Comparez aussi les frais de port.' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className="flex gap-4"
                >
                  <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1.5 text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Merchants column */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.10] rounded-full px-3.5 py-1.5 mb-8">
              <Store className="h-3.5 w-3.5 text-foreground/60" />
              <span className="text-sm font-semibold text-foreground/70">Pour les commerçants</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-10 leading-[1.1] tracking-tight">
              Des clients.<br />
              Sans publicité.
            </h2>
            <div className="space-y-5">
              {[
                { icon: <Users className="h-5 w-5" />, title: 'Clients qualifiés', desc: 'Chaque demande est un client qui veut acheter maintenant, avec budget et délai précisés.' },
                { icon: <MessageSquare className="h-5 w-5" />, title: 'Répondez en 30 secondes', desc: 'Interface ultra simple pour soumettre une offre depuis votre mobile en quelques touches.' },
                { icon: <Trophy className="h-5 w-5" />, title: 'Construisez votre réputation', desc: 'Les avis certifiés vous distinguent de la concurrence et boostent votre conversion.' },
                { icon: <BarChart3 className="h-5 w-5" />, title: '0 DH à l\'inscription', desc: 'Commencez gratuitement, payez uniquement sur les ventes conclues. Zéro risque.' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
                  className="flex gap-4"
                >
                  <div className="h-11 w-11 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-foreground/50 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1.5 text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────
function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="temoignages" className="py-28 bg-muted/10" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="default" className="mb-4">Témoignages</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Plus de 50 000 utilisateurs partagent leurs expériences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-card border border-border/60 rounded-3xl p-8 shadow-premium hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-foreground/80 leading-relaxed mb-6 text-[15px]">"{t.text}"</p>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br shrink-0',
                    t.avatarColor
                  )}>
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm leading-none mb-1 truncate">{t.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.role} · {t.city}</p>
                  </div>
                </div>
                <div className={cn('shrink-0 px-2.5 py-1 rounded-full text-xs font-bold', t.badgeColor)}>
                  {t.badge}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="faq" className="py-28" ref={ref}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="default" className="mb-4">FAQ</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Questions fréquentes
          </h2>
        </motion.div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={cn(
                'border rounded-2xl overflow-hidden bg-card transition-all duration-200',
                open === i ? 'shadow-elevated border-border' : 'shadow-premium border-border/60'
              )}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.03] transition-colors gap-4"
              >
                <span className="font-semibold text-[15px] leading-snug">{faq.q}</span>
                <div className={cn(
                  'h-7 w-7 rounded-xl bg-muted/60 flex items-center justify-center shrink-0 transition-all duration-200',
                  open === i && 'bg-primary/10 text-primary'
                )}>
                  <ChevronDown className={cn(
                    'h-4 w-4 text-muted-foreground transition-transform duration-200',
                    open === i && 'rotate-180 text-primary'
                  )} />
                </div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border/40 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────
function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-28 px-4 sm:px-6 relative overflow-hidden" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-4xl mx-auto rounded-[2rem] overflow-hidden"
      >
        <div className="absolute inset-0 bg-brand-gradient" />
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white/[0.06] blur-[60px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-black/[0.15] blur-[60px] translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 text-center text-white px-8 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 bg-white/[0.12] border border-white/20 rounded-full px-4 py-2 mb-8 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Inscription gratuite · Sans carte bancaire
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.08] tracking-tight text-balance">
            Prêt à économiser sur vos prochains achats ?
          </h2>
          <p className="text-xl text-white/75 mb-12 max-w-2xl mx-auto leading-relaxed">
            Rejoignez 50 000+ utilisateurs qui laissent Tabitus faire le travail à leur place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=buyer">
              <Button
                size="xl"
                className="bg-white text-indigo-600 hover:bg-white/92 shadow-dramatic w-full sm:w-auto font-bold"
              >
                Je publie ma demande
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/register?role=merchant">
              <Button
                size="xl"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/[0.08] hover:border-white/50 w-full sm:w-auto"
              >
                Je suis commerçant
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-white/55">
            {[
              { icon: <Lock className="h-3.5 w-3.5" />, text: 'Données sécurisées' },
              { icon: <Check className="h-3.5 w-3.5" />, text: 'Sans engagement' },
              { icon: <Globe2 className="h-3.5 w-3.5" />, text: '22 villes au Maroc' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-1.5">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-card border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="h-9 w-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand">
                <span className="font-display font-bold text-white text-base">T</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight">tabitus</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              La marketplace intelligente du Maroc. Publiez vos besoins, recevez les meilleures offres.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <span className="text-xs">🇲🇦</span>
              <span className="text-xs text-muted-foreground">Conçu avec ❤️ au Maroc</span>
            </div>
          </div>

          {[
            { title: 'Produit', links: ['Comment ça marche', 'Catégories', 'Pour les commerçants', 'Témoignages'] },
            { title: 'Support', links: ['Centre d\'aide', 'Nous contacter', 'Blog', 'Signaler un problème'] },
            { title: 'Légal', links: ['Mentions légales', 'Confidentialité', 'CGU', 'Cookies'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-5 text-foreground/70">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l}>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2025 Tabitus. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-foreground transition-colors">CGU</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="antialiased">
      <NavBar />
      <HeroSection />
      <CityMarquee />
      <HowItWorksSection />
      <CategoriesSection />
      <AdvantagesSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}
