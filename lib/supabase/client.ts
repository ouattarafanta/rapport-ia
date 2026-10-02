import { createBrowserClient } from '@supabase/ssr'

export function createClientSide() {

  console.log(
    'SUPABASE URL:',
    process.env.NEXT_PUBLIC_SUPABASE_URL
  )

  console.log(
    'SUPABASE KEY présente:',
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}