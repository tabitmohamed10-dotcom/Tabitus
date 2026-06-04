'use client'

import { useState, useEffect, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Mock data that matches the listing page
const MOCK_DETAIL: Record<string, any> = {
  '1': { id: '1', title: 'iPhone 15 Pro 256GB — Titane naturel, parfait état', price: 12500, city: 'Casablanca', condition: 'occasion', category_slug: 'smartphones', thumbnail_url: null, images: [], views_count: 342, favorites_count: 28, price_negotiable: true, verified_seller: false, description: "iPhone 15 Pro 256GB couleur Titane naturel. Acheté en décembre 2023, utilisé avec soin pendant 8 mois. Toujours sous coque depuis le premier jour. Aucune rayure visible. Batterie à 96%. Face ID parfait.\n\nInclus : chargeur original, câble USB-C, boîte complète, 2 coques de protection.\n\nRaison de vente : passage au 16 Pro.\n\nRemise en main propre préférée à Casablanca, Maarif ou Casa Voyageurs.", contact_method: 'both', phone: null, seller: { id: 'u1', full_name: 'Khalid Amrani', avatar_url: null, role: 'buyer', city: 'Casablanca', created_at: '2023-01-15T00:00:00Z' }, created_at: new Date(Date.now() - 1000*60*30).toISOString(), featured: true },
  '2': { id: '2', title: 'MacBook Air M2 — 8Go/256Go, chargeur inclus', price: 11800, city: 'Rabat', condition: 'occasion', category_slug: 'informatique', thumbnail_url: null, images: [], views_count: 215, favorites_count: 19, price_negotiable: false, description: "MacBook Air 13\" M2, 8Go RAM, 256Go SSD, couleur Midnight. En parfait état de fonctionnement. Utilisé principalement pour la bureautique et navigation web. Aucune bosse, aucune rayure sur le châssis.\n\nBatterie cycles : 41 cycles (comme neuf). macOS Sonoma installé et mis à jour.\n\nInclus : chargeur MagSafe 67W original, housse de transport. Facture disponible.", contact_method: 'chat', phone: null, verified_seller: true, seller: { id: 'u2', full_name: 'Imane El Fassi', avatar_url: null, role: 'merchant', city: 'Rabat', created_at: '2022-06-10T00:00:00Z' }, created_at: new Date(Date.now() - 1000*60*90).toISOString(), featured: false },
}

const CONDITION_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  neuf:           { label: 'Neuf',           bg: '#dcfce7', color: '#15803d' },
  'tres-bon-etat':{ label: 'Très bon état',  bg: '#dbeafe', color: '#1d4ed8' },
  'bon-etat':     { label: 'Bon état',       bg: '#e0f2fe', color: '#0369a1' },
  occasion:       { label: 'Occasion',       bg: '#fef3c7', color: '#b45309' },
  reconditionne:  { label: 'Reconditionné',  bg: '#f3e8ff', color: '#7e22ce' },
}

const SIMILAR_MOCK = [
  { id: '9', title: 'Drone DJI Mini 3 Pro + 2 batteries', price: 3200, city: 'Rabat', condition: 'occasion', thumbnail_url: null, category_slug: 'iot' },
  { id: '11', title: 'Imprimante 3D Bambu Lab P1S', price: 7800, city: 'Casablanca', condition: 'occasion', thumbnail_url: null, category_slug: 'informatique' },
  { id: '3', title: 'Samsung QLED 65" 4K — neuf déballé', price: 8400, city: 'Casablanca', condition: 'neuf', thumbnail_url: null, category_slug: 'tv-audio' },
]

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'À l\'instant'
  if (diff < 3600) return `Il y a ${Math.floor(diff/60)} min`
  if (diff < 86400) return `Il y a ${Math.floor(diff/3600)} h`
  return `Il y a ${Math.floor(diff/86400)} jours`
}

function formatPrice(p: number) {
  return new Intl.NumberFormat('fr-MA').format(p) + ' MAD'
}

