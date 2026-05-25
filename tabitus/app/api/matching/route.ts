import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { matchMerchantsServerSide } from '@/lib/matching/engine'

export async function POST(request: NextRequest) {
  try {
    const { request_id } = await request.json()
    if (!request_id) {
      return NextResponse.json({ error: 'request_id required' }, { status: 400 })
    }

    const supabaseAdmin = await createAdminClient()
    const ranked = await matchMerchantsServerSide(request_id, supabaseAdmin)

    return NextResponse.json({ success: true, matched: ranked.length })
  } catch (error) {
    console.error('Matching error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
