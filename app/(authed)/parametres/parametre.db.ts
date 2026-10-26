"use server";

import { getcurrentUser } from "@/app/auth/auth.db";
import { createClient } from "@/lib/supabase/server";

export async function getcurrentProfile() {
  const supabase = await createClient();

  const { id: user_id, error } = await getcurrentUser();

  if (error) {
    return error;
  }

  const { data, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, post, phone")
    .eq("id", user_id)
    .maybeSingle();

  if (profileError) {
    console.log(profileError);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recup du profile",
      },
    };
  }

  return data;
}

export async function updateProfile(datas: any) {
  const supabase = await createClient();

  const { id: user_id, error } = await getcurrentUser();

  if (error) {
    return error;
  }

  if (
    !user_id ||
    !datas?.full_name ||
    !datas?.phone ||
    !datas?.post ||
    !datas?.email
  ) {
    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recup du profile",
      },
    };
  }
  const { data, error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: datas.full_name,
      phone: datas.phone,
      post: datas.post,
      email: datas.email,
    })
    .eq("id", user_id)
    .maybeSingle();

  if (profileError) {
    console.log(profileError);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recup du profile",
      },
    };
  }

  return data;
}
