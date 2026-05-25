import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  ArrowLeft, Star, Clock, Truck, MessageSquare,
  CheckCircle2, MapPin, Calendar, Zap, Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card, CardContent, CardHeader, CardTitle,
  Badge, Avatar, Separator,
} from '@/components/ui/index'
import { formatPrice, formatDate, formatTimeAgo, getStatusColor, getStatusLabel } from '@/lib/utils'
import { AcceptOfferButton } from '@/components/buyer/accept-offer-button'

export const dynamic = 'force-dynamic'

interface Props {
  params: { id: string }
}

export default async function RequestDetailPage({ params }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: req }, { data: offers }] = await Promise.all([
    supabase
      .from('requests')
      .select('*, category:categories(name,icon,color,slug)')
      .eq('id', params.id)
      .single(),
    supabase
      .from('v_offer_detail')
      .select('*')
      .eq('request_id', params.id)
      .order('sponsored', { ascending: false })
      .order('price', { ascending: true }),
  ])

  if (!req) notFound()
  if (req.buyer_id !== user.id) redirect('/dashboard/buyer')

  const acceptedOffer = offers?.find(o => o.status === 'accepted')
  const pendingOffers = offers?.filter(o => o.status === 'pending') || []
  const bestOffer = pendingOffers[0]

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <Link
        href="/dashboard/buyer/requests"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à mes demandes
      </Link>

      {/* Request header */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: req.category?.color + '20' }}
          >
            {req.category?.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="font-display text-xl font-bold">{req.title}</h1>
                <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground flex-wrap">
                  <span>{req.category?.name}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{req.city}</span>
                  <span>·</span>
                  <span>{formatTimeAgo(req.created_at)}</span>
                </div>
              </div>
              <Badge className={getStatusColor(req.status)}>{getStatusLabel(req.status)}</Badge>
            </div>

            {req.description && (
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{req.description}</p>
            )}

            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              {(req.budget_min || req.budget_max) && (
                <div className="flex items-center gap-1.5 font-medium text-primary">
                  💰 Budget: {req.budget_min && req.budget_max
                    ? `${formatPrice(req.budget_min)} – ${formatPrice(req.budget_max)}`
                    : req.budget_max ? `Max ${formatPrice(req.budget_max)}` : `Min ${formatPrice(req.budget_min!)}`
                  }
                </div>
              )}
              {req.deadline && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Avant le {formatDate(req.deadline)}
                </div>
              )}
              {req.urgent && <Badge variant="urgent">⚡ Urgent</Badge>}
              {req.delivery_needed && (
                <Badge variant="info">🚚 Livraison souhaitée</Badge>
              )}
            </div>
          </div>
        </div>

        {req.image_url && (
          <img
            src={req.image_url}
            alt={req.title}
            className="mt-4 rounded-2xl max-h-64 object-cover w-full"
          />
        )}
      </Card>

      {/* Offers section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold">
            {offers?.length || 0} offre{(offers?.length || 0) > 1 ? 's' : ''} reçue{(offers?.length || 0) > 1 ? 's' : ''}
          </h2>
          {pendingOffers.length > 1 && (
            <Badge variant="info">Triées par prix croissant</Badge>
          )}
        </div>

        {/* Accepted offer */}
        {acceptedOffer && (
          <Card className="p-6 border-2 border-green-400 bg-green-50/50 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Offre acceptée</span>
            </div>
            <OfferCard offer={acceptedOffer} isAccepted />
          </Card>
        )}

        {/* Pending offers */}
        {pendingOffers.length === 0 && !acceptedOffer && (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">⏳</div>
            <h3 className="font-display font-bold text-lg mb-2">En attente d'offres</h3>
            <p className="text-muted-foreground text-sm">
              Les commerçants matchés avec votre demande ont été alertés.
              Les premières offres arrivent généralement en moins de 2 heures.
            </p>
          </Card>
        )}

        {pendingOffers.length > 0 && req.status !== 'accepted' && (
          <div className="space-y-4">
            {pendingOffers.map((offer, index) => (
              <Card
                key={offer.id}
                className={`p-6 ${index === 0 ? 'ring-2 ring-primary/20 border-primary/30' : ''}`}
              >
                {index === 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Meilleure offre</span>
                  </div>
                )}
                <OfferCard
                  offer={offer}
                  requestId={req.id}
                  isBest={index === 0}
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Offer Card ─────────────────────────────────────────────────
function OfferCard({ offer, requestId, isBest, isAccepted }: {
  offer: any
  requestId?: string
  isBest?: boolean
  isAccepted?: boolean
}) {
  return (
    <div className="space-y-4">
      {/* Merchant info */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {offer.merchant_logo ? (
              <img
                src={offer.merchant_logo}
                alt={offer.business_name}
                className="h-12 w-12 rounded-2xl object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-bold">
                {offer.business_name?.[0]}
              </div>
            )}
            {offer.merchant_verified && (
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                <Shield className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{offer.business_name}</span>
              {offer.merchant_verified && <Badge variant="info" className="text-[10px]">Vérifié</Badge>}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-sm text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{offer.merchant_rating > 0 ? offer.merchant_rating.toFixed(1) : 'Nouveau'}</span>
              {offer.merchant_reviews > 0 && (
                <span>({offer.merchant_reviews} avis)</span>
              )}
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />{offer.merchant_city}
              </span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <p className="text-2xl font-display font-bold text-primary">
            {formatPrice(offer.price, offer.currency)}
          </p>
          {offer.free_delivery ? (
            <Badge variant="success" className="mt-1 text-[10px]">Livraison gratuite</Badge>
          ) : offer.delivery_fee > 0 ? (
            <p className="text-xs text-muted-foreground mt-1">
              + {formatPrice(offer.delivery_fee)} livraison
            </p>
          ) : null}
        </div>
      </div>

      <Separator />

      {/* Details */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Livraison en {offer.delivery_days} jour{offer.delivery_days > 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>Répond à {offer.response_rate || 85}% des demandes</span>
        </div>
      </div>

      {offer.note && (
        <div className="bg-muted/50 rounded-xl p-4 text-sm">
          <p className="font-medium mb-1 text-muted-foreground">Note du vendeur :</p>
          <p>{offer.note}</p>
        </div>
      )}

      {/* Actions */}
      {!isAccepted && requestId && (
        <div className="flex gap-3 pt-2">
          <AcceptOfferButton offerId={offer.id} requestId={requestId} isBest={isBest} />
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4" />
            Négocier
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">{formatTimeAgo(offer.created_at)}</p>
    </div>
  )
}
