"use server";

import { createClient } from "@/lib/supabase/server";

export async function getcurrentUser() {
  const out = { email: null, avatar_url: null, fullName: null } as any;
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return {
      status: false,
      code: 500,
      message: "Erreur de recup de lùutilisateur",
    };
  }

  out.email = user?.email;
  out.fullName = user?.user_metadata?.name;
  out.avatar_url = user?.user_metadata?.avatar_url;

  return out;
}
