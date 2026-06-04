import Navbar from '@/app/components/Navbar'
import Link from 'next/link'

export const metadata = {
  title: 'Tarifs TABIT — Gratuit pour les acheteurs, 5% pour les commerçants',
  description: 'TABIT est 100% gratuit pour les acheteurs. Les commerçants paient uniquement 5% de commission sur chaque vente acceptée.',
}

const PRICING = [
  {
    name: 'Acheteur',
    price: '0',
    unit: 'MAD',
    tag: 'Toujours gratuit',
    color: '#22C55E',
    features: [
      '✅ Demandes illimitées',
      '✅ Réception d\'offres illimitées',
      '✅ Chat sécurisé avec les commerçants',
      '✅ Garantie satisfaction TABIT',
      '✅ Support 7j/7',
      '✅ Sans carte bancaire requise',
    ],
    cta: 'Déposer ma demande',
    href: '/auth/register',
    highlight: false,
  },
  {
    name: 'Commerçant',
    price: '5',
    unit: '% par vente',
    tag: 'Commission unique',
    color: '#C9922A',
    features: [
      '✅ Accès aux demandes en temps réel',
      '✅ Offres illimitées',
      '✅ Chat avec les acheteurs',
      '✅ Badge Vérifié TABIT',
      '✅ Analytics & statistiques',
      '✅ Pas d\'abonnement mensuel',
      '✅ Commission prélevée uniquement sur ventes acceptées',
    ],
    cta: 'Devenir partenaire',
    href: '/auth/register?type=merchant',
    highlight: true,
  },
]

const B2B_PLANS = [
  { name: 'PME', price: '2 500', unit: 'MAD/mois', features: ['Jusqu\'à 5 acheteurs', 'Reporting mensuel', 'Account manager dédié', 'Commission 3% sur ventes'] },
  { name: 'Entreprise', price: 'Sur devis', unit: '', features: ['Acheteurs illimités', 'API access', 'Intégration ERP/SAP', 'Commission négociée', 'SLA garanti 99.9%'] },
]

const PRICING_FAQ = [
  { q: 'Y a-t-il des frais cachés pour les acheteurs ?', a: 'Non, absolument aucun. TABIT est 100% gratuit pour les acheteurs, sans inscription payante ni frais de service cachés.' },
  { q: 'Quand la commission est-elle prélevée ?', a: 'La commission de 5% est prélevée uniquement lorsqu\'un acheteur accepte votre offre et confirme la transaction. Aucune commission sur les offres refusées.' },
  { q: 'Comment puis-je m\'inscrire en tant que commerçant B2B ?', a: 'Contactez notre équipe à b2b@tabit.ma ou via le formulaire ci-dessous. Notre équipe vous rappelle sous 24h.' },
  { q: 'Puis-je tester TABIT sans m\'engager ?', a: 'Oui ! Créez votre compte commerçant gratuitement, consultez les demandes et envoyez vos premières offres. Vous ne payez que quand vous vendez.' },
]

export default function TarifsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#0C0B09', minHeight: '100vh', paddingTop: 80 }}>
        {/* Hero */}
        <section style={{ padding: 'clamp(48px,8vw,80px) clamp(20px,5vw,40px)', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,146,42,0.12)', border: '1px solid rgba(201,146,42,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: 24 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#C9922A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Transparence totale</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(32px,6vw,56px)', fontWeight: 400, color: '#FAFAF7', lineHeight: 1.1, marginBottom: 16 }}>
            Simple. Transparent.<br /><em style={{ color: '#C9922A' }}>Pas de surprises.</em>
          </h1>
          <p style={{ fontSize: 16, color: '#8A856E', maxWidth: 520, margin: '0 auto' }}>Gratuit pour les acheteurs. Commission uniquement sur les ventes réalisées pour les commerçants.</p>
        </section>

        {/* Pricing cards */}
        <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(20px,5vw,40px) 56px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {PRICING.map(plan => (
            <div
              key={plan.name}
              style={{
                background: plan.highlight ? 'linear-gradient(145deg, #1C1B16, #2A2519)' : '#1C1B16',
                border: `1.5px solid ${plan.highlight ? 'rgba(201,146,42,0.5)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 22,
                padding: 32,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {plan.highlight && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #C9922A, transparent)' }} />
              )}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${plan.color}18`, border: `1px solid ${plan.color}40`, borderRadius: 100, padding: '3px 10px', marginBottom: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: plan.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{plan.tag}</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#8A856E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{plan.name}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                <span style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 56, fontWeight: 700, color: plan.color, lineHeight: 1 }}>{plan.price}</span>
                <span style={{ fontSize: 16, color: '#8A856E' }}>{plan.unit}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {plan.features.map(f => (
                  <p key={f} style={{ fontSize: 14, color: '#C4BCA8', lineHeight: 1.4 }}>{f}</p>
                ))}
              </div>
              <Link href={plan.href}>
                <div
                  style={{
                    display: 'block', textAlign: 'center', padding: '14px', borderRadius: 12,
                    background: plan.highlight ? 'linear-gradient(135deg, #C9922A, #E8B84B)' : 'rgba(255,255,255,0.06)',
                    border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.12)',
                    color: plan.highlight ? '#0C0B09' : '#F0E8D4',
                    fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  }}
                  className={plan.highlight ? 'glow' : ''}
                >
                  {plan.cta} →
                </div>
              </Link>
            </div>
          ))}
        </section>

        {/* B2B section */}
        <section style={{ background: '#1C1B16', borderTop: '1px solid rgba(201,146,42,0.1)', borderBottom: '1px solid rgba(201,146,42,0.1)', padding: 'clamp(40px,6vw,64px) clamp(20px,5vw,40px)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(24px,4vw,38px)', fontWeight: 400, color: '#F0E8D4', textAlign: 'center', marginBottom: 8 }}>Solutions B2B & Entreprises</h2>
            <p style={{ fontSize: 15, color: '#8A856E', textAlign: 'center', marginBottom: 36 }}>Des tarifs adaptés aux organisations qui font des achats en volume</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              {B2B_PLANS.map(p => (
                <div key={p.name} style={{ background: '#0C0B09', border: '1px solid rgba(201,146,42,0.15)', borderRadius: 18, padding: 28 }}>
                  <p style={{ fontSize: 20, fontWeight: 700, color: '#C9922A', fontFamily: 'var(--font-playfair, Georgia)', marginBottom: 4 }}>{p.name}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
                    <span style={{ fontSize: 28, fontWeight: 700, color: '#F0E8D4' }}>{p.price}</span>
                    {p.unit && <span style={{ fontSize: 13, color: '#8A856E' }}>{p.unit}</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {p.features.map(f => <p key={f} style={{ fontSize: 13, color: '#8A856E' }}>✓ {f}</p>)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <a href="mailto:b2b@tabit.ma" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 12, border: '1.5px solid rgba(201,146,42,0.4)', color: '#C9922A', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                Contacter l'équipe B2B →
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px,6vw,64px) clamp(20px,5vw,40px)' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 400, color: '#F0E8D4', textAlign: 'center', marginBottom: 32 }}>Questions sur les tarifs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PRICING_FAQ.map(f => (
              <details key={f.q} style={{ background: '#1C1B16', border: '1px solid rgba(201,146,42,0.12)', borderRadius: 14 }}>
                <summary style={{ padding: '16px 20px', fontSize: 14, fontWeight: 600, color: '#F0E8D4', cursor: 'pointer', listStyle: 'none' }}>{f.q}</summary>
                <p style={{ padding: '0 20px 16px', fontSize: 14, color: '#8A856E', lineHeight: 1.65, borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 0 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
