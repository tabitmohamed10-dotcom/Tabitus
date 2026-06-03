/**
 * Tabit Matching Engine
 * Algorithme de scoring pour matcher demandes ↔ commerçants
 */

import type { BuyerRequest, MerchantProfile, MatchScore } from '@/lib/types'

interface ScoringWeights {
  category: number      // 35% — catégorie exacte = critique
  location: number      // 25% — proximité géographique
  budget: number        // 20% — budget dans la fourchette
  reputation: number    // 10% — rating + response_rate
  availability: number  // 10% — rapidité de réponse historique
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  category: 0.35,
  location: 0.25,
  budget: 0.20,
  reputation: 0.10,
  availability: 0.10,
}

/**
 * Score un commerçant face à une demande (0-100)
 */
export function scoreMerchantForRequest(
  merchant: MerchantProfile,
  request: BuyerRequest,
  weights = DEFAULT_WEIGHTS
): MatchScore {
  let total = 0
  const reasons: string[] = []

  // ── 1. Category match ──────────────────────────────────────────
  const categoryScore = computeCategoryScore(merchant, request)
  total += categoryScore * weights.category
  if (categoryScore > 0.8) reasons.push('Catégorie correspondante')
  if (categoryScore === 1) reasons.push('Spécialisé dans cette catégorie')

  // ── 2. Location proximity ──────────────────────────────────────
  const locationScore = computeLocationScore(merchant, request)
  total += locationScore * weights.location
  if (locationScore > 0.8) reasons.push('Même ville')
  else if (locationScore > 0.5) reasons.push('Région proche')

  // ── 3. Budget compatibility ────────────────────────────────────
  const budgetScore = computeBudgetScore(merchant, request)
  total += budgetScore * weights.budget
  if (budgetScore > 0.8) reasons.push('Budget compatible')

  // ── 4. Merchant reputation ─────────────────────────────────────
  const repScore = computeReputationScore(merchant)
  total += repScore * weights.reputation
  if (merchant.rating >= 4.5) reasons.push('Vendeur très bien noté')
  if (merchant.verified) reasons.push('Commerçant vérifié')

  // ── 5. Availability / responsiveness ──────────────────────────
  const availScore = computeAvailabilityScore(merchant)
  total += availScore * weights.availability
  if (merchant.response_rate >= 90) reasons.push('Répond rapidement')

  return {
    merchant_id: merchant.id,
    score: Math.round(total * 100),
    reasons,
  }
}

function computeCategoryScore(merchant: MerchantProfile, request: BuyerRequest): number {
  if (!merchant.categories?.length) return 0
  // Exact category match
  const requestCategorySlug = (request as any).category?.slug || ''
  if (merchant.categories.includes(requestCategorySlug)) return 1
  // Partial — parent category match would need tree lookup; return partial
  return 0.3
}

function computeLocationScore(merchant: MerchantProfile, request: BuyerRequest): number {
  if (merchant.city === request.city) return 1

  // Haversine distance if lat/lng available
  if (merchant.lat && merchant.lng && (request as any).lat && (request as any).lng) {
    const dist = haversineKm(
      merchant.lat, merchant.lng,
      (request as any).lat, (request as any).lng
    )
    if (dist <= 10) return 0.9
    if (dist <= 30) return 0.7
    if (dist <= 100) return 0.4
    if (dist <= 300) return 0.2
    return 0.05
  }

  // Country match fallback
  if (merchant.country === request.country) return 0.3
  return 0
}

function computeBudgetScore(merchant: MerchantProfile, request: BuyerRequest): number {
  // Without price history we use a heuristic based on merchant tier
  if (!request.budget_max) return 0.5 // no budget = neutral
  // In a real system: compare with merchant's historical offer prices
  // For MVP: assume compatible
  return 0.7
}

function computeReputationScore(merchant: MerchantProfile): number {
  let score = 0
  // Rating component (0–5 → 0–0.6)
  score += (merchant.rating / 5) * 0.6
  // Response rate (0–100 → 0–0.3)
  score += (merchant.response_rate / 100) * 0.3
  // Verified bonus
  if (merchant.verified) score += 0.1
  return Math.min(score, 1)
}

function computeAvailabilityScore(merchant: MerchantProfile): number {
  const rate = merchant.response_rate || 0
  if (rate >= 95) return 1
  if (rate >= 80) return 0.8
  if (rate >= 60) return 0.5
  if (rate >= 40) return 0.3
  return 0.1
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
const toRad = (deg: number) => (deg * Math.PI) / 180

/**
 * Trie et filtre les commerçants matchant une demande
 */
export function rankMerchantsForRequest(
  merchants: MerchantProfile[],
  request: BuyerRequest,
  topN = 20
): MatchScore[] {
  return merchants
    .map(m => scoreMerchantForRequest(m, request))
    .filter(s => s.score >= 25)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
}

/**
 * Server-side: fetch and rank merchants for a new request
 * Called from API route after request creation
 */
export async function matchMerchantsServerSide(
  requestId: string,
  supabaseAdmin: any
) {
  // Fetch request
  const { data: req } = await supabaseAdmin
    .from('requests')
    .select('*, category:categories(slug)')
    .eq('id', requestId)
    .single()
  if (!req) return []

  // Fetch active merchants
  const { data: merchants } = await supabaseAdmin
    .from('merchants')
    .select('*')
    .eq('active', true)
    .eq('suspended', false)

  if (!merchants?.length) return []

  const ranked = rankMerchantsForRequest(merchants, req, 30)
  const merchantIds = ranked.map(r => r.merchant_id)

  // Store matched_merchants on request
  await supabaseAdmin
    .from('requests')
    .update({ matched_merchants: merchantIds })
    .eq('id', requestId)

  // Notify top merchants
  const notifications = ranked.slice(0, 15).map(r => ({
    user_id: merchants.find((m: any) => m.id === r.merchant_id)?.user_id,
    title: '🎯 Nouvelle demande correspondante !',
    message: `Une demande dans votre secteur vient d'être publiée`,
    type: 'request_matched',
    data: { request_id: requestId, score: r.score },
    action_url: `/dashboard/merchant/requests`,
  })).filter(n => n.user_id)

  if (notifications.length) {
    await supabaseAdmin.from('notifications').insert(notifications)
  }

  return ranked
}
