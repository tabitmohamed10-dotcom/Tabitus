'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatTimeAgo, formatPrice, getStatusColor, getStatusLabel } from '@/lib/utils'
import { Search, Filter, Clock, Zap, MapPin, TrendingUp, ChevronRight, Plus } from 'lucide-react'

const CATEGORY_FILTERS = [
  { slug: '', label: 'Toutes catégories', icon: '🌐' },
  { slug: 'electromenager', label: 'Électroménager', icon: '⚡' },
  { slug: 'informatique', label: 'Informatique', icon: '💻' },
  { slug: 'ameublement', label: 'Ameublement', icon: '🛋️' },
  { slug: 'automobile', label: 'Automobile', icon: '🚗' },
  { slug: 'btp', label: 'BTP', icon: '🏗️' },
  { slug: 'bijouterie', label: 'Bijouterie', icon: '💎' },
  { slug: 'mode', label: 'Mode', icon: '👔' },
  { slug: 'alimentaire', label: 'Alimentaire', icon: '🍽️' },
  { slug: 'services', label: 'Services', icon: '🔧' },
  { slug: 'b2b', label: 'B2B', icon: '🏢' },
]

const TIME_FILTERS = [
  { value: '', label: 'Toutes' },
  { value: 'urgent', label: '⚡ Urgentes' },
  { value: 'new', label: '🆕 Nouvelles (<30 min)' },
  { value: 'high_budget', label: '💰 Budget élevé (>10k MAD)' },
]

const MOCK_REQUESTS = [
  { id: '1', title: 'Réfrigérateur Samsung ou LG 500L minimum', description: 'Cherche réfrigérateur américain double portes, livraison Casablanca', category: { icon: '⚡', name: 'Électroménager', slug: 'electromenager' }, city: 'Casablanca', budget_min: 4000, budget_max: 8000, offers_count: 5, created_at: new Date(Date.now() - 1000*60*8).toISOString(), urgent: true, status: 'open' },
  { id: '2', title: 'MacBook Pro M3 ou M2 reconditionné', description: 'Besoin pour développement web, au moins 16Go RAM', category: { icon: '💻', name: 'Informatique', slug: 'informatique' }, city: 'Rabat', budget_min: 12000, budget_max: 18000, offers_count: 3, created_at: new Date(Date.now() - 1000*60*22).toISOString(), urgent: false, status: 'open' },
  { id: '3', title: 'Carrelage 60x60 pour 80m² — couleur gris anthracite', description: 'Travaux de rénovation appartement, incluant la pose si possible', category: { icon: '🏗️', name: 'BTP', slug: 'btp' }, city: 'Marrakech', budget_min: 8000, budget_max: 15000, offers_count: 7, created_at: new Date(Date.now() - 1000*60*45).toISOString(), urgent: false, status: 'open' },
  { id: '4', title: 'BMW Série 3 ou Classe C 2020-2022', description: 'Voiture occasion, kilométrage < 80 000 km, garantie', category: { icon: '🚗', name: 'Automobile', slug: 'automobile' }, city: 'Casablanca', budget_min: 200000, budget_max: 350000, offers_count: 2, created_at: new Date(Date.now() - 1000*60*90).toISOString(), urgent: true, status: 'open' },
  { id: '5', title: 'Costume de mariage sur mesure homme', description: 'Mariage dans 3 semaines, taille 48, couleur bleu marine', category: { icon: '👔', name: 'Mode', slug: 'mode' }, city: 'Fès', budget_min: 2000, budget_max: 5000, offers_count: 4, created_at: new Date(Date.now() - 1000*60*120).toISOString(), urgent: true, status: 'open' },
  { id: '6', title: '500 badges NFC personnalisés pour événement corporate', description: 'Logo entreprise, données encodées, livraison Casablanca sous 7j', category: { icon: '🏢', name: 'B2B', slug: 'b2b' }, city: 'Casablanca', budget_min: 5000, budget_max: 12000, offers_count: 1, created_at: new Date(Date.now() - 1000*60*180).toISOString(), urgent: false, status: 'open' },
  { id: '7', title: 'Canapé d\'angle en tissu — salon moderne', description: '3-4 places, couleurs neutres, livraison incluse', category: { icon: '🛋️', name: 'Ameublement', slug: 'ameublement' }, city: 'Agadir', budget_min: 3000, budget_max: 7000, offers_count: 6, created_at: new Date(Date.now() - 1000*60*240).toISOString(), urgent: false, status: 'open' },
  { id: '8', title: 'Bague en or 18 carats avec diamant', description: 'Pour fiançailles, environ 1 carat, certificat GIA', category: { icon: '💎', name: 'Bijouterie', slug: 'bijouterie' }, city: 'Casablanca', budget_min: 15000, budget_max: 30000, offers_count: 3, created_at: new Date(Date.now() - 1000*60*300).toISOString(), urgent: false, status: 'open' },
]

