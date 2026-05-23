import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/offers — merchant submits an offer
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: merchant } = await supabase
    .from('merchants').select('id').eq('user_id', user.id).single()

  if (!merchant) return NextResponse.json({ error: 'Merchant profile required' }, { status: 403 })

  const body = await request.json()
  const { request_id, price, delivery_days, free_delivery, note, delivery_fee } = body

  const { data, error } = await supabase
    .from('offers')
    .insert({
      request_id, merchant_id: merchant.id,
      price, delivery_days: delivery_days || 3,
      free_delivery: free_delivery || false,
      delivery_fee: delivery_fee || 0,
      note: note || null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Already offered on this request' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update merchant total_offers
  await supabase.rpc('increment', { table: 'merchants', column: 'total_offers', id: merchant.id })

  return NextResponse.json({ data }, { status: 201 })
}

// PATCH /api/offers — accept or reject
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { offer_id, status } = await request.json()
  if (!['accepted', 'rejected', 'withdrawn'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const { error } = await supabase
    .from('offers').update({ status }).eq('id', offer_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
