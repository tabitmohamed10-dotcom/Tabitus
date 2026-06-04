'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type {
  Profile, BuyerRequest, Offer, Notification,
  MerchantProfile, BuyerStats, MerchantStats,
} from '@/lib/types'

// ── useProfile ──────────────────────────────────────────────────
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  return { profile, loading }
}

// ── useRequests (buyer) ─────────────────────────────────────────
export function useMyRequests() {
  const [requests, setRequests] = useState<BuyerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('requests')
      .select('*, category:categories(name,icon,color,slug)')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false })
    setRequests(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])
  return { requests, loading, refetch: load }
}

// ── useRequest (single) ─────────────────────────────────────────
export function useRequest(id: string) {
  const [request, setRequest] = useState<BuyerRequest | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: req } = await supabase
        .from('requests')
        .select('*, category:categories(name,icon,color), buyer:profiles(full_name,avatar_url)')
        .eq('id', id)
        .single()
      setRequest(req)

      // Try view first, fall back to direct table join
      let { data: offs, error: viewErr } = await supabase
        .from('v_offer_detail')
        .select('*')
        .eq('request_id', id)
        .order('price', { ascending: true })

      if (viewErr || !offs) {
        const { data: directOffs } = await supabase
          .from('offers')
          .select('*, merchant:merchants(business_name, rating, verified, user_id)')
          .eq('request_id', id)
          .order('price', { ascending: true })
        offs = (directOffs || []).map((o: any) => ({
          ...o,
          business_name: o.merchant?.business_name || 'Commerçant',
          merchant_rating: o.merchant?.rating || 0,
          merchant_verified: o.merchant?.verified || false,
        }))
      }

      setOffers(offs || [])
      setLoading(false)
    }
    load()

    // Realtime: on INSERT add immediately + reload for full merchant details
    const channel = supabase
      .channel(`request-offers-${id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'offers', filter: `request_id=eq.${id}`,
      }, (payload) => {
        const newOffer = payload.new as any
        setOffers(prev => {
          if (prev.find((o: any) => o.id === newOffer.id)) return prev
          return [...prev, { ...newOffer, business_name: 'Commerçant', merchant_rating: 0, merchant_verified: false }]
        })
        // Reload to get merchant details
        load()
      })
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'offers', filter: `request_id=eq.${id}`,
      }, () => load())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id])

  return { request, offers, loading }
}

// ── useOpenRequests (merchant feed) ────────────────────────────
export function useOpenRequests(filters?: {
  category?: string
  city?: string
  budget_max?: number
}) {
  const [requests, setRequests] = useState<BuyerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      let q = supabase
        .from('v_request_feed')
        .select('*')
        .order('urgent', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50)

      if (filters?.city) q = q.eq('city', filters.city)
      if (filters?.budget_max) q = q.lte('budget_max', filters.budget_max)
      if (filters?.category) q = q.eq('category_slug', filters.category)

      const { data } = await q
      setRequests(data || [])
      setLoading(false)
    }
    load()
  }, [filters?.category, filters?.city, filters?.budget_max])

  return { requests, loading }
}

// ── useMerchantOffers ───────────────────────────────────────────
export function useMerchantOffers() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: merchant } = await supabase
        .from('merchants').select('id').eq('user_id', user.id).single()
      if (!merchant) return

      const { data } = await supabase
        .from('offers')
        .select('*, request:requests(title,budget_max,city,deadline,status,category:categories(name,icon))')
        .eq('merchant_id', merchant.id)
        .order('created_at', { ascending: false })
      setOffers(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return { offers, loading }
}

// ── useNotifications ────────────────────────────────────────────
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30)
      setNotifications(data || [])
      setUnread((data || []).filter(n => !n.read).length)
    }
    load()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      const channel = supabase
        .channel('notifications')
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev])
          setUnread(prev => prev + 1)
        })
        .subscribe()
      return () => { supabase.removeChannel(channel) }
    })
  }, [])

  const markAllRead = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnread(0)
  }, [])

  return { notifications, unread, markAllRead }
}

// ── useBuyerStats ───────────────────────────────────────────────
export function useBuyerStats(): { stats: BuyerStats; loading: boolean } {
  const [stats, setStats] = useState<BuyerStats>({
    total_requests: 0, open_requests: 0,
    total_offers_received: 0, accepted_deals: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: reqs } = await supabase
        .from('requests')
        .select('id, status, offers_count')
        .eq('buyer_id', user.id)
      if (reqs) {
        setStats({
          total_requests: reqs.length,
          open_requests: reqs.filter(r => r.status === 'open').length,
          total_offers_received: reqs.reduce((s, r) => s + (r.offers_count || 0), 0),
          accepted_deals: reqs.filter(r => r.status === 'accepted' || r.status === 'completed').length,
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  return { stats, loading }
}

// ── useMerchantStats ────────────────────────────────────────────
export function useMerchantStats(): { stats: MerchantStats; loading: boolean } {
  const [stats, setStats] = useState<MerchantStats>({
    total_offers: 0, accepted_offers: 0,
    response_rate: 0, estimated_revenue: 0, rating: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: m } = await supabase
        .from('merchants')
        .select('total_offers,accepted_offers,response_rate,rating,total_sales')
        .eq('user_id', user.id)
        .single()
      if (m) {
        setStats({
          total_offers: m.total_offers,
          accepted_offers: m.accepted_offers,
          response_rate: m.response_rate,
          estimated_revenue: m.accepted_offers * 450, // placeholder avg
          rating: m.rating,
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  return { stats, loading }
}
