"use client"
import { createBrowserClient } from '@supabase/ssr'

export function createClientSide() {

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}


export async function getcurrentUser2(){
  const supabase = createClientSide()

  const user = await supabase.auth.getUser()
  return user

}