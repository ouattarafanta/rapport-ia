import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()

    // 1. Échanger le code Google contre une session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {

      // 2. Récupérer l'utilisateur connecté
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {

        // 3. Chercher le profil de l'utilisateur
        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single()

        // 4. Si une entreprise existe déjà
        if (profile?.organization_id) {
          return NextResponse.redirect(`${origin}/dashboard`)
        }

        // 5. Sinon, créer son entreprise
        return NextResponse.redirect(`${origin}/entreprise`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}