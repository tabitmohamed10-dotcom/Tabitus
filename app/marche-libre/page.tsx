'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// ─── Mock data ──────────────────────────────────────────────────────────────
const MOCK_LISTINGS: Listing[] = [
  { id: '1',  title: 'iPhone 15 Pro Max 256GB Noir — parfait état, boîte originale', price: 12500, city: 'Casablanca', condition: 'neuf',         category_slug: 'smartphones',     thumbnail_url: null, images: [], views_count: 342, favorites_count: 28, price_negotiable: true,  verified_seller: false, featured: true,  created_at: new Date(Date.now() - 1000*60*30).toISOString(),       seller: { full_name: 'Khalid A.', avatar_url: null, role: 'buyer' } },
  { id: '2',  title: 'Samsung 65" QLED 4K — Smart TV, garantie 6 mois restants',    price:  8900, city: 'Rabat',       condition: 'tres-bon-etat', category_slug: 'tv-audio',        thumbnail_url: null, images: [], views_count: 215, favorites_count: 19, price_negotiable: false, verified_seller: true,  featured: false, created_at: new Date(Date.now() - 1000*60*90).toISOString(),       seller: { full_name: 'ElectroShop Rabat', avatar_url: null, role: 'merchant' } },
  { id: '3',  title: 'Canapé d\'angle en cuir — 5 places, couleur champagne',        price:  4500, city: 'Marrakech',  condition: 'bon-etat',      category_slug: 'meubles',         thumbnail_url: null, images: [], views_count: 147, favorites_count: 11, price_negotiable: true,  verified_seller: false, featured: false, created_at: new Date(Date.now() - 1000*60*180).toISOString(),      seller: { full_name: 'Nadia L.', avatar_url: null, role: 'buyer' } },
  { id: '4',  title: 'Dacia Logan 2019 — 120 000 km, révisée, CT valide',           price: 65000, city: 'Casablanca', condition: 'occasion',      category_slug: 'voitures',        thumbnail_url: null, images: [], views_count: 528, favorites_count: 41, price_negotiable: true,  verified_seller: false, featured: true,  created_at: new Date(Date.now() - 1000*60*240).toISOString(),      seller: { full_name: 'Samir B.', avatar_url: null, role: 'buyer' } },
  { id: '5',  title: 'MacBook Pro M2 13" — 8Go/256Go, sous garantie Apple',          price: 14800, city: 'Fès',        condition: 'neuf',          category_slug: 'informatique',    thumbnail_url: null, images: [], views_count: 203, favorites_count: 24, price_negotiable: false, verified_seller: true,  featured: false, created_at: new Date(Date.now() - 1000*60*300).toISOString(),      seller: { full_name: 'TechFès Pro', avatar_url: null, role: 'merchant' } },
  { id: '6',  title: 'Appartement F3 à louer — résidence sécurisée, Maarif',        price:  4500, city: 'Casablanca', condition: 'neuf',          category_slug: 'immobilier',      thumbnail_url: null, images: [], views_count: 891, favorites_count: 67, price_negotiable: true,  verified_seller: false, featured: true,  created_at: new Date(Date.now() - 1000*60*60).toISOString(),       seller: { full_name: 'Hassan T.', avatar_url: null, role: 'buyer' }, rental: true },
  { id: '7',  title: 'Réfrigérateur Samsung 500L — No Frost, livraison incluse',     price:  3200, city: 'Tanger',     condition: 'bon-etat',      category_slug: 'electromenager',  thumbnail_url: null, images: [], views_count: 189, favorites_count: 14, price_negotiable: true,  verified_seller: true,  featured: false, created_at: new Date(Date.now() - 1000*60*420).toISOString(),      seller: { full_name: 'Électro Casa Tanger', avatar_url: null, role: 'merchant' } },
  { id: '8',  title: 'Vélo électrique Xiaomi — autonomie 50km, chargeur + casque',  price:  6500, city: 'Agadir',     condition: 'tres-bon-etat', category_slug: 'sport',           thumbnail_url: null, images: [], views_count: 96,  favorites_count:  8, price_negotiable: true,  verified_seller: false, featured: false, created_at: new Date(Date.now() - 1000*60*60*7).toISOString(),    seller: { full_name: 'Fatima O.', avatar_url: null, role: 'buyer' } },
  { id: '9',  title: 'Table basse en bois massif — style scandinave, 120×60 cm',     price:  1800, city: 'Meknès',     condition: 'bon-etat',      category_slug: 'meubles',         thumbnail_url: null, images: [], views_count: 73,  favorites_count:  5, price_negotiable: true,  verified_seller: false, featured: false, created_at: new Date(Date.now() - 1000*60*60*9).toISOString(),    seller: { full_name: 'Mounia K.', avatar_url: null, role: 'buyer' } },
  { id: '10', title: 'PS5 + 3 jeux (FIFA 25, Spider-Man, Hogwarts) — manette pro',  price:  5500, city: 'Casablanca', condition: 'tres-bon-etat', category_slug: 'gaming',          thumbnail_url: null, images: [], views_count: 303, favorites_count: 35, price_negotiable: false, verified_seller: false, featured: false, created_at: new Date(Date.now() - 1000*60*60*5).toISOString(),    seller: { full_name: 'Yassine M.', avatar_url: null, role: 'buyer' } },
  { id: '11', title: 'Climatiseur Gree 18000 BTU — inverter, installation incluse',  price:  2800, city: 'Rabat',      condition: 'occasion',      category_slug: 'electromenager',  thumbnail_url: null, images: [], views_count: 204, favorites_count: 17, price_negotiable: false, verified_seller: true,  featured: false, created_at: new Date(Date.now() - 1000*60*60*11).toISOString(),   seller: { full_name: 'ClimaService Rabat', avatar_url: null, role: 'merchant' } },
  { id: '12', title: 'Robe de mariée bohème — taille 38-40, dentelle française',    price:  3500, city: 'Marrakech',  condition: 'neuf',          category_slug: 'mode-femme',      thumbnail_url: null, images: [], views_count: 265, favorites_count: 31, price_negotiable: true,  verified_seller: false, featured: false, created_at: new Date(Date.now() - 1000*60*60*13).toISOString(),   seller: { full_name: 'Soukaina B.', avatar_url: null, role: 'buyer' } },
  { id: '13', title: 'Télévision LG 55" 4K OLED — ThinQ AI, télécommande magic',    price:  5200, city: 'Fès',        condition: 'bon-etat',      category_slug: 'tv-audio',        thumbnail_url: null, images: [], views_count: 178, favorites_count: 22, price_negotiable: true,  verified_seller: false, featured: false, created_at: new Date(Date.now() - 1000*60*60*15).toISOString(),   seller: { full_name: 'Mehdi R.', avatar_url: null, role: 'buyer' } },
  { id: '14', title: 'Machine à laver Bosch 8kg — programme vapeur, A+++',          price:  2900, city: 'Casablanca', condition: 'tres-bon-etat', category_slug: 'electromenager',  thumbnail_url: null, images: [], views_count: 241, favorites_count: 19, price_negotiable: false, verified_seller: true,  featured: false, created_at: new Date(Date.now() - 1000*60*60*17).toISOString(),   seller: { full_name: 'MaisonPlus', avatar_url: null, role: 'merchant' } },
  { id: '15', title: 'Scooter Honda 125cc 2021 — 22 000 km, carnet entretien',      price: 18000, city: 'Tanger',     condition: 'occasion',      category_slug: 'voitures',        thumbnail_url: null, images: [], views_count: 412, favorites_count: 38, price_negotiable: true,  verified_seller: false, featured: true,  created_at: new Date(Date.now() - 1000*60*60*19).toISOString(),   seller: { full_name: 'Omar Z.', avatar_url: null, role: 'buyer' } },
  { id: '16', title: 'Bureau en L avec caisson — chêne clair, quasi neuf',          price:  2200, city: 'Rabat',      condition: 'tres-bon-etat', category_slug: 'meubles',         thumbnail_url: null, images: [], views_count: 89,  favorites_count:  7, price_negotiable: true,  verified_seller: false, featured: false, created_at: new Date(Date.now() - 1000*60*60*21).toISOString(),   seller: { full_name: 'Ayoub M.', avatar_url: null, role: 'buyer' } },
  { id: '17', title: 'Drone DJI Mini 3 — 4K, stabilisateur 3 axes, 2 batteries',   price:  4800, city: 'Casablanca', condition: 'neuf',          category_slug: 'iot',             thumbnail_url: null, images: [], views_count: 178, favorites_count: 26, price_negotiable: false, verified_seller: false, featured: false, created_at: new Date(Date.now() - 1000*60*60*23).toISOString(),   seller: { full_name: 'Imane E.', avatar_url: null, role: 'buyer' } },
  { id: '18', title: 'Cuisine équipée complète — inox brossé, électroménager inclus', price: 18500, city: 'Marrakech', condition: 'bon-etat',    category_slug: 'meubles',         thumbnail_url: null, images: [], views_count: 356, favorites_count: 44, price_negotiable: true,  verified_seller: false, featured: true,  created_at: new Date(Date.now() - 1000*60*60*25).toISOString(),   seller: { full_name: 'Rachid S.', avatar_url: null, role: 'buyer' } },
  { id: '19', title: 'Tablette iPad Pro 12.9" M2 — 256Go, Apple Pencil 2 inclus',   price:  9500, city: 'Agadir',     condition: 'neuf',          category_slug: 'informatique',    thumbnail_url: null, images: [], views_count: 134, favorites_count: 16, price_negotiable: false, verified_seller: true,  featured: false, created_at: new Date(Date.now() - 1000*60*60*27).toISOString(),   seller: { full_name: 'TechPlus Agadir', avatar_url: null, role: 'merchant' } },
  { id: '20', title: 'Lot vêtements bébé 0-12 mois — 30 pièces, très bon état',     price:   450, city: 'Casablanca', condition: 'tres-bon-etat', category_slug: 'mode-enfants',    thumbnail_url: null, images: [], views_count: 67,  favorites_count:  9, price_negotiable: true,  verified_seller: false, featured: false, created_at: new Date(Date.now() - 1000*60*60*30).toISOString(),   seller: { full_name: 'Siham A.', avatar_url: null, role: 'buyer' } },
]

