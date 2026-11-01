import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Peut être ignoré dans certains contextes serveur
          }
        },
      },
    }
  )
}



// Client "admin" : il ignore les règles de sécurité de la base (RLS).
// On ne l'utilise que côté serveur, et TOUJOURS en filtrant par
// l'utilisateur ou l'entreprise connecté(e).
// Pas de cookies ici : sinon Supabase utiliserait la session de l'utilisateur
// à la place de la clé service_role.
export async function createClientWithServiceRoleKey() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}
