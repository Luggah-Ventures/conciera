// no "use client"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars missing')

  // ✅ Next.js 15: must await cookies()
  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) =>
        cookieStore.set({ name, value, ...options }),
      remove: (name: string, options: any) => cookieStore.set({ name, value: '', ...options }),
    },
  })
}