const CATEGORIES = [
  { slug: '', label: 'Toutes catégories', icon: '🏪' },
  { slug: 'smartphones', label: 'Smartphones', icon: '📱' },
  { slug: 'informatique', label: 'Informatique', icon: '💻' },
  { slug: 'electromenager', label: 'Électroménager', icon: '⚡' },
  { slug: 'voitures', label: 'Automobiles', icon: '🚗' },
  { slug: 'meubles', label: 'Ameublement', icon: '🛋️' },
  { slug: 'tv-audio', label: 'TV & Audio', icon: '📺' },
  { slug: 'gaming', label: 'Gaming', icon: '🎮' },
  { slug: 'bijoux', label: 'Bijouterie', icon: '💎' },
  { slug: 'mode-homme', label: 'Mode homme', icon: '👔' },
  { slug: 'mode-femme', label: 'Mode femme', icon: '👗' },
  { slug: 'mode-enfants', label: 'Enfants', icon: '🎁' },
  { slug: 'sport', label: 'Sport', icon: '⚽' },
  { slug: 'immobilier', label: 'Immobilier', icon: '🏠' },
  { slug: 'iot', label: 'High-tech', icon: '🔌' },
]

const CITIES = ['Toutes les villes','Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda','Kénitra','Tétouan']
const CONDITIONS = [
  { value: '', label: 'Tout état' },
  { value: 'neuf', label: '✨ Neuf' },
  { value: 'tres-bon-etat', label: '⭐ Très bon état' },
  { value: 'bon-etat', label: '👍 Bon état' },
  { value: 'occasion', label: '🔄 Occasion' },
  { value: 'reconditionne', label: '🔧 Reconditionné' },
]

