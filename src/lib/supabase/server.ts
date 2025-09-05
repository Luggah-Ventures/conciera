// src/lib/supabase/server.ts
import {
  createServerClient,
  type CookieMethodsServer,
  type CookieOptions as SupaCookieOptions,
} from '@supabase/ssr'
import { cookies } from 'next/headers'

type CookieOptions = SupaCookieOptions & {
  sameSite?: 'lax' | 'strict' | 'none'
}

function requireEnv(name: string) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
const key = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

/**
 * Use ONLY inside Server Actions or Route Handlers.
 * These contexts may MODIFY cookies in Next.js.
 */
export async function getSupabaseServerClientAction() {
  const store = await cookies()
  const cookieMethods = {
    get(name: string) {
      return store.get(name)?.value
    },
    set(name: string, value: string, options?: CookieOptions) {
      // ✅ Allowed here (Server Action / Route Handler)
      store.set({ name, value, ...(options ?? {}) })
    },
    remove(name: string, options?: CookieOptions) {
      // ✅ Allowed here (Server Action / Route Handler)
      store.set({ name, value: '', ...(options ?? {}) })
    },
  } as unknown as CookieMethodsServer

  return createServerClient(url, key, { cookies: cookieMethods })
}

/**
 * Use in Server Components (pages/layouts) during render.
 * DO NOT modify cookies here: set/remove are NO-OPs on purpose.
 */
export async function getSupabaseServerClientRSC() {
  const store = await cookies() // read-only in RSC
  const cookieMethods = {
    get(name: string) {
      return store.get(name)?.value
    },
    // ⛔ IMPORTANT: never call store.set here
    set() {
      /* no-op in Server Components */
    },
    remove() {
      /* no-op in Server Components */
    },
  } as unknown as CookieMethodsServer

  return createServerClient(url, key, { cookies: cookieMethods })
}
