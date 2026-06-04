import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/requests — list open requests (public feed)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')
  const category = searchParams.get('category')
  const limit = Number(searchParams.get('limit') || '20')
  const page = Number(searchParams.get('page') || '0')

  const supabase = await createClient()

  let query = supabase
    .from('v_request_feed')
    .select('*')
    .order('urgent', { ascending: false })
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (city) query = query.eq('city', city)
  if (category) query = query.eq('category_slug', category)

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data, count, page, limit })
}

// POST /api/requests — create a request (auth required)
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const { data, error } = await supabase
    .from('requests')
    .insert({ ...body, buyer_id: user.id })
    .select()
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
