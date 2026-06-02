'use client'
import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight, CheckCircle2, Star, Zap, Shield, TrendingDown,
  Users, ShoppingBag, Store, ChevronDown, Play, Globe2,
  MessageSquare, Trophy, Clock, Sparkles, Search, Bell,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/index'
import { cn } from '@/lib/utils'

// ── Data ──────────────────────────────────────────────────────
const STEPS_BUYER = [
  {
    n: '01', icon: '📝',
    title: 'Publiez votre besoin',
    desc: 'Décrivez ce que vous cherchez, votre budget et votre ville. En moins de 2 minutes.',
  },
  {
    n: '02', icon: '💬',
    title: 'Recevez des offres',
    desc: 'Les commerçants de votre région vous envoient leurs meilleures propositions.',
  },
  {
    n: '03', icon: '✅',
    title: 'Choisissez la meilleure',
    desc: 'Comparez les prix, délais et notes. Choisissez en toute confiance.',
  },
]

const STEPS_MERCHANT = [
  { icon: '🔔', title: 'Recevez les demandes', desc: 'Soyez alerté des demandes correspondant à votre secteur et votre zone.' },
  { icon: '💰', title: 'Proposez votre offre', desc: 'Prix, délai, livraison — tout en 30 secondes.' },
  { icon: '🚀', title: 'Développez votre activité', desc: 'Acquérez de nouveaux clients sans dépenses publicitaires.' },
]

const CATEGORIES_PREVIEW = [
  { icon: '💻', name: 'High-Tech', slug: 'smartphones', count: '2.4k demandes' },
  { icon: '🏠', name: 'Maison', slug: 'electromenager', count: '1.8k demandes' },
  { icon: '👗', name: 'Mode', slug: 'mode-femme', count: '3.1k demandes' },
  { icon: '🚗', name: 'Auto', slug: 'voitures', count: '980 demandes' },
  { icon: '🏗️', name: 'BTP', slug: 'artisans', count: '1.2k demandes' },
  { icon: '💊', name: 'Santé', slug: 'pharmacie', count: '650 demandes' },
  { icon: '🍎', name: 'Alimentaire', slug: 'alimentation', count: '2.8k demandes' },
  { icon: '✈️', name: 'Voyage', slug: 'hotels', count: '540 demandes' },
  { icon: '👶', name: 'Enfants', slug: 'jouets', count: '890 demandes' },
  { icon: '🎓', name: 'Formation', slug: 'formation', count: '720 demandes' },
  { icon: '🔧', name: 'Services', slug: 'reparation', count: '1.5k demandes' },
  { icon: '💄', name: 'Beauté', slug: 'parfums', count: '1.1k demandes' },
]

const TESTIMONIALS = [
  {
    name: 'Fatima Zohra',
    role: 'Enseignante, Casablanca',
    avatar: 'F',
    text: 'J\'ai trouvé un iPhone 15 Pro à 2200 DH de moins que dans les magasins. Incroyable!',
    stars: 5,
    saving: '2 200 DH économisés',
  },
  {
    name: 'Ahmed Bennani',
    role: 'Gérant, Marrakech',
    avatar: 'A',
    text: 'En un mois j\'ai reçu 43 demandes de clients. Mon chiffre d\'affaires a augmenté de 35%.',
    stars: 5,
    saving: '+35% de CA',
  },
  {
    name: 'Karim Idrissi',
    role: 'Entrepreneur, Rabat',
    avatar: 'K',
    text: 'J\'avais besoin d\'une machine à laver urgente. En 2h j\'avais 8 offres. C\'est magique.',
    stars: 5,
    saving: '6h gagnées',
  },
]

