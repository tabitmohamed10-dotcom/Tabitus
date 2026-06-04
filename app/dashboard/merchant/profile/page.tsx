'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Save as SaveIcon, CheckCircle2, Clock, Star, MapPin, Phone, Globe, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MOROCCAN_CITIES } from '@/lib/utils'

const ALL_CATEGORIES = [
  { slug: 'electromenager', name: '⚡ Électroménager' },
  { slug: 'informatique', name: '💻 Informatique & Téléphonie' },
  { slug: 'ameublement', name: '🛋️ Ameublement & Décoration' },
  { slug: 'automobile', name: '🚗 Automobile & Pièces' },
  { slug: 'btp', name: '🏗️ BTP & Matériaux' },
  { slug: 'bijouterie', name: '💎 Bijouterie & Montres' },
  { slug: 'mode', name: '👔 Mode & Textile' },
  { slug: 'alimentaire', name: '🍽️ Alimentaire & Traiteur' },
  { slug: 'services', name: '🔧 Services & Artisanat' },
  { slug: 'b2b', name: '🏢 B2B & Entreprises' },
  { slug: 'smartphones', name: '📱 Smartphones' },
  { slug: 'pharma', name: '💊 Pharmacie & Santé' },
  { slug: 'sport', name: '🏋️ Sport & Loisirs' },
  { slug: 'enfants', name: '🎁 Enfants & Jouets' },
  { slug: 'jardinage', name: '🌱 Jardinage & Extérieur' },
  { slug: 'photo', name: '📷 Photo & Vidéo' },
  { slug: 'musique', name: '🎵 Instruments & Musique' },
  { slug: 'livres', name: '📚 Livres & Papeterie' },
]

const PAYMENT_METHODS = [
  { slug: 'cash', label: '💵 Espèces' },
  { slug: 'card', label: '💳 Carte bancaire' },
  { slug: 'virement', label: '🏦 Virement bancaire' },
  { slug: 'cheque', label: '📝 Chèque' },
  { slug: 'cmi', label: '🔐 CMI' },
]

const DELIVERY_OPTIONS = [
  { slug: 'livraison', label: '🚚 Livraison à domicile' },
  { slug: 'pickup', label: '🏪 Retrait en boutique' },
  { slug: 'express', label: '⚡ Express (<24h)' },
  { slug: 'national', label: '🇲🇦 Livraison nationale' },
]

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const VERIFICATION_STEPS = [
  { key: 'email', label: 'Email vérifié', desc: 'Votre adresse email a été confirmée' },
  { key: 'phone', label: 'Téléphone vérifié', desc: 'Numéro professionnel confirmé' },
  { key: 'docs', label: 'Documents soumis', desc: 'Patente + RC + CIN envoyés' },
  { key: 'approved', label: 'Compte approuvé', desc: 'Vérification manuelle validée' },
]

interface MerchantData {
  business_name: string
  slogan: string
  description: string
  categories: string[]
  city: string
  phone: string
  whatsapp: string
  website: string
  address: string
  payment_methods: string[]
  delivery_options: string[]
  return_policy: string
  logo_url: string | null
  cover_url: string | null
  business_hours: Record<string, { open: string; close: string; closed: boolean }>
  verified: boolean
  rating: number
  total_ratings: number
  total_offers: number
  accepted_offers: number
  created_at: string
}

const defaultHours = Object.fromEntries(
  DAYS.map(d => [d, { open: '09:00', close: '18:00', closed: d === 'Dimanche' }])
)

