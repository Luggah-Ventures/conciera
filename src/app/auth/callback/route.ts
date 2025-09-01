import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  if (!code) {
    // No code in query: redirect back with a helpful error
    return NextResponse.redirect(new URL('/auth/sign-in?error=missing_code', url))
  }

  try {
    const supabase = await getSupabaseServerClient() // IMPORTANT: await the helper
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // Forward the message so you can see what Supabase said
      const e = encodeURIComponent(error.message)
      return NextResponse.redirect(new URL(`/auth/sign-in?error=${e}`, url))
    }

    // Success: you’re signed in
    return NextResponse.redirect(new URL('/dashboard', url))
  } catch (e: any) {
    // Avoid 500 loops—bounce with a readable error
    const msg = encodeURIComponent(e?.message ?? 'callback_failed')
    return NextResponse.redirect(new URL(`/auth/sign-in?error=${msg}`, url))
  }
}