type Condition = 'neuf' | 'tres-bon-etat' | 'bon-etat' | 'occasion' | 'reconditionne'
interface Listing {
  id: string; title: string; price: number; city: string
  condition: string; category_slug: string | null; thumbnail_url: string | null
  images: string[]; views_count: number; favorites_count: number
  price_negotiable: boolean; verified_seller: boolean; featured: boolean
  created_at: string
  rental?: boolean
  seller: { full_name: string; avatar_url: string | null; role: string }
}

const CONDITION_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  neuf:           { label: 'Neuf',           bg: '#dcfce7', color: '#15803d' },
  'tres-bon-etat':{ label: 'Très bon état',  bg: '#dbeafe', color: '#1d4ed8' },
  'bon-etat':     { label: 'Bon état',       bg: '#e0f2fe', color: '#0369a1' },
  occasion:       { label: 'Occasion',       bg: '#fef3c7', color: '#b45309' },
  reconditionne:  { label: 'Reconditionné',  bg: '#f3e8ff', color: '#7e22ce' },
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'À l\'instant'
  if (diff < 3600) return `${Math.floor(diff/60)}min`
  if (diff < 86400) return `${Math.floor(diff/3600)}h`
  return `${Math.floor(diff/86400)}j`
}

function formatPrice(p: number) {
  return new Intl.NumberFormat('fr-MA').format(p) + ' MAD'
}

