import Navbar from '@/app/components/Navbar'
import Link from 'next/link'

export const metadata = {
  title: 'À propos de TABIT — La première marketplace inversée du Maroc',
  description: 'Découvrez la mission, l\'équipe et l\'histoire de TABIT, la startup marocaine qui révolutionne le commerce.',
}

const TEAM = [
  { name: 'Youssef El Mansouri', role: 'CEO & Co-fondateur', city: 'Casablanca', emoji: '👨‍💼', bio: 'Ex-McKinsey Maroc. 12 ans dans le conseil en stratégie digitale pour les distributeurs marocains.' },
  { name: 'Fatima-Zahra Benali', role: 'CTO & Co-fondatrice', city: 'Casablanca', emoji: '👩‍💻', bio: 'Ancienne Lead Engineer chez OCP Digital. Expertise Supabase, Next.js, systèmes temps réel.' },
  { name: 'Karim Tahiri', role: 'Head of Growth', city: 'Rabat', emoji: '📈', bio: 'Ex-Jumia Maroc & Glovo. 8 ans de croissance marketplace en Afrique du Nord.' },
  { name: 'Sofia Idrissi', role: 'Head of Merchant Success', city: 'Marrakech', emoji: '🤝', bio: 'Réseau de 800+ commerçants partenaires. Ancienne directrice commerciale dans la grande distribution.' },
  { name: 'Omar Cherkaoui', role: 'Lead Designer', city: 'Casablanca', emoji: '🎨', bio: 'Formé à ESAD Strasbourg. A designé les interfaces de 3 unicorns africains avant de rejoindre TABIT.' },
  { name: 'Nadia Benhaddou', role: 'CFO', city: 'Casablanca', emoji: '💼', bio: 'Ex-Credit du Maroc & Cabinet Deloitte. Spécialiste fintech et réglementation financière marocaine.' },
]

const TIMELINE = [
  { year: '2022', title: 'L\'idée', desc: 'Youssef cherche un lave-linge. Il contacte 12 magasins, attend 3 jours. La frustration devient une startup.' },
  { year: '2023 Q1', title: 'Premier prototype', desc: 'Équipe de 3 personnes, 50 commerçants pilotes à Casablanca, 200 transactions les 30 premiers jours.' },
  { year: '2023 Q3', title: 'Seed round', desc: 'Levée de 4 M MAD auprès d\'Africa Internet Group et de business angels marocains.' },
  { year: '2024 Q1', title: 'Expansion nationale', desc: '15 villes, 800 commerçants vérifiés, 5 000 transactions/mois. Lancement du B2B.' },
  { year: '2024 Q4', title: 'Série A', desc: '18 M MAD levés. Expansion B2G (appels d\'offres publics). 2 400 commerçants actifs.' },
  { year: '2025', title: 'Aujourd\'hui', desc: '30 villes, 18 000+ transactions, 98% satisfaction acheteurs. Préparation de l\'expansion Afrique de l\'Ouest.' },
]

