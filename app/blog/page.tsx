import Link from 'next/link'
import Navbar from '@/app/components/Navbar'

const ARTICLES = [
  {
    slug: 'economiser-achats-maroc',
    category: 'Guide Acheteur',
    title: 'Comment économiser sur vos achats au Maroc grâce à la marketplace inversée',
    excerpt: 'Les Marocains dépensent en moyenne 15% de trop sur leurs achats électroniques et électroménagers. Découvrez comment TABIT renverse ce rapport de force en votre faveur.',
    date: '28 mai 2025',
    readTime: '6 min',
    icon: '💡',
    color: '#C9922A',
  },
  {
    slug: 'guide-commercant-tabit-2025',
    category: 'Guide Commerçant',
    title: 'Guide complet du commerçant TABIT 2025 : développez votre CA en ligne',
    excerpt: 'Les commerçants partenaires TABIT génèrent en moyenne 23 000 MAD de revenus supplémentaires par mois. Voici comment optimiser votre profil, vos offres et votre taux d\'acceptation.',
    date: '15 mai 2025',
    readTime: '9 min',
    icon: '🏪',
    color: '#22C55E',
  },
  {
    slug: 'categories-les-plus-demandees',
    category: 'Tendances',
    title: 'Les 10 catégories les plus demandées sur TABIT en 2025',
    excerpt: 'Électroménager, smartphones, BTP, bijouterie… Quelles sont les catégories qui explosent en 2025 ? Données réelles basées sur 18 000+ transactions.',
    date: '2 mai 2025',
    readTime: '4 min',
    icon: '📊',
    color: '#6366F1',
  },
  {
    slug: 'tabit-b2b-achats-entreprise',
    category: 'B2B & Entreprises',
    title: 'TABIT B2B : révolutionner les achats d\'entreprise au Maroc',
    excerpt: 'PME, grandes entreprises et administrations publiques : comment la marketplace inversée transforme la gestion des achats corporate et réduit les coûts de 30 à 40%.',
    date: '20 avril 2025',
    readTime: '7 min',
    icon: '🏢',
    color: '#F59E0B',
  },
]

export const metadata = {
  title: 'Blog TABIT — Guides, Tendances & Conseils',
  description: 'Conseils pour acheteurs et commerçants, tendances du marché marocain, guides pratiques.',
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#0C0B09', minHeight: '100vh', paddingTop: 80 }}>
        {/* Hero */}
        <section style={{ padding: 'clamp(48px,8vw,96px) clamp(20px,5vw,80px) clamp(32px,5vw,64px)', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,146,42,0.12)', border: '1px solid rgba(201,146,42,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: 24 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#C9922A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Blog & Ressources</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(32px,6vw,56px)', fontWeight: 400, color: '#FAFAF7', lineHeight: 1.1, marginBottom: 16 }}>
            Le magazine du<br /><em style={{ color: '#C9922A' }}>commerce intelligent</em>
          </h1>
          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#8A856E', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            Guides pratiques, données de marché et stratégies pour acheteurs et commerçants du Maroc.
          </p>
        </section>

        {/* Articles grid */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,40px) 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 24 }}>
          {ARTICLES.map((a, i) => (
            <article
              key={a.slug}
              style={{
                background: '#1C1B16',
                border: '1px solid rgba(201,146,42,0.12)',
                borderRadius: 20,
                padding: 32,
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              className="card-hover card-3d"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>{a.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: a.color, textTransform: 'uppercase', letterSpacing: '0.08em', background: `${a.color}18`, padding: '3px 10px', borderRadius: 100 }}>{a.category}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: 500, color: '#F0E8D4', lineHeight: 1.35, marginBottom: 12 }}>{a.title}</h2>
              <p style={{ fontSize: 14, color: '#8A856E', lineHeight: 1.65, marginBottom: 20 }}>{a.excerpt}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 12, color: '#8A856E' }}>📅 {a.date}</span>
                  <span style={{ fontSize: 12, color: '#8A856E' }}>⏱ {a.readTime} de lecture</span>
                </div>
                <span style={{ fontSize: 13, color: '#C9922A', fontWeight: 600 }}>Lire →</span>
              </div>
            </article>
          ))}
        </section>

        {/* Newsletter CTA */}
        <section style={{ background: '#1C1B16', borderTop: '1px solid rgba(201,146,42,0.12)', padding: 'clamp(40px,6vw,64px) clamp(20px,5vw,40px)' }}>
          <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 400, color: '#F0E8D4', marginBottom: 12 }}>Ne manquez aucun article</h2>
            <p style={{ fontSize: 15, color: '#8A856E', marginBottom: 24 }}>Rejoignez 4 200+ lecteurs qui reçoivent nos guides chaque semaine.</p>
            <div style={{ display: 'flex', gap: 10, maxWidth: 440, margin: '0 auto' }}>
              <input
                type="email"
                placeholder="votre@email.ma"
                style={{ flex: 1, height: 48, borderRadius: 12, border: '1px solid rgba(201,146,42,0.25)', background: 'rgba(255,255,255,0.05)', color: '#F0E8D4', padding: '0 16px', fontSize: 14, outline: 'none' }}
              />
              <button
                style={{ height: 48, padding: '0 24px', borderRadius: 12, background: 'linear-gradient(135deg, #C9922A, #E8B84B)', color: '#0C0B09', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
                className="glow"
              >
                S'abonner
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