const FAQS = [
  {
    q: 'Est-ce gratuit pour les acheteurs ?',
    a: 'Oui, Tabitus est 100% gratuit pour les acheteurs. Publiez autant de demandes que vous voulez sans frais.',
  },
  {
    q: 'Comment les commerçants sont-ils vérifiés ?',
    a: 'Nous vérifions chaque commerçant (identité, SIRET/RC, numéro de téléphone). Le badge ✅ Vérifié garantit la fiabilité.',
  },
  {
    q: 'Dans quelles villes Tabitus est-il disponible ?',
    a: 'Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir et plus de 20 autres villes marocaines. Expansion internationale en 2025.',
  },
  {
    q: 'Que se passe-t-il si je ne reçois pas d\'offre ?',
    a: 'Vos demandes restent actives 7 jours. Notre équipe peut vous aider à reformuler pour attirer plus de commerçants.',
  },
  {
    q: 'Comment Tabitus gagne-t-il de l\'argent ?',
    a: 'Tabitus prend une petite commission uniquement sur les transactions finalisées. Les commerçants peuvent aussi acheter des boosts de visibilité.',
  },
]

// ── Components ──────────────────────────────────────────────────

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-display font-bold text-sm">T</div>
          <span className="font-display font-bold text-xl tracking-tight">tabitus</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#comment-ca-marche" className="hover:text-foreground transition-colors">Comment ça marche</Link>
          <Link href="#categories" className="hover:text-foreground transition-colors">Catégories</Link>
          <Link href="#pour-commercants" className="hover:text-foreground transition-colors">Commerçants</Link>
          <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">Connexion</Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="gradient" size="sm">
              Commencer — c'est gratuit
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-orange-100/60 blur-[120px]" />
        <div className="absolute top-40 right-10 w-72 h-72 rounded-full bg-amber-100/40 blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-red-100/30 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 mb-8 animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-orange-700">Disponible au Maroc — 22 villes</span>
          <Sparkles className="h-3.5 w-3.5 text-orange-500" />
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-8 animate-slide-up">
          Le marché qui<br />
          <span className="text-gradient">travaille pour vous</span>
        </h1>

        <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed mb-12 animate-slide-up" style={{ animationDelay: '80ms' }}>
          Publiez ce que vous cherchez. Des centaines de commerçants vous envoient leurs meilleures offres.
          Vous comparez, vous choisissez. <strong className="text-foreground">Vous économisez.</strong>
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '160ms' }}>
          <Link href="/auth/register?role=buyer">
            <Button variant="gradient" size="xl" className="group w-full sm:w-auto">
              Publier ma première demande
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/auth/register?role=merchant">
            <Button variant="premium" size="xl" className="w-full sm:w-auto">
              Je suis commerçant
            </Button>
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '240ms' }}>
          {[
            { icon: <Users className="h-4 w-4" />, label: '50 000+ utilisateurs' },
            { icon: <Store className="h-4 w-4" />, label: '8 000+ commerçants' },
            { icon: <ShoppingBag className="h-4 w-4" />, label: '200 000+ demandes' },
            { icon: <Star className="h-4 w-4 fill-amber-400 text-amber-400" />, label: '4.8/5 satisfaction' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              {icon}
              <span className="font-medium text-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Hero image / mockup */}
        <div className="mt-20 relative max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '320ms' }}>
          <div className="relative bg-white rounded-3xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden p-8">
            {/* Mock request card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Request */}
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">📱</span>
                  <Badge variant="urgent">Urgent</Badge>
                </div>
                <h3 className="font-display font-semibold text-base mb-1">iPhone 15 Pro 256GB</h3>
                <p className="text-sm text-muted-foreground mb-3">Budget : 12 000 – 14 000 DH · Casablanca</p>
                <div className="flex items-center gap-1.5 text-xs text-orange-600 font-medium">
                  <Bell className="h-3.5 w-3.5" />
                  <span>12 commerçants alertés</span>
                </div>
              </div>

              {/* Offers preview */}
              <div className="space-y-2.5 text-left">
                {[
                  { name: 'TechShop Anfa', price: '12 400 DH', delay: '2j', rating: 4.9, badge: '✅' },
                  { name: 'MobileCity', price: '12 800 DH', delay: '1j', rating: 4.7, badge: '✅' },
                  { name: 'ElectroPro', price: '13 100 DH', delay: '3j', rating: 4.5, badge: null },
                ].map((offer, i) => (
                  <div key={offer.name}
                    className={cn(
                      'flex items-center justify-between bg-white rounded-xl p-3.5 border',
                      i === 0 && 'border-green-300 ring-1 ring-green-200'
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold">{offer.name}</span>
                        {offer.badge && <span className="text-xs">{offer.badge}</span>}
                        {i === 0 && <Badge variant="success" className="text-[10px] py-0">Meilleure offre</Badge>}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span>⭐ {offer.rating}</span>
                        <span>· {offer.delay} livraison</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">{offer.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-2.5 border border-gray-100 animate-float">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span>💰</span>
              <span>1 600 DH économisés</span>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2.5 border border-gray-100 animate-float" style={{ animationDelay: '1.5s' }}>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span>⚡</span>
              <span>Réponse en 47 min</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<'buyer' | 'merchant'>('buyer')

  return (
    <section id="comment-ca-marche" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <Badge variant="orange" className="mb-4">Comment ça marche</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Simple comme bonjour
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Que vous soyez acheteur ou commerçant, Tabitus s'adapte à vous.
          </p>

          {/* Tab switcher */}
          <div className="inline-flex mt-8 bg-background rounded-2xl p-1.5 border shadow-sm">
            <button
              onClick={() => setActiveTab('buyer')}
              className={cn(
                'px-6 py-2.5 rounded-xl text-sm font-semibold transition-all',
                activeTab === 'buyer'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              👤 Acheteurs
            </button>
            <button
              onClick={() => setActiveTab('merchant')}
              className={cn(
                'px-6 py-2.5 rounded-xl text-sm font-semibold transition-all',
                activeTab === 'merchant'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              🏪 Commerçants
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {(activeTab === 'buyer' ? STEPS_BUYER : STEPS_MERCHANT).map((step, i) => (
            <div key={i} className="relative">
              <div className="bg-background rounded-3xl p-8 border shadow-premium h-full">
                <div className="text-5xl mb-6">{step.icon}</div>
                {'n' in step && (
                  <span className="text-xs font-bold text-muted-foreground/50 tracking-widest uppercase mb-2 block">
                    Étape {{(step as any).n}
                  </span>
                )}
                <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-3 z-10 text-muted-foreground/30 text-2xl">→</div>
              )}
            </div>
          ))}
        </div>

        {activeTab === 'buyer' && (
          <div className="mt-12 text-center">
            <Link href="/auth/register?role=buyer">
              <Button variant="gradient" size="lg">
                Publier ma demande maintenant
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
        {activeTab === 'merchant' && (
          <div className="mt-12 text-center">
            <Link href="/auth/register?role=merchant">
              <Button variant="premium" size="lg">
                Rejoindre comme commerçant
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function CategoriesSection() {
  return (
    <section id="categories" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <Badge variant="orange" className="mb-4">Tous les secteurs</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Tout. Absolument tout.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            De l'iPhone au mouton de l'Aïd, de la formation professionnelle au déménagement —
            Tabitus couvre tous vos besoins.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 stagger-children">
          {CATEGORIES_PREVIEW.map(cat => (
            <Link
              key={cat.slug}
              href={`/auth/register?category=${cat.slug}`}
              className="group bg-background border rounded-2xl p-5 text-center hover:border-primary/40 hover:shadow-premium-hover transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-display font-semibold text-sm mb-1">{cat.name}</h3>
              <p className="text-xs text-muted-foreground">{cat.count}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            + 60 autres catégories disponibles
          </p>
        </div>
      </div>
    </section>
  )
}

function AdvantagesSection() {
  return (
    <section className="py-24 bg-foreground text-background overflow-hidden relative">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-[200px] leading-none select-none">T</div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <Badge className="mb-6 bg-orange-500/20 text-orange-300 border-orange-500/30">
              Pour les acheteurs
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Arrêtez de chercher.<br />
              <span className="text-gradient">Laissez-les venir à vous.</span>
            </h2>
            <div className="space-y-5">
              {[
                { icon: <TrendingDown className="h-5 w-5" />, title: 'Économisez en moyenne 25%', desc: 'La concurrence entre commerçants fait baisser les prix naturellement.' },
                { icon: <Zap className="h-5 w-5" />, title: 'Réponses en moins de 2h', desc: 'Les commerçants sont alertés immédiatement et répondent rapidement.' },
                { icon: <Shield className="h-5 w-5" />, title: 'Commerçants vérifiés', desc: 'Chaque vendeur est vérifié. Votre sécurité est notre priorité.' },
                { icon: <Globe2 className="h-5 w-5" />, title: 'Livraison partout', desc: 'Des offres avec livraison à domicile dans toutes les villes.' },
              ].map(item => (
                <div key={item.title} className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-background/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="pour-commercants">
            <Badge className="mb-6 bg-white/10 text-white/80 border-white/20">
              Pour les commerçants
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Des clients.<br />
              Sans publicité.
            </h2>
            <div className="space-y-5">
              {[
                { icon: <Users className="h-5 w-5" />, title: 'Clients qualifiés', desc: 'Chaque demande est un client qui veut acheter maintenant.' },
                { icon: <MessageSquare className="h-5 w-5" />, title: 'Répondez en 30 secondes', desc: 'Interface ultra simple pour soumettre une offre rapidement.' },
                { icon: <Trophy className="h-5 w-5" />, title: 'Construisez votre réputation', desc: 'Les avis clients vous distinguent de la concurrence.' },
                { icon: <Clock className="h-5 w-5" />, title: '0 DH de commission à l\'inscription', desc: 'Commencez gratuitement, évoluez selon vos besoins.' },
              ].map(item => (
                <div key={item.title} className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-background/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <Badge variant="orange" className="mb-4">Témoignages</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Ils nous font confiance
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-background rounded-3xl p-8 border shadow-premium">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <Badge variant="success" className="text-xs">{t.saving}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <Badge variant="orange" className="mb-4">FAQ</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold">Questions fréquentes</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border rounded-2xl overflow-hidden bg-background shadow-premium">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors"
              >
                <span className="font-semibold pr-4">{faq.q}</span>
                <ChevronDown className={cn(
                  'h-5 w-5 text-muted-foreground shrink-0 transition-transform',
                  open === i && 'rotate-180'
                )} />
              </button>
              {open === i && (
                <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t pt-4 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-brand-gradient opacity-95" />
      <div className="absolute inset-0 -z-10 noise" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
        <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Prêt à économiser<br />sur vos prochains achats ?
        </h2>
        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
          Rejoignez 50 000+ utilisateurs qui laissent Tabitus faire le travail à leur place.
          Inscription gratuite, sans carte bancaire.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register?role=buyer">
            <Button size="xl" className="bg-white text-orange-600 hover:bg-white/90 shadow-xl w-full sm:w-auto font-bold">
              Je publie ma demande
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/auth/register?role=merchant">
            <Button size="xl" variant="outline" className="border-white/40 text-white hover:bg-white/10 w-full sm:w-auto">
              Je suis commerçant
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-display font-bold text-sm">T</div>
              <span className="font-display font-bold text-xl">tabitus</span>
            </div>
            <p className="text-sm text-background/50 leading-relaxed">
              La marketplace intelligente. La marketplace intelligente du Maroc et de l'Afrique.
            </p>
          </div>
          {[
            {
              title: 'Produit',
              links: ['Comment ça marche', 'Catégories', 'Pour les commerçants', 'Témoignages'],
            },
            {
              title: 'Support',
              links: ['Centre d\'aide', 'Nous contacter', 'Signaler un problème', 'Blog'],
            },
            {
              title: 'Légal',
              links: ['Mentions légales', 'Confidentialité', 'CGU', 'Cookies'],
            },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4 text-background/80">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <Link href="#" className="text-sm text-background/50 hover:text-background/80 transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-background/40">
          <p>© 2024 Tabitus. Tous droits réservés.</p>
          <div className="flex items-center gap-2">
            <span>🇲🇦</span>
            <span>Casablanca, Maroc</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Main Page ───────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main>
      <NavBar />
      <HeroSection />
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
