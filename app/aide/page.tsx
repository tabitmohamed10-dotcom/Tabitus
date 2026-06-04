'use client'
import { useState } from 'react'
import Navbar from '@/app/components/Navbar'

const FAQS = [
  { q: 'Comment fonctionne TABIT ?', cat: 'Général', a: 'TABIT est une marketplace inversée : vous publiez votre besoin (produit, service, quantité, budget), et les commerçants vérifiés vous envoient leurs meilleures offres. Vous choisissez l\'offre qui vous convient et vous payez uniquement après accord.' },
  { q: 'Est-ce gratuit pour les acheteurs ?', cat: 'Tarifs', a: 'Oui, totalement gratuit et sans engagement pour les acheteurs. Publiez autant de demandes que vous voulez. Les commerçants paient uniquement une commission de 5% sur chaque vente acceptée.' },
  { q: 'Comment les commerçants sont-ils vérifiés ?', cat: 'Confiance', a: 'Chaque commerçant TABIT passe par une vérification manuelle : patente, RC, ICE, CIN du gérant. Seuls les commerçants légalement enregistrés et actifs reçoivent le badge "Vérifié TABIT".' },
  { q: 'Que faire si je reçois une offre non conforme ?', cat: 'Litiges', a: 'Contactez notre équipe support dans les 48h suivant la transaction. TABIT dispose d\'un fonds de garantie pour les litiges. Votre argent est protégé jusqu\'à confirmation de livraison.' },
  { q: 'Puis-je négocier avec un commerçant ?', cat: 'Général', a: 'Oui ! Une fois qu\'une offre est acceptée, un chat sécurisé s\'ouvre entre vous et le commerçant pour finaliser les détails. TABIT masque automatiquement les coordonnées pour protéger la transaction.' },
  { q: 'Comment devenir commerçant partenaire ?', cat: 'Commerçants', a: 'Inscrivez-vous sur TABIT, remplissez votre profil boutique et soumettez vos documents légaux (patente, RC, ICE). Notre équipe valide votre compte en 24-48h ouvrées.' },
  { q: 'TABIT est-il disponible partout au Maroc ?', cat: 'Général', a: 'TABIT couvre 30+ villes marocaines. Nous ajoutons de nouvelles villes chaque mois. La livraison nationale est également disponible pour certaines catégories.' },
  { q: 'Comment est sécurisé le paiement ?', cat: 'Paiement', a: 'TABIT utilise le protocole SSL 256-bit et est conforme aux normes PCI-DSS. Les paiements par carte passent par CMI, le centre monétique interbancaire marocain.' },
]

const GUIDES = [
  { title: 'Guide de démarrage rapide', desc: 'Votre première demande en 3 minutes', icon: '🚀', pages: '8 pages' },
  { title: 'Manuel du commerçant', desc: 'Optimiser votre profil et vos offres', icon: '🏪', pages: '24 pages' },
  { title: 'Guide B2B entreprises', desc: 'Achats corporate et appels d\'offres', icon: '🏢', pages: '16 pages' },
  { title: 'Politique de sécurité', desc: 'Protection des données & CNDP', icon: '🔒', pages: '12 pages' },
]

