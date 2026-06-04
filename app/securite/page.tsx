'use client'
import { useState } from 'react'
import Navbar from '@/app/components/Navbar'

export default function SecuritePage() {
  const [delEmail, setDelEmail] = useState('')
  const [delSent, setDelSent] = useState(false)

  return (
    <>
      <Navbar />
      <main style={{ background: '#0C0B09', minHeight: '100vh', paddingTop: 80 }}>
        {/* Hero */}
        <section style={{ padding: 'clamp(48px,8vw,80px) clamp(20px,5vw,40px)', textAlign: 'center', maxWidth: 780, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,146,42,0.12)', border: '1px solid rgba(201,146,42,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: 24 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#C9922A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>🔒 Sécurité & Confidentialité</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(30px,5vw,52px)', fontWeight: 400, color: '#FAFAF7', lineHeight: 1.15, marginBottom: 16 }}>
            Votre sécurité,<br /><em style={{ color: '#C9922A' }}>notre priorité absolue</em>
          </h1>
          <p style={{ fontSize: 16, color: '#8A856E', lineHeight: 1.7 }}>TABIT est conforme au droit marocain sur la protection des données personnelles (Loi 09-08) et aux standards de sécurité internationaux.</p>
        </section>

        {/* Security badges */}
        <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 clamp(20px,5vw,40px) 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { icon: '🔐', title: 'SSL 256-bit', desc: 'Toutes les communications sont chiffrées via TLS 1.3' },
              { icon: '💳', title: 'PCI-DSS', desc: 'Paiements sécurisés via CMI, certifiés PCI Level 1' },
              { icon: '🇲🇦', title: 'CNDP Maroc', desc: 'Conforme à la Loi 09-08 sur la protection des données' },
              { icon: '☁️', title: 'Supabase Cloud', desc: 'Données hébergées en UE, accès strict par RLS PostgreSQL' },
            ].map(b => (
              <div key={b.title} style={{ background: '#1C1B16', border: '1px solid rgba(201,146,42,0.15)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{b.icon}</div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#F0E8D4', marginBottom: 6 }}>{b.title}</p>
                <p style={{ fontSize: 13, color: '#8A856E', lineHeight: 1.5 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy policy */}
        <section style={{ maxWidth: 820, margin: '0 auto', padding: '0 clamp(20px,5vw,40px) 48px' }}>
          <div style={{ background: '#1C1B16', border: '1px solid rgba(201,146,42,0.12)', borderRadius: 20, padding: 'clamp(24px,4vw,40px)' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 500, color: '#F0E8D4', marginBottom: 24 }}>Politique de confidentialité</h2>
            {[
              {
                title: '1. Données collectées',
                body: 'TABIT collecte uniquement les données nécessaires au fonctionnement du service : nom, email, téléphone, historique des transactions. Aucune donnée n\'est vendue à des tiers. Les données biométriques et sensibles ne sont jamais collectées.',
              },
              {
                title: '2. Utilisation des données',
                body: 'Vos données sont utilisées exclusivement pour : (1) gérer votre compte et vos transactions, (2) améliorer nos algorithmes de matching, (3) vous envoyer des notifications liées à vos demandes/offres. Vous pouvez à tout moment refuser les communications marketing.',
              },
              {
                title: '3. Partage avec les commerçants',
                body: 'Votre nom complet et coordonnées ne sont partagés avec un commerçant qu\'après acceptation d\'une offre. Avant cela, votre identité reste anonyme. Le chat TABIT masque automatiquement tout numéro ou email échangé dans les messages.',
              },
              {
                title: '4. Conservation des données',
                body: 'Vos données sont conservées pendant la durée de votre compte actif + 3 ans après désactivation (exigences légales marocaines). Les données de transaction sont conservées 10 ans conformément au code de commerce.',
              },
              {
                title: '5. Vos droits (Loi 09-08)',
                body: 'Conformément à la Loi 09-08, vous disposez d\'un droit d\'accès, de rectification, de suppression et d\'opposition. Exercez vos droits à tout moment via le formulaire ci-dessous ou par email à privacy@tabit.ma.',
              },
            ].map(s => (
              <div key={s.title} style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#C9922A', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#8A856E', lineHeight: 1.7 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CNDP */}
        <section style={{ maxWidth: 820, margin: '0 auto', padding: '0 clamp(20px,5vw,40px) 48px' }}>
          <div style={{ background: 'rgba(201,146,42,0.06)', border: '1px solid rgba(201,146,42,0.2)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#C9922A', marginBottom: 8 }}>🏛 Conformité CNDP</h3>
            <p style={{ fontSize: 14, color: '#8A856E', lineHeight: 1.7 }}>
              TABIT SARL est déclarée auprès de la Commission Nationale de contrôle de la Protection des Données à caractère Personnel (CNDP) du Royaume du Maroc, conformément à la Loi n°09-08. Numéro de déclaration : <strong style={{ color: '#F0E8D4' }}>CNDP-2024-XXXXX</strong>.
            </p>
          </div>
        </section>

        {/* Data deletion */}
        <section style={{ maxWidth: 820, margin: '0 auto', padding: '0 clamp(20px,5vw,40px) 80px' }}>
          <div style={{ background: '#1C1B16', border: '1px solid rgba(201,146,42,0.12)', borderRadius: 20, padding: 'clamp(24px,4vw,36px)' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 500, color: '#F0E8D4', marginBottom: 8 }}>Demande de suppression de données</h2>
            <p style={{ fontSize: 14, color: '#8A856E', marginBottom: 20, lineHeight: 1.6 }}>
              Conformément à l'article 7 de la Loi 09-08, vous pouvez demander la suppression de vos données personnelles. Traitement sous 30 jours ouvrables.
            </p>
            {delSent ? (
              <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#065F46' }}>✅ Demande enregistrée</p>
                <p style={{ fontSize: 13, color: '#065F46', marginTop: 6 }}>Nous traiterons votre demande dans les 30 jours et vous enverrons une confirmation.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="email"
                  placeholder="Email lié à votre compte TABIT"
                  value={delEmail}
                  onChange={e => setDelEmail(e.target.value)}
                  style={{ flex: 1, height: 46, borderRadius: 10, border: '1px solid rgba(201,146,42,0.25)', background: 'rgba(255,255,255,0.05)', color: '#F0E8D4', padding: '0 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
                <button
                  onClick={() => { if (delEmail) setDelSent(true) }}
                  style={{ height: 46, padding: '0 20px', borderRadius: 10, background: '#1C1B16', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Demander la suppression
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
