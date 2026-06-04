import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('marche_libre_listings')
      .select(`
        *,
        seller:seller_id (id, full_name, avatar_url, role, city, created_at),
        merchant_profile:seller_id (
          merchants (business_name, verified, rating, total_ratings, logo_url)
        )
      `)
      .eq('id', id)
      .single()

    if (error || !data) return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 })

    // Increment view count (fire and forget)
    supabase.from('marche_libre_listings').update({ views_count: (data.views_count || 0) + 1 }).eq('id', id)

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { data, error } = await supabase
      .from('marche_libre_listings')
      .update(body)
      .eq('id', id)
      .eq('seller_id', user.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await supabase.from('marche_libre_listings').delete().eq('id', id).eq('seller_id', user.id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