const PRESS = [
  { name: 'L\'Économiste', quote: '"TABIT redéfinit le commerce de détail marocain"', date: 'Mars 2024' },
  { name: 'TechTrends Maroc', quote: '"La startup à surveiller en 2024"', date: 'Fév. 2024' },
  { name: 'Médias 24', quote: '"Une révolution silencieuse dans le retail marocain"', date: 'Janv. 2024' },
  { name: 'La Vie Éco', quote: '"Le modèle marketplace inversée s\'impose au Maroc"', date: 'Nov. 2023' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#0C0B09', minHeight: '100vh', paddingTop: 80 }}>
        {/* Hero */}
        <section style={{ padding: 'clamp(48px,8vw,96px) clamp(20px,5vw,40px)', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,146,42,0.12)', border: '1px solid rgba(201,146,42,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: 28 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#C9922A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>🇲🇦 Made in Morocco</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(32px,6vw,60px)', fontWeight: 400, color: '#FAFAF7', lineHeight: 1.1, marginBottom: 20 }}>
            Nous réinventons<br />le commerce <em style={{ color: '#C9922A' }}>marocain</em>
          </h1>
          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#8A856E', lineHeight: 1.75, maxWidth: 640, margin: '0 auto 40px' }}>
            TABIT est né d'une frustration simple : pourquoi les acheteurs marocains doivent-ils courir après les commerçants ? Nous avons inversé le modèle. Maintenant, c'est le marché qui travaille pour vous.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {[['2022', 'Fondée à Casablanca'], ['2 400+', 'Commerçants vérifiés'], ['18 000+', 'Transactions'], ['98%', 'Satisfaction']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 700, color: '#C9922A', lineHeight: 1 }}>{n}</p>
                <p style={{ fontSize: 12, color: '#8A856E', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section style={{ background: '#1C1B16', borderTop: '1px solid rgba(201,146,42,0.1)', padding: 'clamp(48px,7vw,80px) clamp(20px,5vw,40px)' }}>
          <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#C9922A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Notre mission</p>
            <blockquote style={{ fontFamily: 'var(--font-playfair, Georgia)', fontStyle: 'italic', fontSize: 'clamp(22px,4vw,36px)', color: '#F0E8D4', lineHeight: 1.4, marginBottom: 24 }}>
              "Démocratiser l'accès au meilleur prix pour chaque Marocain, tout en offrant aux commerçants locaux une plateforme digitale de premier rang."
            </blockquote>
            <p style={{ fontSize: 14, color: '#8A856E' }}>— Youssef El Mansouri, CEO & Co-fondateur</p>
          </div>
        </section>

        {/* Timeline */}
        <section style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(48px,7vw,80px) clamp(20px,5vw,40px)' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(24px,4vw,38px)', fontWeight: 400, color: '#F0E8D4', textAlign: 'center', marginBottom: 44 }}>Notre histoire</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {TIMELINE.map((t, i) => (
              <div key={t.year} style={{ display: 'grid', gridTemplateColumns: '100px 1px 1fr', gap: '0 20px', paddingBottom: i < TIMELINE.length - 1 ? 32 : 0 }}>
                <div style={{ textAlign: 'right', paddingTop: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#C9922A' }}>{t.year}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#C9922A', flexShrink: 0, marginTop: 6 }} />
                  {i < TIMELINE.length - 1 && <div style={{ flex: 1, width: 1, background: 'rgba(201,146,42,0.2)', marginTop: 4 }} />}
                </div>
                <div style={{ paddingTop: 2 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#F0E8D4', marginBottom: 4 }}>{t.title}</p>
                  <p style={{ fontSize: 14, color: '#8A856E', lineHeight: 1.6 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section style={{ background: '#1C1B16', borderTop: '1px solid rgba(201,146,42,0.08)', padding: 'clamp(48px,7vw,80px) clamp(20px,5vw,40px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(24px,4vw,38px)', fontWeight: 400, color: '#F0E8D4', textAlign: 'center', marginBottom: 44 }}>L'équipe fondatrice</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {TEAM.map(m => (
                <div key={m.name} style={{ background: '#0C0B09', border: '1px solid rgba(201,146,42,0.1)', borderRadius: 18, padding: 24 }}>
                  <div style={{ fontSize: 40, marginBottom: 14 }}>{m.emoji}</div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#F0E8D4', marginBottom: 2 }}>{m.name}</p>
                  <p style={{ fontSize: 13, color: '#C9922A', fontWeight: 600, marginBottom: 4 }}>{m.role}</p>
                  <p style={{ fontSize: 12, color: '#8A856E', marginBottom: 10 }}>📍 {m.city}</p>
                  <p style={{ fontSize: 13, color: '#8A856E', lineHeight: 1.6 }}>{m.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Press */}
        <section style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(48px,7vw,72px) clamp(20px,5vw,40px)' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 400, color: '#F0E8D4', textAlign: 'center', marginBottom: 36 }}>Ils parlent de nous</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {PRESS.map(p => (
              <div key={p.name} style={{ background: '#1C1B16', border: '1px solid rgba(201,146,42,0.1)', borderRadius: 14, padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#C9922A', marginBottom: 8 }}>{p.name}</p>
                <p style={{ fontSize: 13, fontStyle: 'italic', color: '#8A856E', lineHeight: 1.5, marginBottom: 8 }}>{p.quote}</p>
                <p style={{ fontSize: 11, color: '#8A856E60' }}>{p.date}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#1C1B16', borderTop: '1px solid rgba(201,146,42,0.1)', padding: 'clamp(48px,7vw,72px) clamp(20px,5vw,40px)', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 400, color: '#F0E8D4', marginBottom: 12 }}>Rejoignez le mouvement</h2>
          <p style={{ fontSize: 15, color: '#8A856E', marginBottom: 28 }}>Acheteurs, commerçants, entreprises : TABIT transforme le commerce marocain pour tout le monde.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register">
              <div style={{ padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #C9922A, #E8B84B)', color: '#0C0B09', fontWeight: 700, fontSize: 15, cursor: 'pointer' }} className="glow">
                Commencer gratuitement →
              </div>
            </Link>
            <a href="mailto:contact@tabit.ma" style={{ padding: '14px 32px', borderRadius: 12, border: '1.5px solid rgba(201,146,42,0.3)', color: '#C9922A', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
              Nous contacter
            </a>
          </div>
        </section>
      </main>
    </>
  )
}