// ─── Listing card ────────────────────────────────────────────────────────────
function ListingCard({ item, index }: { item: Listing; index: number }) {
  const cond = CONDITION_LABELS[item.condition] || CONDITION_LABELS.occasion
  const emoji = CATEGORIES.find(c => c.slug === item.category_slug)?.icon || '📦'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.05, duration: 0.45, ease: [0.22,1,0.36,1] }}
    >
      <Link href={`/marche-libre/${item.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <motion.div
          style={{
            background: '#fff', border: '1px solid #E8E0CC', borderRadius: 16,
            overflow: 'hidden', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column',
          }}
          whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(201,146,42,0.14)', borderColor: '#C9922A' }}
          transition={{ duration: 0.25 }}
        >
          {/* Image area */}
          <div style={{ position: 'relative', aspectRatio: '4/3', background: '#F5F2EA', overflow: 'hidden', flexShrink: 0 }}>
            {item.thumbnail_url ? (
              <img src={item.thumbnail_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, opacity: 0.35 }}>
                {emoji}
              </div>
            )}
            {/* Badges */}
            <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: cond.bg, color: cond.color }}>
                {cond.label}
              </span>
              {item.featured && (
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: 'rgba(201,146,42,0.9)', color: '#0C0B09' }}>
                  ✦ Vedette
                </span>
              )}
            </div>
            {item.price_negotiable && (
              <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, padding: '3px 7px', borderRadius: 100, background: 'rgba(12,11,9,0.7)', color: '#C9922A', fontWeight: 600 }}>
                Négociable
              </span>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: 'clamp(12px,2vw,16px)', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#0C0B09', lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {item.title}
            </p>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(16px,2.5vw,20px)', fontWeight: 700, color: '#C9922A' }}>
                {formatPrice(item.price)}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 11, color: '#8A856E' }}>📍 {item.city}</span>
                  {item.verified_seller && (
                    <span style={{ fontSize: 10, color: '#C9922A' }} title="Commerçant vérifié">✓ Vérifié</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#8A856E' }}>👁 {item.views_count}</span>
                  <span style={{ fontSize: 11, color: '#8A856E' }}>🕐 {timeAgo(item.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

// ─── Publish modal ────────────────────────────────────────────────────────────
function PublishModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', price: '', category_slug: '', city: '',
    condition: 'occasion' as Condition, contact_method: 'chat', phone: '', price_negotiable: true,
  })
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  async function submit() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/marche-libre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      onSuccess()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14,
    border: '1px solid #E8E0CC', background: '#FAFAF7', color: '#0C0B09',
    outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: '#8A856E', letterSpacing: '0.06em',
    textTransform: 'uppercase', display: 'block', marginBottom: 6,
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(12,11,9,0.6)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(6px)', padding: '0 0 0 0' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ background: '#FAFAF7', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 640, maxHeight: '92vh', overflow: 'auto' }}
        className="publish-modal"
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#E8E0CC' }} />
        </div>

        <div style={{ padding: 'clamp(20px,4vw,28px) clamp(20px,5vw,32px)' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 22, fontWeight: 600, color: '#0C0B09', margin: 0 }}>
                Publier une annonce
              </h2>
              <p style={{ fontSize: 13, color: '#8A856E', margin: '4px 0 0' }}>Étape {step} / 3</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#8A856E', padding: 4, minHeight: 44, minWidth: 44 }}>✕</button>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
            {[1,2,3].map(s => (
              <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? '#C9922A' : '#E8E0CC', transition: 'background 0.3s' }} />
            ))}
          </div>

          {/* Step 1: What */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>Titre de l'annonce *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: iPhone 15 Pro 256GB, noir, très bon état" style={inputStyle} maxLength={120} />
                <div style={{ fontSize: 11, color: '#8A856E', marginTop: 4, textAlign: 'right' }}>{form.title.length}/120</div>
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Décrivez l'état, les caractéristiques, ce qui est inclus..." style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} maxLength={2000} />
              </div>
              <div>
                <label style={labelStyle}>Catégorie</label>
                <select value={form.category_slug} onChange={e => set('category_slug', e.target.value)} style={inputStyle}>
                  <option value="">Choisir une catégorie</option>
                  {CATEGORIES.filter(c => c.slug).map(c => (
                    <option key={c.slug} value={c.slug}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>État *</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {(['neuf','tres-bon-etat','bon-etat','occasion','reconditionne'] as Condition[]).map(c => (
                    <button key={c} onClick={() => set('condition', c)} style={{
                      flex: 1, padding: '10px 8px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', minHeight: 44,
                      border: `1.5px solid ${form.condition === c ? '#C9922A' : '#E8E0CC'}`,
                      background: form.condition === c ? 'rgba(201,146,42,0.08)' : '#fff',
                      color: form.condition === c ? '#C9922A' : '#8A856E',
                    }}>
                      {CONDITION_LABELS[c]?.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Price + Location */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>Prix (MAD) *</label>
                <div style={{ position: 'relative' }}>
                  <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" min={0} style={{ ...inputStyle, paddingRight: 56 }} />
                  <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#8A856E', fontWeight: 600 }}>MAD</span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Prix négociable ?</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[true, false].map(v => (
                    <button key={String(v)} onClick={() => set('price_negotiable', v)} style={{
                      flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', minHeight: 44,
                      border: `1.5px solid ${form.price_negotiable === v ? '#C9922A' : '#E8E0CC'}`,
                      background: form.price_negotiable === v ? 'rgba(201,146,42,0.08)' : '#fff',
                      color: form.price_negotiable === v ? '#C9922A' : '#8A856E',
                    }}>
                      {v ? '✓ Oui, je négocie' : '✗ Prix fixe'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Ville *</label>
                <select value={form.city} onChange={e => set('city', e.target.value)} style={inputStyle}>
                  <option value="">Choisir votre ville</option>
                  {CITIES.filter(c => c !== 'Toutes les villes').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>Mode de contact</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { v: 'chat', label: '💬 Chat TABIT uniquement', desc: 'Vos coordonnées restent protégées' },
                    { v: 'phone', label: '📞 Téléphone', desc: 'Votre numéro sera visible après accord' },
                    { v: 'both', label: '💬📞 Chat + Téléphone', desc: 'Maximum de visibilité' },
                  ].map(opt => (
                    <button key={opt.v} onClick={() => set('contact_method', opt.v)} style={{
                      padding: '14px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left', minHeight: 56,
                      border: `1.5px solid ${form.contact_method === opt.v ? '#C9922A' : '#E8E0CC'}`,
                      background: form.contact_method === opt.v ? 'rgba(201,146,42,0.06)' : '#fff',
                    }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: form.contact_method === opt.v ? '#C9922A' : '#0C0B09' }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: '#8A856E', marginTop: 2 }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              {(form.contact_method === 'phone' || form.contact_method === 'both') && (
                <div>
                  <label style={labelStyle}>Numéro de téléphone</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+212 6XX XXX XXX" style={inputStyle} />
                </div>
              )}
              {/* Preview */}
              <div style={{ padding: 16, borderRadius: 12, background: '#F5F2EA', border: '1px solid #E8E0CC' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#8A856E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Aperçu de votre annonce</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0C0B09', marginBottom: 4 }}>{form.title || 'Titre de votre annonce'}</div>
                <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 700, color: '#C9922A' }}>
                  {form.price ? formatPrice(Number(form.price)) : '— MAD'}
                </div>
                <div style={{ fontSize: 12, color: '#8A856E', marginTop: 6 }}>
                  📍 {form.city || 'Votre ville'} · {CONDITION_LABELS[form.condition]?.label} {form.price_negotiable ? '· Négociable' : ''}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '14px', borderRadius: 12, border: '1.5px solid #E8E0CC', background: '#fff', color: '#0C0B09', fontSize: 15, fontWeight: 600, cursor: 'pointer', minHeight: 50 }}>
                ← Retour
              </button>
            )}
            {step < 3 ? (
              <motion.button
                onClick={() => {
                  if (step === 1 && !form.title) { setError('Le titre est requis'); return }
                  if (step === 2 && (!form.price || !form.city)) { setError('Prix et ville requis'); return }
                  setError(''); setStep(s => s + 1)
                }}
                style={{ flex: 1, padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg, #C9922A, #E8B84B)', color: '#0C0B09', fontSize: 15, fontWeight: 700, cursor: 'pointer', border: 'none', minHeight: 50 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                Continuer →
              </motion.button>
            ) : (
              <motion.button
                onClick={submit}
                disabled={loading}
                style={{ flex: 1, padding: '14px', borderRadius: 12, background: loading ? '#E8E0CC' : 'linear-gradient(135deg, #C9922A, #E8B84B)', color: loading ? '#8A856E' : '#0C0B09', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', border: 'none', minHeight: 50 }}
                whileHover={loading ? {} : { scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Publication...' : '✓ Publier mon annonce'}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main page inner (needs Suspense for useSearchParams) ─────────────────────
function MarcheLibreContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') || ''

  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Filters — pre-select from URL param
  const [category, setCategory] = useState(categoryParam)

  useEffect(() => {
    if (categoryParam) setCategory(categoryParam)
  }, [categoryParam])
  const [city, setCity] = useState('')
  const [condition, setCondition] = useState('')
  const [sort, setSort] = useState('recent')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const fetchListings = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.set('category', category)
      if (city && city !== 'Toutes les villes') params.set('city', city)
      if (condition) params.set('condition', condition)
      if (sort) params.set('sort', sort)
      if (minPrice) params.set('min_price', minPrice)
      if (maxPrice) params.set('max_price', maxPrice)
      if (search) params.set('q', search)

      const res = await fetch(`/api/marche-libre?${params}`)
      const json = await res.json()
      if (json.data?.length > 0) setListings(json.data)
      // else keep mock data
    } catch {
      // keep mock data
    } finally {
      setLoading(false)
    }
  }, [category, city, condition, sort, minPrice, maxPrice, search])

  useEffect(() => { fetchListings() }, [fetchListings])

  // Filter mock data client-side for instant UI
  const displayed = listings.filter(l => {
    if (category && l.category_slug !== category) return false
    if (city && city !== 'Toutes les villes' && l.city !== city) return false
    if (condition && l.condition !== condition) return false
    if (minPrice && l.price < Number(minPrice)) return false
    if (maxPrice && l.price > Number(maxPrice)) return false
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price
    if (sort === 'price_desc') return b.price - a.price
    if (sort === 'popular') return b.views_count - a.views_count
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  function toggleFavorite(id: string) {
    setFavorites(f => { const n = new Set(f); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7' }}>
      {/* Hero header */}
      <div style={{ background: '#0C0B09', paddingTop: 'clamp(72px, 10vw, 88px)', paddingBottom: 'clamp(28px, 5vw, 40px)', paddingLeft: 'clamp(20px,5vw,56px)', paddingRight: 'clamp(20px,5vw,56px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 28 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9922A', padding: '4px 12px', border: '1px solid rgba(201,146,42,0.3)', borderRadius: 100, background: 'rgba(201,146,42,0.08)' }}>
                  Nouveau
                </span>
                <Link href="/" style={{ fontSize: 13, color: '#8A856E', textDecoration: 'none' }}>← Accueil TABIT</Link>
              </div>
              <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(28px, 6vw, 48px)', fontWeight: 400, color: '#FAFAF7', margin: 0, lineHeight: 1.1 }}>
                Marché Libre
              </h1>
              <p style={{ fontFamily: 'var(--font-arabic), serif', fontSize: 16, color: '#C9922A', direction: 'rtl', margin: '6px 0 10px' }}>السوق الحر</p>
              <p style={{ fontSize: 14, color: '#8A856E', margin: 0 }}>
                Achetez et vendez directement — annonces gratuites, sans commission
              </p>
            </div>
            <motion.button
              onClick={() => setShowModal(true)}
              style={{ padding: 'clamp(12px,3vw,16px) clamp(20px,5vw,32px)', borderRadius: 12, background: 'linear-gradient(135deg, #C9922A, #E8B84B)', color: '#0C0B09', fontWeight: 700, fontSize: 'clamp(13px,2vw,15px)', border: 'none', cursor: 'pointer', minHeight: 50, boxShadow: '0 4px 20px rgba(201,146,42,0.4)', whiteSpace: 'nowrap' }}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(201,146,42,0.55)' }}
              whileTap={{ scale: 0.97 }}
            >
              + Publier une annonce
            </motion.button>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: 600 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none' }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une annonce..."
              style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: 12, border: '1px solid rgba(201,146,42,0.2)', background: 'rgba(255,255,255,0.06)', color: '#FAFAF7', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div style={{ background: '#111110', borderBottom: '1px solid rgba(201,146,42,0.1)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 8, padding: '12px clamp(20px,5vw,56px)', minWidth: 'max-content' }}>
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat.slug}
              onClick={() => setCategory(cat.slug)}
              style={{
                padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', minHeight: 36, border: `1px solid ${category === cat.slug ? '#C9922A' : 'rgba(201,146,42,0.15)'}`,
                background: category === cat.slug ? 'rgba(201,146,42,0.15)' : 'transparent',
                color: category === cat.slug ? '#C9922A' : '#8A856E',
              }}
              whileHover={{ borderColor: '#C9922A', color: '#C9922A' }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.icon} {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filters bar */}
      <div style={{ background: '#FAFAF7', borderBottom: '1px solid #E8E0CC', padding: 'clamp(12px,3vw,16px) clamp(20px,5vw,56px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
          {/* City */}
          <select value={city} onChange={e => setCity(e.target.value)} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #E8E0CC', background: '#fff', fontSize: 13, color: '#0C0B09', cursor: 'pointer', minHeight: 44 }}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
          {/* Condition */}
          <select value={condition} onChange={e => setCondition(e.target.value)} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #E8E0CC', background: '#fff', fontSize: 13, color: '#0C0B09', cursor: 'pointer', minHeight: 44 }}>
            {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #E8E0CC', background: '#fff', fontSize: 13, color: '#0C0B09', cursor: 'pointer', minHeight: 44 }}>
            <option value="recent">Plus récents</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="popular">Plus populaires</option>
          </select>
          {/* Price range */}
          <motion.button onClick={() => setShowFilters(f => !f)} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #E8E0CC', background: showFilters ? 'rgba(201,146,42,0.08)' : '#fff', color: showFilters ? '#C9922A' : '#0C0B09', fontSize: 13, cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center', gap: 6 }} whileTap={{ scale: 0.97 }}>
            🎚 Prix
          </motion.button>
          {/* Results count */}
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#8A856E' }}>
            {displayed.length} annonce{displayed.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Price range inputs */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
              <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Prix min (MAD)" style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #E8E0CC', background: '#fff', fontSize: 13, width: 160, minHeight: 44 }} />
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Prix max (MAD)" style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #E8E0CC', background: '#fff', fontSize: 13, width: 160, minHeight: 44 }} />
                <button onClick={() => { setMinPrice(''); setMaxPrice('') }} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #E8E0CC', background: '#fff', color: '#8A856E', fontSize: 13, cursor: 'pointer', minHeight: 44 }}>Réinitialiser</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Listings grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(24px,4vw,40px) clamp(20px,5vw,56px)' }}>
        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, color: '#0C0B09', marginBottom: 8 }}>Aucune annonce trouvée</h3>
            <p style={{ color: '#8A856E', marginBottom: 24 }}>Essayez de modifier vos filtres ou publiez la première annonce dans cette catégorie.</p>
            <motion.button onClick={() => setShowModal(true)} style={{ padding: '14px 28px', borderRadius: 12, background: 'linear-gradient(135deg, #C9922A, #E8B84B)', color: '#0C0B09', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', minHeight: 50 }} whileHover={{ scale: 1.04 }}>
              + Publier une annonce
            </motion.button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))', gap: 'clamp(12px,2vw,20px)' }}>
            {displayed.map((item, i) => (
              <div key={item.id} style={{ position: 'relative' }}>
                <ListingCard item={item} index={i} />
                <motion.button
                  onClick={() => toggleFavorite(item.id)}
                  style={{ position: 'absolute', top: 8, right: 8, width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, zIndex: 2 }}
                  whileTap={{ scale: 0.85 }}
                  title="Ajouter aux favoris"
                >
                  {favorites.has(item.id) ? '❤️' : '🤍'}
                </motion.button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: 56, padding: 'clamp(24px,4vw,36px)', borderRadius: 20, background: '#0C0B09', border: '1px solid rgba(201,146,42,0.2)', textAlign: 'center' }}
        >
          <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(20px,4vw,28px)', color: '#FAFAF7', marginBottom: 8 }}>
            Vous avez quelque chose à vendre ?
          </h3>
          <p style={{ fontFamily: 'var(--font-arabic), serif', fontSize: 15, color: '#C9922A', direction: 'rtl', marginBottom: 12 }}>هل تريد البيع؟</p>
          <p style={{ fontSize: 14, color: '#8A856E', marginBottom: 24 }}>Publiez votre annonce gratuitement. Acheteurs vérifiés, paiement sécurisé.</p>
          <motion.button onClick={() => setShowModal(true)} style={{ padding: 'clamp(12px,3vw,16px) clamp(24px,5vw,40px)', borderRadius: 12, background: 'linear-gradient(135deg, #C9922A, #E8B84B)', color: '#0C0B09', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', minHeight: 50, boxShadow: '0 4px 20px rgba(201,146,42,0.4)' }} whileHover={{ scale: 1.04 }}>
            + Publier une annonce — Gratuit
          </motion.button>
        </motion.div>
      </div>

      {/* Publish modal */}
      <AnimatePresence>
        {showModal && (
          <PublishModal
            onClose={() => setShowModal(false)}
            onSuccess={() => { setShowModal(false); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 4000) }}
          />
        )}
      </AnimatePresence>

      {/* Success toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#0C0B09', border: '1px solid rgba(201,146,42,0.4)', borderRadius: 12, padding: '14px 24px', color: '#C9922A', fontWeight: 600, fontSize: 15, zIndex: 300, whiteSpace: 'nowrap', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
          >
            ✓ Annonce publiée avec succès !
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        input::placeholder { color: #C4BCA8 !important; }
        textarea::placeholder { color: #C4BCA8 !important; }
        .publish-modal::-webkit-scrollbar { width: 4px; }
        .publish-modal::-webkit-scrollbar-thumb { background: #E8E0CC; border-radius: 2px; }
        @media (min-width: 1024px) {
          .publish-modal { border-radius: 20px !important; max-height: 85vh !important; }
        }
      `}</style>
    </div>
  )
}

export default function MarcheLiberePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#FAFAF7' }} />}>
      <MarcheLibreContent />
    </Suspense>
  )
}
