// src/lib/supabase/server.ts
import {
  createServerClient,
  type CookieOptions as SupaCookieOptions,
  type CookieMethodsServer,
} from '@supabase/ssr'
import { cookies } from 'next/headers'

type CookieOptions = SupaCookieOptions & {
  sameSite?: 'lax' | 'strict' | 'none'
}

export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars missing')

  // Next 15: cookies() is async
  const cookieStore = await cookies()

  const cookieMethods = {
    get(name: string) {
      // return raw value string or undefined
      return cookieStore.get(name)?.value
    },
    set(name: string, value: string, options?: CookieOptions) {
      cookieStore.set({ name, value, ...(options ?? {}) })
    },
    remove(name: string, options?: CookieOptions) {
      cookieStore.set({ name, value: '', ...(options ?? {}) })
    },
  } as unknown as CookieMethodsServer

  return createServerClient(url, key, {
    cookies: cookieMethods,
  })
}