// ─── Counter-offer modal ─────────────────────────────────────────────────────
function OfferModal({ listing, onClose }: { listing: any; onClose: () => void }) {
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(12,11,9,0.65)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        style={{ background: '#FAFAF7', borderRadius: 20, padding: 'clamp(24px,4vw,32px)', width: '100%', maxWidth: 460 }}
      >
        {sent ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 22, color: '#0C0B09', marginBottom: 8 }}>Offre envoyée !</h3>
            <p style={{ color: '#8A856E', fontSize: 14, marginBottom: 24 }}>Le vendeur a été notifié. Il vous répondra via le chat TABIT.</p>
            <motion.button onClick={onClose} style={{ padding: '12px 28px', borderRadius: 10, background: 'linear-gradient(135deg, #C9922A, #E8B84B)', color: '#0C0B09', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', minHeight: 44 }} whileHover={{ scale: 1.04 }}>
              Fermer
            </motion.button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, color: '#0C0B09', margin: 0 }}>Faire une offre</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#8A856E', minHeight: 44, minWidth: 44 }}>✕</button>
            </div>
            <div style={{ padding: '12px 16px', borderRadius: 10, background: '#F5F2EA', border: '1px solid #E8E0CC', marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0C0B09', marginBottom: 4 }}>{listing.title}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#C9922A' }}>{formatPrice(listing.price)}</div>
            </div>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#8A856E', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Votre offre (MAD) *
                </label>
                <div style={{ position: 'relative' }}>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min={1} placeholder={String(Math.round(listing.price * 0.9))} style={{ width: '100%', padding: '12px 56px 12px 14px', borderRadius: 10, border: '1px solid #E8E0CC', background: '#fff', fontSize: 16, fontWeight: 700, color: '#0C0B09', outline: 'none', boxSizing: 'border-box' }} />
                  <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#8A856E', fontWeight: 600 }}>MAD</span>
                </div>
                {amount && Number(amount) < listing.price && (
                  <p style={{ fontSize: 12, color: '#C9922A', marginTop: 4 }}>
                    Économie : {formatPrice(listing.price - Number(amount))} ({Math.round((1 - Number(amount)/listing.price)*100)}% de réduction)
                  </p>
                )}
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#8A856E', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Message au vendeur
                </label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Bonjour, je suis intéressé(e) par votre annonce..." style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #E8E0CC', background: '#fff', fontSize: 14, color: '#0C0B09', outline: 'none', resize: 'vertical', minHeight: 80, boxSizing: 'border-box' }} />
              </div>
              <motion.button type="submit" disabled={loading || !amount} style={{ padding: '14px', borderRadius: 12, background: loading ? '#E8E0CC' : 'linear-gradient(135deg, #C9922A, #E8B84B)', color: loading ? '#8A856E' : '#0C0B09', fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', minHeight: 50 }} whileHover={loading ? {} : { scale: 1.02 }}>
                {loading ? 'Envoi...' : '✓ Envoyer mon offre'}
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── Main detail page ─────────────────────────────────────────────────────────
export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [listing, setListing] = useState<any>(MOCK_DETAIL[id] || null)
  const [loading, setLoading] = useState(!MOCK_DETAIL[id])
  const [isFavorite, setIsFavorite] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/marche-libre/${id}`)
        const json = await res.json()
        if (json.data) setListing(json.data)
      } catch {}
      setLoading(false)
    }
    if (!MOCK_DETAIL[id]) load()
  }, [id])

  async function contactSeller() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login?redirect=/marche-libre/' + id); return }
    router.push(`/chat/ml_${id}`)
  }

  function share(platform: string) {
    const url = window.location.href
    const text = `Annonce : ${listing?.title} — ${formatPrice(listing?.price)} sur TABIT Marché Libre`
    const links: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      copy: '',
    }
    if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
    } else {
      window.open(links[platform], '_blank')
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 32, height: 32, border: '3px solid #E8E0CC', borderTopColor: '#C9922A', borderRadius: '50%' }} />
    </div>
  )

  if (!listing) return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontSize: 56 }}>🔍</div>
      <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 28, color: '#0C0B09' }}>Annonce introuvable</h2>
      <Link href="/marche-libre" style={{ color: '#C9922A', textDecoration: 'none', fontWeight: 600 }}>← Retour au marché</Link>
    </div>
  )

  const cond = CONDITION_LABELS[listing.condition] || CONDITION_LABELS.occasion
  const hasImages = listing.images?.length > 0

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7', paddingTop: 'clamp(68px,10vw,80px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(20px,4vw,40px) clamp(20px,5vw,56px)' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: '#8A856E' }}>
          <Link href="/" style={{ color: '#8A856E', textDecoration: 'none' }}>Accueil</Link>
          <span>›</span>
          <Link href="/marche-libre" style={{ color: '#8A856E', textDecoration: 'none' }}>Marché Libre</Link>
          <span>›</span>
          <span style={{ color: '#0C0B09', fontWeight: 500 }}>{listing.title.substring(0, 40)}...</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(24px,4vw,40px)' }} className="detail-grid">
          {/* Left: images + details */}
          <div>
            {/* Main image */}
            <div style={{ position: 'relative', aspectRatio: '4/3', background: '#F5F2EA', borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
              {hasImages ? (
                <img src={listing.images[activeImg]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, opacity: 0.25 }}>
                  📦
                </div>
              )}
              {/* Condition badge */}
              <span style={{ position: 'absolute', top: 12, left: 12, fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100, background: cond.bg, color: cond.color }}>
                {cond.label}
              </span>
              {listing.featured && (
                <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100, background: 'rgba(201,146,42,0.9)', color: '#0C0B09' }}>
                  ✦ Vedette
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {hasImages && listing.images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                {listing.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{ flexShrink: 0, width: 72, height: 72, borderRadius: 10, overflow: 'hidden', border: `2px solid ${activeImg === i ? '#C9922A' : 'transparent'}`, padding: 0, cursor: 'pointer' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div style={{ marginTop: 28, padding: 'clamp(20px,3vw,24px)', background: '#fff', borderRadius: 16, border: '1px solid #E8E0CC' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0C0B09', marginBottom: 14 }}>Description</h3>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: '#0C0B09', whiteSpace: 'pre-line', margin: 0 }}>
                {listing.description || 'Aucune description fournie.'}
              </p>
            </div>

            {/* Stats */}
            <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { icon: '👁', value: `${listing.views_count} vues` },
                { icon: '❤️', value: `${listing.favorites_count} favoris` },
                { icon: '🕐', value: `Publiée ${timeAgo(listing.created_at)}` },
                { icon: '📍', value: listing.city },
              ].map(s => (
                <span key={s.value} style={{ fontSize: 13, color: '#8A856E', display: 'flex', alignItems: 'center', gap: 5 }}>
                  {s.icon} {s.value}
                </span>
              ))}
            </div>
          </div>

          {/* Right: price + actions */}
          <div>
            {/* Price card */}
            <div style={{ background: '#fff', border: '1px solid #E8E0CC', borderRadius: 20, padding: 'clamp(20px,3vw,28px)', position: 'sticky', top: 88 }}>
              <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(18px,3vw,22px)', fontWeight: 600, color: '#0C0B09', lineHeight: 1.3, marginBottom: 16 }}>
                {listing.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(28px,5vw,38px)', fontWeight: 700, color: '#C9922A' }}>
                  {formatPrice(listing.price)}
                </span>
                {listing.price_negotiable && (
                  <span style={{ fontSize: 13, color: '#8A856E', fontWeight: 500 }}>Négociable</span>
                )}
              </div>

              {/* Seller info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderTop: '1px solid #E8E0CC', borderBottom: '1px solid #E8E0CC', margin: '16px 0' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #8B6914, #C9922A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#0C0B09', flexShrink: 0 }}>
                  {listing.seller?.full_name?.[0] || '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0C0B09' }}>{listing.seller?.full_name}</span>
                    {(listing.verified_seller || listing.seller?.role === 'merchant') && (
                      <span style={{ fontSize: 11, background: 'rgba(201,146,42,0.1)', color: '#C9922A', padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>
                        ✓ Vérifié
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#8A856E' }}>
                    {listing.seller?.role === 'merchant' ? '🏪 Commerçant' : '👤 Particulier'} · 📍 {listing.seller?.city || listing.city}
                  </div>
                </div>
              </div>

              {/* CTA buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <motion.button
                  onClick={contactSeller}
                  style={{ width: '100%', padding: '15px', borderRadius: 12, background: 'linear-gradient(135deg, #C9922A, #E8B84B)', color: '#0C0B09', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 20px rgba(201,146,42,0.35)' }}
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(201,146,42,0.5)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  💬 Contacter le vendeur
                </motion.button>

                {listing.price_negotiable && (
                  <motion.button
                    onClick={() => setShowOfferModal(true)}
                    style={{ width: '100%', padding: '15px', borderRadius: 12, background: 'transparent', color: '#C9922A', fontWeight: 700, fontSize: 15, border: '1.5px solid #C9922A', cursor: 'pointer', minHeight: 52 }}
                    whileHover={{ scale: 1.02, background: 'rgba(201,146,42,0.08)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    💰 Faire une offre
                  </motion.button>
                )}

                <motion.button
                  onClick={() => setIsFavorite(f => !f)}
                  style={{ width: '100%', padding: '13px', borderRadius: 12, background: 'transparent', color: isFavorite ? '#ef4444' : '#8A856E', fontWeight: 600, fontSize: 14, border: `1px solid ${isFavorite ? '#FCA5A5' : '#E8E0CC'}`, cursor: 'pointer', minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isFavorite ? '❤️ Ajouté aux favoris' : '🤍 Ajouter aux favoris'}
                </motion.button>
              </div>

              {/* Share */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #E8E0CC' }}>
                <p style={{ fontSize: 12, color: '#8A856E', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>Partager</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { id: 'whatsapp', label: 'WhatsApp', icon: '📱' },
                    { id: 'facebook', label: 'Facebook', icon: '👥' },
                    { id: 'copy', label: copied ? 'Copié !' : 'Copier', icon: copied ? '✓' : '🔗' },
                  ].map(s => (
                    <motion.button key={s.id} onClick={() => share(s.id)} style={{ flex: 1, padding: '10px 6px', borderRadius: 10, border: '1px solid #E8E0CC', background: '#fff', fontSize: 12, color: '#0C0B09', cursor: 'pointer', minHeight: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }} whileHover={{ borderColor: '#C9922A', scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                      <span style={{ fontSize: 16 }}>{s.icon}</span>
                      <span>{s.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Safety note */}
              <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: 'rgba(201,146,42,0.06)', border: '1px solid rgba(201,146,42,0.15)' }}>
                <p style={{ fontSize: 12, color: '#8A856E', lineHeight: 1.6, margin: 0 }}>
                  🛡️ <strong style={{ color: '#C9922A' }}>Conseil sécurité</strong> — Utilisez le chat TABIT pour communiquer. Ne payez jamais avant la livraison sans accord écrit.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar listings */}
        <div style={{ marginTop: 'clamp(40px,6vw,64px)' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(20px,4vw,28px)', color: '#0C0B09', marginBottom: 24 }}>
            Annonces similaires
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))', gap: 'clamp(12px,2vw,20px)' }}>
            {SIMILAR_MOCK.map((item, i) => {
              const c = CONDITION_LABELS[item.condition] || CONDITION_LABELS.occasion
              return (
                <Link key={item.id} href={`/marche-libre/${item.id}`} style={{ textDecoration: 'none' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{ background: '#fff', border: '1px solid #E8E0CC', borderRadius: 14, overflow: 'hidden' }}
                    whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(201,146,42,0.12)', borderColor: '#C9922A' }}
                  >
                    <div style={{ aspectRatio: '4/3', background: '#F5F2EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, opacity: 0.3 }}>📦</div>
                    <div style={{ padding: 'clamp(10px,2vw,14px)' }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0C0B09', margin: '0 0 6px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.title}</p>
                      <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 17, fontWeight: 700, color: '#C9922A', marginBottom: 4 }}>{formatPrice(item.price)}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: '#8A856E' }}>📍 {item.city}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 100, background: c.bg, color: c.color }}>{c.label}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Offer modal */}
      <AnimatePresence>
        {showOfferModal && <OfferModal listing={listing} onClose={() => setShowOfferModal(false)} />}
      </AnimatePresence>

      <style>{`
        @media (min-width: 1024px) {
          .detail-grid { grid-template-columns: 1fr 420px !important; }
        }
      `}</style>
    </div>
  )
}
