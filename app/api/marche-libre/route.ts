import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/marche-libre — public listing feed with filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category  = searchParams.get('category') || ''
  const city      = searchParams.get('city') || ''
  const condition = searchParams.get('condition') || ''
  const minPrice  = searchParams.get('min_price') || ''
  const maxPrice  = searchParams.get('max_price') || ''
  const sort      = searchParams.get('sort') || 'recent'
  const query     = searchParams.get('q') || ''
  const page      = parseInt(searchParams.get('page') || '1')
  const limit     = 24
  const offset    = (page - 1) * limit

  try {
    const supabase = await createClient()
    let q = supabase
      .from('marche_libre_listings')
      .select(`
        id, title, price, currency, city, condition, status,
        category_slug, thumbnail_url, images, views_count, favorites_count,
        price_negotiable, verified_seller, featured, created_at,
        seller:seller_id (full_name, avatar_url, role)
      `, { count: 'exact' })
      .eq('status', 'active')

    if (category)  q = q.eq('category_slug', category)
    if (city)      q = q.eq('city', city)
    if (condition) q = q.eq('condition', condition)
    if (minPrice)  q = q.gte('price', Number(minPrice))
    if (maxPrice)  q = q.lte('price', Number(maxPrice))
    if (query)     q = q.textSearch('title', query, { config: 'french' })

    switch (sort) {
      case 'price_asc':  q = q.order('price', { ascending: true }); break
      case 'price_desc': q = q.order('price', { ascending: false }); break
      case 'popular':    q = q.order('views_count', { ascending: false }); break
      default:           q = q.order('featured', { ascending: false }).order('created_at', { ascending: false })
    }

    const { data, error, count } = await q.range(offset, offset + limit - 1)
    if (error) throw error

    return NextResponse.json({ data: data || [], count: count || 0, page, limit, hasMore: (count || 0) > offset + limit })
  } catch {
    // Table may not exist yet — return empty
    return NextResponse.json({ data: [], count: 0, page, limit, hasMore: false })
  }
}

// POST /api/marche-libre — create listing (authenticated)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, description, price, category_slug, city, condition, images, contact_method, phone, price_negotiable } = body

    if (!title || !price || !city || !condition)
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const { data: merchant } = profile?.role === 'merchant'
      ? await supabase.from('merchants').select('verified').eq('user_id', user.id).single()
      : { data: null }

    const { data, error } = await supabase
      .from('marche_libre_listings')
      .insert({
        seller_id: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        price: Number(price),
        category_slug: category_slug || null,
        city: city.trim(),
        condition,
        images: images || [],
        thumbnail_url: images?.[0] || null,
        contact_method: contact_method || 'chat',
        phone: contact_method !== 'chat' ? phone : null,
        price_negotiable: price_negotiable ?? true,
        verified_seller: merchant?.verified || false,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 })
  }
}
