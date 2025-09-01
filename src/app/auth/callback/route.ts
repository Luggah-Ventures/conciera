import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/auth/sign-in?error=missing_code', url))
  }

  try {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      const e = encodeURIComponent(error.message)
      return NextResponse.redirect(new URL(`/auth/sign-in?error=${e}`, url))
    }

    return NextResponse.redirect(new URL('/dashboard', url))
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'callback_failed'
    return NextResponse.redirect(new URL(`/auth/sign-in?error=${encodeURIComponent(msg)}`, url))
  }
}
