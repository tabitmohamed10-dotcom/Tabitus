import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Star, Clock, MapPin, Zap, Shield, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, Badge, Avatar, Separator } from '@/components/ui/index'
import { formatPrice, formatDate, formatTimeAgo, getStatusColor, getStatusLabel } from '@/lib/utils'
import { AcceptOfferButton } from '@/components/buyer/accept-offer-button'

export const dynamic = 'force-dynamic'

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: req }, { data: offers }] = await Promise.all([
    supabase.from('requests').select('*, category:categories(name,icon,color,slug)').eq('id', id).single(),
    supabase.from('v_offer_detail').select('*').eq('request_id', id).order('price', { ascending: true }),
  ])

  if (!req) notFound()
  if (req.buyer_id !== user.id) redirect('/dashboard/buyer')

  const acceptedOffer = offers?.find(o => o.status === 'accepted')
  const pendingOffers = offers?.filter(o => o.status === 'pending') || []

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Link href="/dashboard/buyer/requests" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: req.category?.color + '20' }}>
            {req.category?.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-display text-xl font-bold">{req.title}</h1>
              <Badge className={getStatusColor(req.status)}>{getStatusLabel(req.status)}</Badge>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
              <span>{req.category?.name}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{req.city}</span>
              <span>·</span>
              <span>{formatTimeAgo(req.created_at)}</span>
            </div>
            {req.description && <p className="text-sm text-muted-foreground mt-3">{req.description}</p>}
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              {req.budget_max && <div className="font-medium text-primary">💰 Budget: {formatPrice(req.budget_max)}</div>}
              {req.urgent && <Badge variant="urgent">⚡ Urgent</Badge>}
            </div>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="font-display text-lg font-bold mb-4">{offers?.length || 0} offre{(offers?.length || 0) > 1 ? 's' : ''} reçue{(offers?.length || 0) > 1 ? 's' : ''}</h2>

        {pendingOffers.length === 0 && !acceptedOffer && (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">⏳</div>
            <h3 className="font-display font-bold text-lg mb-2">En attente d'offres</h3>
            <p className="text-muted-foreground text-sm">Les commerçants alertés vont répondre bientôt.</p>
          </Card>
        )}

        <div className="space-y-4">
          {pendingOffers.map((offer, index) => (
            <Card key={offer.id} className={`p-6 ${index === 0 ? 'ring-2 ring-primary/20' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-bold">
                    {offer.business_name?.[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{offer.business_name}</span>
                      {offer.merchant_verified && <Badge variant="info" className="text-[10px]">Vérifié</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{offer.merchant_rating > 0 ? offer.merchant_rating : 'Nouveau'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{formatPrice(offer.price)}</p>
                  {offer.free_delivery && <Badge variant="success" className="text-[10px]">Livraison gratuite</Badge>}
                </div>
              </div>
              {offer.note && <div className="mt-4 bg-muted/50 rounded-xl p-4 text-sm">{offer.note}</div>}
              <div className="flex gap-3 mt-4">
                <AcceptOfferButton offerId={offer.id} requestId={id} isBest={index === 0} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
