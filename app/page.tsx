import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fff' }}>
      <nav style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          tabitus
        </span>
        <Link href="/auth/register" style={{
          background: '#f97316',
          color: '#fff',
          padding: '0.5rem 1.2rem',
          borderRadius: '0.75rem',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Commencer
        </Link>
      </nav>

      <section style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Le marché qui travaille pour vous
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          Publiez votre besoin. Recevez les meilleures offres. Économisez.
        </p>
        <Link href="/auth/register" style={{
          background: '#f97316',
          color: '#fff',
          padding: '1rem 2rem',
          borderRadius: '1rem',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}>
          Publier ma demande →
        </Link>

        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', color: '#666' }}>
          <span>👥 50 000+ utilisateurs</span>
          <span>🏪 8 000+ commerçants</span>
          <span>📦 200 000+ demandes</span>
          <span>⭐ 4.8/5 satisfaction</span>
        </div>
      </section>
    </main>
  )
}
