'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function AcceptOfferButton({
  offerId, requestId, isBest,
}: {
  offerId: string
  requestId: string
  isBest?: boolean
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function acceptOffer() {
    if (!confirm('Accepter cette offre ? Les autres offres seront refusées.')) return
    setLoading(true)

    // Accept this offer
    await supabase.from('offers').update({ status: 'accepted' }).eq('id', offerId)

    // Reject others
    await supabase
      .from('offers')
      .update({ status: 'rejected' })
      .eq('request_id', requestId)
      .neq('id', offerId)

    // Update request status
    await supabase
      .from('requests')
      .update({ status: 'accepted' })
      .eq('id', requestId)

    toast.success('🎉 Offre acceptée ! Le commerçant a été notifié.')
    router.refresh()
  }

  return (
    <Button
      onClick={acceptOffer}
      loading={loading}
      variant={isBest ? 'gradient' : 'default'}
      size="sm"
    >
      <CheckCircle2 className="h-4 w-4" />
      Accepter cette offre
    </Button>
  )
}