export default function AidePage() {
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const filtered = FAQS.filter(f =>
    search.length < 2 ||
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <main style={{ background: '#FAFAF7', minHeight: '100vh', paddingTop: 80 }}>
        {/* Hero */}
        <section style={{ background: '#0C0B09', padding: 'clamp(40px,7vw,80px) clamp(20px,5vw,40px)', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 400, color: '#FAFAF7', marginBottom: 12 }}>
            Centre d'aide TABIT
          </h1>
          <p style={{ fontSize: 16, color: '#8A856E', marginBottom: 28 }}>Trouvez une réponse à votre question en quelques secondes</p>
          <div style={{ maxWidth: 520, margin: '0 auto', position: 'relative' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une question... (ex: paiement, remboursement, livraison)"
              style={{ width: '100%', height: 52, borderRadius: 14, border: '1.5px solid rgba(201,146,42,0.3)', background: 'rgba(255,255,255,0.06)', color: '#F0E8D4', padding: '0 52px 0 18px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
            <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 20 }}>🔍</span>
          </div>
        </section>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(20px,5vw,40px)' }}>
          {/* FAQ */}
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 500, color: '#0C0B09', marginBottom: 24 }}>Questions fréquentes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 56 }}>
            {filtered.map((f, i) => (
              <details
                key={i}
                style={{ background: '#FFFFFF', border: '1px solid #E8E0CC', borderRadius: 14, overflow: 'hidden' }}
              >
                <summary style={{ padding: '18px 22px', fontSize: 15, fontWeight: 600, color: '#0C0B09', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <span>{f.q}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#C9922A', background: 'rgba(201,146,42,0.1)', padding: '2px 8px', borderRadius: 100, whiteSpace: 'nowrap', flexShrink: 0 }}>{f.cat}</span>
                </summary>
                <p style={{ padding: '0 22px 18px', fontSize: 14, color: '#8A856E', lineHeight: 1.7, borderTop: '1px solid #F5F2EA', marginTop: 0 }}>{f.a}</p>
              </details>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: '#8A856E' }}>
                <p style={{ fontSize: 32, marginBottom: 8 }}>🤔</p>
                <p>Aucun résultat pour « {search} »</p>
                <p style={{ fontSize: 13, marginTop: 8 }}>Contactez-nous via le formulaire ci-dessous</p>
              </div>
            )}
          </div>

          {/* Guides */}
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 500, color: '#0C0B09', marginBottom: 20 }}>Guides PDF à télécharger</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 56 }}>
            {GUIDES.map(g => (
              <div
                key={g.title}
                style={{ background: '#FFFFFF', border: '1px solid #E8E0CC', borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'border-color 0.2s' }}
                className="card-hover"
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{g.icon}</div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0C0B09', marginBottom: 4 }}>{g.title}</p>
                <p style={{ fontSize: 12, color: '#8A856E', marginBottom: 12 }}>{g.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: '#8A856E' }}>📄 {g.pages}</span>
                  <button style={{ fontSize: 12, color: '#C9922A', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Télécharger ↓</button>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 500, color: '#0C0B09', marginBottom: 8 }}>Contactez-nous</h2>
              <p style={{ fontSize: 14, color: '#8A856E', marginBottom: 24, lineHeight: 1.6 }}>Notre équipe répond en moins de 2h aux heures ouvrables (Lun–Ven, 9h–18h).</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: '📧', label: 'Email', value: 'support@tabit.ma' },
                  { icon: '📱', label: 'WhatsApp', value: '+212 6 00 00 00 00' },
                  { icon: '📍', label: 'Adresse', value: 'Casablanca, Maroc — Twin Center' },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 20 }}>{c.icon}</span>
                    <div>
                      <p style={{ fontSize: 11, color: '#8A856E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 1 }}>{c.label}</p>
                      <p style={{ fontSize: 14, color: '#0C0B09', fontWeight: 600 }}>{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {sent ? (
                <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 16, padding: 32, textAlign: 'center' }}>
                  <p style={{ fontSize: 36, marginBottom: 12 }}>✅</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#065F46' }}>Message envoyé !</p>
                  <p style={{ fontSize: 14, color: '#065F46', marginTop: 6 }}>Nous vous répondrons dans les 2h.</p>
                </div>
              ) : (
                <div style={{ background: '#FFFFFF', border: '1px solid #E8E0CC', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0C0B09', marginBottom: 4 }}>Envoyer un message</h3>
                  {[
                    { placeholder: 'Votre nom', value: name, set: setName, type: 'text' },
                    { placeholder: 'Votre email', value: email, set: setEmail, type: 'email' },
                  ].map((f, i) => (
                    <input
                      key={i}
                      type={f.type}
                      placeholder={f.placeholder}
                      value={f.value}
                      onChange={e => f.set(e.target.value)}
                      style={{ height: 44, borderRadius: 10, border: '1px solid #E8E0CC', background: '#FAFAF7', padding: '0 14px', fontSize: 14, color: '#0C0B09', outline: 'none', boxSizing: 'border-box' }}
                    />
                  ))}
                  <textarea
                    placeholder="Décrivez votre problème ou question..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={4}
                    style={{ borderRadius: 10, border: '1px solid #E8E0CC', background: '#FAFAF7', padding: '10px 14px', fontSize: 14, color: '#0C0B09', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                  <button
                    onClick={() => { if (name && email && message) setSent(true) }}
                    style={{ height: 46, borderRadius: 12, background: 'linear-gradient(135deg, #C9922A, #E8B84B)', color: '#0C0B09', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}
                    className="glow"
                  >
                    Envoyer le message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