export default function FeedPage() {
  const [requests, setRequests] = useState<any[]>(MOCK_REQUESTS)
  const [profile, setProfile] = useState<any>(null)
  const [merchantCategories, setMerchantCategories] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [timeFilter, setTimeFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [newBadgeId, setNewBadgeId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(p)
      if (p?.role === 'merchant') {
        const { data: m } = await supabase.from('merchants').select('categories').eq('user_id', user.id).single()
        setMerchantCategories(m?.categories || [])
      }
      const { data: reqs } = await supabase
        .from('v_request_feed')
        .select('*')
        .eq('status', 'open')
        .order('urgent', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50)
      if (reqs && reqs.length > 0) setRequests(reqs)
    }
    load()

    const channel = supabase
      .channel('feed-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'requests' }, (payload) => {
        const nr = payload.new as any
        setRequests(prev => [nr, ...prev])
        setNewBadgeId(nr.id)
        setTimeout(() => setNewBadgeId(null), 8000)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const isMerchant = profile?.role === 'merchant'

  const filtered = requests.filter(r => {
    if (search && !r.title?.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter && r.category_slug !== categoryFilter && r.category?.slug !== categoryFilter) return false
    if (timeFilter === 'urgent' && !r.urgent) return false
    if (timeFilter === 'new' && Date.now() - new Date(r.created_at).getTime() > 30 * 60 * 1000) return false
    if (timeFilter === 'high_budget' && (r.budget_max || 0) < 10000) return false
    return true
  })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(20px,4vw,28px)', fontWeight: 700, color: '#0C0B09', marginBottom: 4 }}>
          Fil des demandes
        </h1>
        <p style={{ fontSize: 13, color: '#8A856E' }}>
          {filtered.length} demande{filtered.length !== 1 ? 's' : ''} ouvertes en temps réel
        </p>
      </div>

      {/* Search + Filters */}
      <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8A856E', width: 16, height: 16 }} />
          <input
            type="text"
            placeholder="Rechercher une demande..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', height: 44, borderRadius: 12,
              border: '1px solid #E8E0CC', background: '#FFFFFF',
              padding: '0 16px 0 42px', fontSize: 14, color: '#0C0B09',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="scrollbar-hide">
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f.slug}
              onClick={() => setCategoryFilter(f.slug)}
              style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500,
                border: '1px solid', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                background: categoryFilter === f.slug ? '#0C0B09' : '#FFFFFF',
                borderColor: categoryFilter === f.slug ? '#C9922A' : '#E8E0CC',
                color: categoryFilter === f.slug ? '#F0E8D4' : '#8A856E',
              }}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* Time filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TIME_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setTimeFilter(f.value)}
              style={{
                padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
                background: timeFilter === f.value ? 'rgba(201,146,42,0.1)' : '#FFFFFF',
                borderColor: timeFilter === f.value ? '#C9922A' : '#E8E0CC',
                color: timeFilter === f.value ? '#C9922A' : '#8A856E',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Buyer CTA */}
      {profile?.role === 'buyer' && (
        <Link href="/dashboard/buyer/requests/new" style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
          <div style={{
            background: 'linear-gradient(135deg, #8B6914, #C9922A)',
            borderRadius: 14, padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(201,146,42,0.3)',
          }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0C0B09', marginBottom: 2 }}>+ Publier une nouvelle demande</p>
              <p style={{ fontSize: 12, color: 'rgba(12,11,9,0.6)' }}>Recevez des offres en moins de 5 minutes</p>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus style={{ width: 20, height: 20, color: '#0C0B09' }} />
            </div>
          </div>
        </Link>
      )}

      {/* Feed */}
      <AnimatePresence initial={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8E0CC' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#0C0B09', marginBottom: 8 }}>Aucune demande trouvée</p>
              <p style={{ fontSize: 14, color: '#8A856E' }}>Essayez d'autres filtres ou vérifiez plus tard</p>
            </div>
          ) : filtered.map((req, i) => {
            const slug = req.category_slug || req.category?.slug || ''
            const isMyCategory = isMerchant && merchantCategories.includes(slug)
            const isNew = newBadgeId === req.id || (Date.now() - new Date(req.created_at).getTime() < 5 * 60 * 1000)
            const budget = req.budget_max
              ? `${req.budget_min ? req.budget_min.toLocaleString() + ' – ' : ''}${req.budget_max.toLocaleString()} MAD`
              : 'Budget non précisé'

            return (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i < 3 ? i * 0.05 : 0, type: 'spring', stiffness: 300, damping: 26 }}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: `1.5px solid ${isMyCategory ? '#C9922A' : '#E8E0CC'}`,
                  padding: 'clamp(14px,2vw,20px)',
                  boxShadow: isMyCategory ? '0 4px 16px rgba(201,146,42,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {isMyCategory && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #8B6914, #C9922A, #E8B84B)' }} />
                )}

                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  {/* Category icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: '#F5F2EA',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, flexShrink: 0,
                  }}>
                    {req.category?.icon || req.category_icon || '📦'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Badges row */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                      {isMyCategory && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: 'rgba(201,146,42,0.15)', color: '#C9922A', letterSpacing: '0.04em' }}>
                          ⭐ Ma catégorie
                        </span>
                      )}
                      {!isMyCategory && isMerchant && (
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: '#F5F2EA', color: '#8A856E' }}>
                          Hors domaine
                        </span>
                      )}
                      {req.urgent && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: '#FEF3C7', color: '#92400E', letterSpacing: '0.02em' }}>
                          ⚡ URGENT
                        </span>
                      )}
                      {isNew && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: '#D1FAE5', color: '#065F46', animation: 'pulse 1.5s infinite' }}>
                          🆕 NOUVEAU
                        </span>
                      )}
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: '#F5F2EA', color: '#8A856E' }}>
                        {req.category?.name || req.category_name || 'Général'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: 'clamp(13px,2vw,15px)', fontWeight: 600, color: '#0C0B09', marginBottom: 4, lineHeight: 1.35 }}>
                      {req.title}
                    </h3>
                    {req.description && (
                      <p style={{ fontSize: 13, color: '#8A856E', marginBottom: 8, lineHeight: 1.5,
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {req.description}
                      </p>
                    )}

                    {/* Meta row */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: 12, color: '#8A856E' }}>
                      <span>📍 {req.city}</span>
                      <span>💰 {budget}</span>
                      <span>🕐 {formatTimeAgo(req.created_at)}</span>
                      {(req.offers_count || 0) > 0 && (
                        <span style={{ color: '#C9922A', fontWeight: 600 }}>
                          {req.offers_count} offre{(req.offers_count || 0) !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action button */}
                  <div style={{ flexShrink: 0 }}>
                    {isMerchant ? (
                      <Link
                        href={`/dashboard/merchant/requests?highlight=${req.id}`}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '8px 14px', borderRadius: 10,
                          background: isMyCategory ? 'linear-gradient(135deg, #C9922A, #E8B84B)' : '#F5F2EA',
                          color: isMyCategory ? '#0C0B09' : '#8A856E',
                          fontWeight: 700, fontSize: 12, textDecoration: 'none',
                          boxShadow: isMyCategory ? '0 2px 8px rgba(201,146,42,0.3)' : 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Faire offre <ChevronRight style={{ width: 14, height: 14 }} />
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/buyer/requests/${req.id}`}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '8px 14px', borderRadius: 10,
                          background: '#F5F2EA', color: '#8A856E',
                          fontWeight: 600, fontSize: 12, textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Voir offres <ChevronRight style={{ width: 14, height: 14 }} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </AnimatePresence>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}`}</style>
    </div>
  )
}