export default function MerchantProfilePage() {
  const supabase = createClient()
  const [merchant, setMerchant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'hours' | 'preview' | 'verification'>('info')

  const [form, setForm] = useState<MerchantData>({
    business_name: '', slogan: '', description: '', categories: [],
    city: '', phone: '', whatsapp: '', website: '', address: '',
    payment_methods: [], delivery_options: [], return_policy: '',
    logo_url: null, cover_url: null,
    business_hours: defaultHours,
    verified: false, rating: 0, total_ratings: 0,
    total_offers: 0, accepted_offers: 0, created_at: '',
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserEmail(user.email || '')
      const { data: m } = await supabase.from('merchants').select('*').eq('user_id', user.id).single()
      if (m) {
        setMerchant(m)
        setForm(prev => ({
          ...prev,
          business_name: m.business_name || '',
          slogan: m.slogan || '',
          description: m.description || '',
          categories: m.categories || [],
          city: m.city || '',
          phone: m.phone || '',
          whatsapp: m.whatsapp || '',
          website: m.website || '',
          address: m.address || '',
          payment_methods: m.payment_methods || [],
          delivery_options: m.delivery_options || [],
          return_policy: m.return_policy || '',
          logo_url: m.logo_url,
          cover_url: m.cover_url,
          business_hours: m.business_hours || defaultHours,
          verified: m.verified || false,
          rating: m.rating || 0,
          total_ratings: m.total_ratings || 0,
          total_offers: m.total_offers || 0,
          accepted_offers: m.accepted_offers || 0,
          created_at: m.created_at || '',
        }))
        setLogoPreview(m.logo_url)
        setCoverPreview(m.cover_url)
      }
      setLoading(false)
    }
    load()
  }, [])

  function toggle<T extends string>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]
  }

  function updateForm(key: keyof MerchantData, value: any) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let logoUrl = form.logo_url
    let coverUrl = form.cover_url

    if (logoFile) {
      const path = `logos/${user.id}/${Date.now()}.${logoFile.name.split('.').pop()}`
      const { error } = await supabase.storage.from('tabit-uploads').upload(path, logoFile, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('tabit-uploads').getPublicUrl(path)
        logoUrl = data.publicUrl
      }
    }
    if (coverFile) {
      const path = `covers/${user.id}/${Date.now()}.${coverFile.name.split('.').pop()}`
      const { error } = await supabase.storage.from('tabit-uploads').upload(path, coverFile, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('tabit-uploads').getPublicUrl(path)
        coverUrl = data.publicUrl
      }
    }

    const payload = {
      business_name: form.business_name,
      slogan: form.slogan,
      description: form.description,
      categories: form.categories,
      city: form.city,
      phone: form.phone,
      whatsapp: form.whatsapp,
      website: form.website,
      address: form.address,
      payment_methods: form.payment_methods,
      delivery_options: form.delivery_options,
      return_policy: form.return_policy,
      logo_url: logoUrl,
      cover_url: coverUrl,
      business_hours: form.business_hours,
    }

    if (merchant) {
      await supabase.from('merchants').update(payload).eq('id', merchant.id)
    } else {
      await supabase.from('merchants').insert({ user_id: user.id, ...payload })
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 28 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{ height: 80, borderRadius: 12, background: '#E8E0CC', marginBottom: 12,
          animation: 'shimmer 1.8s infinite', backgroundSize: '200% 100%',
          backgroundImage: 'linear-gradient(90deg, #E8E0CC 0%, #F5F2EA 50%, #E8E0CC 100%)' }} />
      ))}
      <style>{`@keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}`}</style>
    </div>
  )

  const verificationStatus = {
    email: true,
    phone: !!form.phone,
    docs: merchant?.docs_submitted || false,
    approved: form.verified,
  }
  const verificationCount = Object.values(verificationStatus).filter(Boolean).length

  const tabs = [
    { id: 'info', label: 'Informations', icon: '📋' },
    { id: 'hours', label: 'Horaires', icon: '🕐' },
    { id: 'preview', label: 'Aperçu', icon: '👁️' },
    { id: 'verification', label: 'Vérification', icon: '✓' },
  ] as const

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(20px,4vw,28px)', fontWeight: 700, color: '#0C0B09', marginBottom: 4 }}>
            Profil boutique
          </h1>
          <p style={{ fontSize: 13, color: '#8A856E' }}>Un profil complet reçoit 3× plus de visibilité</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 24px', borderRadius: 12,
            background: saved ? '#22C55E' : 'linear-gradient(135deg, #C9922A, #E8B84B)',
            color: '#0C0B09', fontWeight: 700, fontSize: 14,
            border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
            boxShadow: '0 4px 16px rgba(201,146,42,0.3)',
            transition: 'all 0.3s',
          }}
        >
          {saving ? '⏳ Enregistrement...' : saved ? '✅ Enregistré !' : <><SaveIcon size={16} /> Enregistrer</>}
        </button>
      </div>

      {/* Stats row */}
      {merchant && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Offres envoyées', value: form.total_offers, icon: '📤' },
            { label: 'Taux acceptation', value: form.total_offers > 0 ? `${Math.round(form.accepted_offers / form.total_offers * 100)}%` : '—', icon: '✅' },
            { label: 'Note moyenne', value: form.rating > 0 ? `${form.rating}/5` : '—', icon: '⭐' },
            { label: 'Membre depuis', value: form.created_at ? new Date(form.created_at).getFullYear().toString() : '2024', icon: '📅' },
          ].map(s => (
            <div key={s.label} style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E8E0CC', padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 'clamp(16px,3vw,20px)', fontWeight: 700, color: '#C9922A', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#8A856E', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E8E0CC', marginBottom: 24, gap: 0, overflowX: 'auto' }} className="scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px', border: 'none', cursor: 'pointer',
              background: 'none', fontWeight: 600, fontSize: 13,
              color: activeTab === tab.id ? '#C9922A' : '#8A856E',
              borderBottom: `2px solid ${activeTab === tab.id ? '#C9922A' : 'transparent'}`,
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Info */}
      {activeTab === 'info' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Images */}
          <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8E0CC', padding: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#0C0B09' }}>Images de la boutique</h2>
            {/* Cover */}
            <div
              onClick={() => document.getElementById('cover-input')?.click()}
              style={{
                height: 140, borderRadius: 12, cursor: 'pointer',
                background: coverPreview ? `url(${coverPreview}) center/cover` : 'linear-gradient(135deg, #0C0B09, #1C1B16)',
                border: '1px dashed #E8E0CC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16, position: 'relative', overflow: 'hidden',
              }}
            >
              {!coverPreview && (
                <div style={{ textAlign: 'center', color: '#8A856E' }}>
                  <Upload size={24} style={{ marginBottom: 6 }} />
                  <p style={{ fontSize: 12 }}>Photo de couverture (1200×400)</p>
                </div>
              )}
              {coverPreview && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 600 }}>Changer la couverture</span>
                </div>
              )}
              <input id="cover-input" type="file" accept="image/*" className="hidden" onChange={e => {
                const f = e.target.files?.[0]
                if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)) }
              }} />
            </div>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                onClick={() => document.getElementById('logo-input')?.click()}
                style={{
                  width: 72, height: 72, borderRadius: 14, cursor: 'pointer',
                  background: logoPreview ? `url(${logoPreview}) center/cover` : 'linear-gradient(135deg, #8B6914, #C9922A)',
                  border: '2px solid #E8E0CC', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#FFFFFF', fontSize: 24, fontWeight: 700, overflow: 'hidden',
                }}
              >
                {!logoPreview && (form.business_name?.[0]?.toUpperCase() || '🏪')}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => document.getElementById('logo-input')?.click()}
                  style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E8E0CC', background: '#FFFFFF', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#0C0B09', marginBottom: 4, display: 'block' }}
                >
                  Changer le logo
                </button>
                <p style={{ fontSize: 11, color: '#8A856E' }}>JPG, PNG · Max 2 MB · Carré recommandé</p>
                <input id="logo-input" type="file" accept="image/*" className="hidden" onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)) }
                }} />
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8E0CC', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0C0B09' }}>Informations principales</h2>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#0C0B09', marginBottom: 6, display: 'block' }}>Nom de la boutique *</label>
              <input value={form.business_name} onChange={e => updateForm('business_name', e.target.value)} placeholder="Mon Commerce SARL" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#0C0B09', marginBottom: 6, display: 'block' }}>Slogan / Accroche</label>
              <input value={form.slogan} onChange={e => updateForm('slogan', e.target.value)} placeholder="Votre excellence à portée de main" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#0C0B09', marginBottom: 6, display: 'block' }}>Description de la boutique</label>
              <textarea value={form.description} onChange={e => updateForm('description', e.target.value)} placeholder="Décrivez votre activité, vos spécialités, votre expérience, vos marques..." rows={4} style={{ ...inputStyle, height: 'auto', resize: 'vertical' as const }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#0C0B09', marginBottom: 6, display: 'block' }}>Ville *</label>
                <select value={form.city} onChange={e => updateForm('city', e.target.value)} style={{ ...inputStyle, appearance: 'auto' as const }}>
                  <option value="">Choisir une ville</option>
                  {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#0C0B09', marginBottom: 6, display: 'block' }}>Adresse</label>
                <input value={form.address} onChange={e => updateForm('address', e.target.value)} placeholder="Rue, quartier, N°" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#0C0B09', marginBottom: 6, display: 'block' }}>Téléphone pro</label>
                <input value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+212 5 00 00 00 00" type="tel" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#0C0B09', marginBottom: 6, display: 'block' }}>WhatsApp Business</label>
                <input value={form.whatsapp} onChange={e => updateForm('whatsapp', e.target.value)} placeholder="+212 6 00 00 00 00" type="tel" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#0C0B09', marginBottom: 6, display: 'block' }}>Site web</label>
              <input value={form.website} onChange={e => updateForm('website', e.target.value)} placeholder="https://moncommerce.ma" type="url" style={inputStyle} />
            </div>
          </div>

          {/* Categories */}
          <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8E0CC', padding: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0C0B09', marginBottom: 8 }}>Catégories d'activité *</h2>
            <p style={{ fontSize: 12, color: '#8A856E', marginBottom: 14 }}>Vous recevrez uniquement les demandes des catégories sélectionnées.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ALL_CATEGORIES.map(cat => {
                const active = form.categories.includes(cat.slug)
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => updateForm('categories', toggle(form.categories, cat.slug))}
                    style={{
                      padding: '7px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                      border: `1.5px solid ${active ? '#C9922A' : '#E8E0CC'}`,
                      background: active ? 'rgba(201,146,42,0.1)' : '#FFFFFF',
                      color: active ? '#C9922A' : '#8A856E',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    {cat.name}
                  </button>
                )
              })}
            </div>
            {form.categories.length > 0 && (
              <p style={{ fontSize: 12, color: '#C9922A', marginTop: 10, fontWeight: 600 }}>
                ✓ {form.categories.length} catégorie{form.categories.length > 1 ? 's' : ''} sélectionnée{form.categories.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Payment & Delivery */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8E0CC', padding: 20 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0C0B09', marginBottom: 14 }}>Modes de paiement</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PAYMENT_METHODS.map(p => {
                  const active = form.payment_methods.includes(p.slug)
                  return (
                    <button key={p.slug} type="button" onClick={() => updateForm('payment_methods', toggle(form.payment_methods, p.slug))}
                      style={{ padding: '8px 12px', borderRadius: 8, fontSize: 13, textAlign: 'left', border: `1px solid ${active ? '#C9922A' : '#E8E0CC'}`, background: active ? 'rgba(201,146,42,0.08)' : '#FFFFFF', color: active ? '#C9922A' : '#8A856E', cursor: 'pointer', transition: 'all 0.2s' }}>
                      {p.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8E0CC', padding: 20 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0C0B09', marginBottom: 14 }}>Options de livraison</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DELIVERY_OPTIONS.map(d => {
                  const active = form.delivery_options.includes(d.slug)
                  return (
                    <button key={d.slug} type="button" onClick={() => updateForm('delivery_options', toggle(form.delivery_options, d.slug))}
                      style={{ padding: '8px 12px', borderRadius: 8, fontSize: 13, textAlign: 'left', border: `1px solid ${active ? '#C9922A' : '#E8E0CC'}`, background: active ? 'rgba(201,146,42,0.08)' : '#FFFFFF', color: active ? '#C9922A' : '#8A856E', cursor: 'pointer', transition: 'all 0.2s' }}>
                      {d.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Return policy */}
          <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8E0CC', padding: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0C0B09', marginBottom: 8 }}>Politique de retour</h2>
            <textarea value={form.return_policy} onChange={e => updateForm('return_policy', e.target.value)} placeholder="Ex: Retours acceptés sous 7 jours après livraison. Article non utilisé, emballage d'origine requis..." rows={3} style={{ ...inputStyle, height: 'auto', resize: 'vertical' as const }} />
          </div>
        </div>
      )}

      {/* Tab: Hours */}
      {activeTab === 'hours' && (
        <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8E0CC', padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0C0B09', marginBottom: 20 }}>Horaires d'ouverture</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {DAYS.map(day => {
              const h = form.business_hours[day] || { open: '09:00', close: '18:00', closed: false }
              return (
                <div key={day} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: h.closed ? '#8A856E' : '#0C0B09' }}>{day}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                      <input type="checkbox" checked={h.closed} onChange={e => updateForm('business_hours', { ...form.business_hours, [day]: { ...h, closed: e.target.checked } })} style={{ width: 14, height: 14, accentColor: '#C9922A' }} />
                      Fermé
                    </label>
                    {!h.closed && (
                      <>
                        <input type="time" value={h.open} onChange={e => updateForm('business_hours', { ...form.business_hours, [day]: { ...h, open: e.target.value } })} style={{ ...inputStyle, width: 110, padding: '6px 10px' }} />
                        <span style={{ fontSize: 13, color: '#8A856E' }}>—</span>
                        <input type="time" value={h.close} onChange={e => updateForm('business_hours', { ...form.business_hours, [day]: { ...h, close: e.target.value } })} style={{ ...inputStyle, width: 110, padding: '6px 10px' }} />
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab: Preview */}
      {activeTab === 'preview' && (
        <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8E0CC', overflow: 'hidden' }}>
          {/* Cover */}
          <div style={{ height: 160, background: coverPreview ? `url(${coverPreview}) center/cover` : 'linear-gradient(135deg, #0C0B09, #1C1B16)', position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: -32, left: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: 14, background: logoPreview ? `url(${logoPreview}) center/cover` : 'linear-gradient(135deg, #8B6914, #C9922A)', border: '3px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#0C0B09' }}>
                {!logoPreview && form.business_name?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>
          <div style={{ padding: '40px 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0C0B09', marginBottom: 2 }}>{form.business_name || 'Nom de la boutique'}</h3>
                {form.slogan && <p style={{ fontSize: 13, color: '#8A856E', fontStyle: 'italic' }}>{form.slogan}</p>}
              </div>
              {form.verified && <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 100, background: '#D1FAE5', color: '#065F46', fontWeight: 700 }}>✓ Vérifié TABIT</span>}
            </div>
            {form.description && <p style={{ fontSize: 13, color: '#8A856E', lineHeight: 1.6, marginBottom: 14 }}>{form.description}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {form.city && <span style={{ fontSize: 12, color: '#8A856E', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {form.city}</span>}
              {form.phone && <span style={{ fontSize: 12, color: '#8A856E', display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={12} /> {form.phone}</span>}
              {form.website && <span style={{ fontSize: 12, color: '#C9922A', display: 'flex', alignItems: 'center', gap: 4 }}><Globe size={12} /> {form.website}</span>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {form.categories.slice(0, 5).map(c => {
                const cat = ALL_CATEGORIES.find(x => x.slug === c)
                return cat ? <span key={c} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 100, background: '#F5F2EA', color: '#8A856E' }}>{cat.name}</span> : null
              })}
            </div>
            {form.rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} style={{ color: i <= Math.round(form.rating) ? '#F59E0B' : '#E8E0CC', fill: i <= Math.round(form.rating) ? '#F59E0B' : 'none' }} />)}
                <span style={{ fontSize: 12, color: '#8A856E' }}>{form.rating}/5 ({form.total_ratings} avis)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Verification */}
      {activeTab === 'verification' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'linear-gradient(135deg, #0C0B09, #1C1B16)', borderRadius: 16, padding: 20, border: '1px solid rgba(201,146,42,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 13, color: '#8A856E', marginBottom: 2 }}>Niveau de vérification</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: '#C9922A' }}>{verificationCount}/4 étapes</p>
              </div>
              <Shield size={32} style={{ color: '#C9922A', opacity: 0.7 }} />
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)' }}>
              <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #C9922A, #E8B84B)', width: `${verificationCount * 25}%`, transition: 'width 0.5s' }} />
            </div>
          </div>

          {VERIFICATION_STEPS.map((step, i) => {
            const done = verificationStatus[step.key as keyof typeof verificationStatus]
            return (
              <div key={step.key} style={{ background: '#FFFFFF', borderRadius: 14, border: `1px solid ${done ? 'rgba(34,197,94,0.3)' : '#E8E0CC'}`, padding: 16, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: done ? '#D1FAE5' : '#F5F2EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {done ? <CheckCircle2 size={16} style={{ color: '#22C55E' }} /> : <Clock size={16} style={{ color: '#8A856E' }} />}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: done ? '#065F46' : '#0C0B09', marginBottom: 2 }}>{step.label}</p>
                  <p style={{ fontSize: 12, color: '#8A856E' }}>{step.desc}</p>
                  {!done && step.key === 'docs' && (
                    <button style={{ marginTop: 8, padding: '6px 14px', borderRadius: 8, background: 'rgba(201,146,42,0.1)', border: '1px solid rgba(201,146,42,0.3)', color: '#C9922A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      Soumettre mes documents →
                    </button>
                  )}
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: done ? '#22C55E' : '#8A856E', flexShrink: 0 }}>{done ? 'Complété' : 'En attente'}</span>
              </div>
            )
          })}

          <div style={{ background: '#FFF8E7', borderRadius: 14, border: '1px solid rgba(201,146,42,0.2)', padding: 16 }}>
            <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
              💡 <strong>Avantages d'un compte vérifié :</strong> badge "✓ Vérifié TABIT" sur votre profil, priorité dans les résultats, accès aux demandes exclusives, et taux d'acceptation multiplié par 2.8 en moyenne.
            </p>
          </div>
        </div>
      )}

      {/* Save button bottom */}
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 32px', borderRadius: 12,
            background: saved ? '#22C55E' : 'linear-gradient(135deg, #C9922A, #E8B84B)',
            color: '#0C0B09', fontWeight: 700, fontSize: 14,
            border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
            boxShadow: '0 4px 16px rgba(201,146,42,0.3)',
            transition: 'all 0.3s',
          }}
        >
          {saving ? '⏳ Enregistrement...' : saved ? '✅ Profil enregistré !' : '💾 Enregistrer le profil'}
        </button>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', height: 42, borderRadius: 10,
  border: '1px solid #E8E0CC', background: '#FAFAF7',
  padding: '0 14px', fontSize: 14, color: '#0C0B09',
  outline: 'none', transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}

