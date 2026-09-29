'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Erreur de connexion Google :', error.message)
    }
  }

  return (
    <main className="login-container">
      <div className="login-card">
        <h1>Bienvenue sur Rappot-IA</h1>

        <p>Connectez-vous pour continuer</p>

        <button
          className="google-button"
          onClick={handleGoogleLogin}
        >
          Se connecter avec Google
        </button>
      </div>
    </main>
  )
}