import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main>
      <h1>Bienvenue sur ReportFlow</h1>

      <p>Vous êtes connecté.</p>

      <p>Email : {user.email}</p>
    </main>
  )
}