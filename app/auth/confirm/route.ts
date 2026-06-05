import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? ''

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type: type as any, token_hash })
    if (!error) {
      if (next) {
        return NextResponse.redirect(new URL(next, request.url))
      }
      // Determine redirect based on user role
      const { data: { user } } = await supabase.auth.getUser()
      const role = user?.user_metadata?.role
      const dest = role === 'merchant' ? '/dashboard/merchant' : '/dashboard/buyer'
      return NextResponse.redirect(new URL(dest, request.url))
    }
  }
  return NextResponse.redirect(new URL('/auth/error', request.url))
}
