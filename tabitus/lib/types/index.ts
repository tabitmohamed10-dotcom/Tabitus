export type UserRole = 'buyer' | 'merchant' | 'admin'
export type RequestStatus = 'open' | 'in_review' | 'accepted' | 'completed' | 'cancelled'
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn'
export type NotifType = 'offer_received' | 'offer_accepted' | 'offer_rejected' | 'request_matched' | 'new_message' | 'system' | 'payment'
export type MerchantTier = 'free' | 'starter' | 'pro' | 'enterprise'
export type Currency = 'MAD' | 'USD' | 'EUR' | 'GBP' | 'XOF' | 'SAR' | 'AED'

export interface Profile {
  id: string; email: string; full_name: string; avatar_url: string | null
  phone: string | null; role: UserRole; city: string | null; country: string
  locale: string; onboarded: boolean; active: boolean; created_at: string; updated_at: string
}
export interface Category {
  id: string; name: string; name_ar: string | null; name_en: string | null
  slug: string; icon: string; color: string; description: string | null
  parent_id: string | null; sort_order: number; active: boolean
}
export interface MerchantProfile {
  id: string; user_id: string; business_name: string; description: string | null
  logo_url: string | null; cover_url: string | null; address: string | null
  city: string; country: string; lat: number | null; lng: number | null
  categories: string[]; tier: MerchantTier; rating: number; total_ratings: number
  total_sales: number; total_offers: number; accepted_offers: number
  response_rate: number; avg_response_hours: number; verified: boolean
  active: boolean; suspended: boolean; created_at: string; updated_at: string
  user?: Profile
}
export interface BuyerRequest {
  id: string; buyer_id: string; title: string; description: string | null
  category_id: string; budget_min: number | null; budget_max: number | null
  currency: Currency; city: string; country: string; lat: number | null; lng: number | null
  deadline: string | null; urgent: boolean; delivery_needed: boolean
  image_url: string | null; video_url: string | null; status: RequestStatus
  offers_count: number; best_offer_price: number | null; views_count: number
  matched_merchants: string[]; expires_at: string; created_at: string; updated_at: string
  category?: Pick<Category, 'name' | 'icon' | 'color' | 'slug'>
  buyer?: Pick<Profile, 'full_name' | 'avatar_url'>
}
export interface Offer {
  id: string; request_id: string; merchant_id: string; price: number; currency: Currency
  delivery_days: number; delivery_fee: number; free_delivery: boolean; note: string | null
  image_url: string | null; status: OfferStatus; sponsored: boolean; viewed_by_buyer: boolean
  created_at: string; updated_at: string
  business_name?: string; merchant_logo?: string | null; merchant_rating?: number
  merchant_reviews?: number; merchant_verified?: boolean; merchant_city?: string; response_rate?: number
}
export interface Message {
  id: string; offer_id: string; sender_id: string; content: string; read: boolean; created_at: string
  sender?: Pick<Profile, 'full_name' | 'avatar_url' | 'role'>
}
export interface Notification {
  id: string; user_id: string; title: string; message: string; type: NotifType
  read: boolean; data: Record<string, any>; action_url: string | null; created_at: string
}
export interface Rating {
  id: string; request_id: string; offer_id: string; reviewer_id: string; reviewee_id: string
  score: 1 | 2 | 3 | 4 | 5; comment: string | null; reply: string | null; created_at: string
}
export interface Payment {
  id: string; offer_id: string; buyer_id: string; merchant_id: string; amount: number
  currency: Currency; stripe_payment_id: string | null; stripe_transfer_id: string | null
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded'
  commission_rate: number; commission_amount: number; net_amount: number; created_at: string
}
export interface BuyerStats {
  total_requests: number; open_requests: number; total_offers_received: number; accepted_deals: number
}
export interface MerchantStats {
  total_offers: number; accepted_offers: number; response_rate: number; estimated_revenue: number; rating: number
}
export interface MatchScore { merchant_id: string; score: number; reasons: string[] }
export interface ApiResponse<T = any> { data?: T; error?: string; message?: string }
export interface PaginatedResponse<T> { data: T[]; count: number; page: number; limit: number; hasMore: boolean }
export interface CreateRequestFormData {
  title: string; description?: string; category_id: string
  budget_min?: number; budget_max?: number; city: string
  deadline?: string; urgent: boolean; delivery_needed: boolean
}
export interface CreateOfferFormData {
  request_id: string; price: number; delivery_days: number; delivery_fee?: number; free_delivery: boolean; note?: string
}
