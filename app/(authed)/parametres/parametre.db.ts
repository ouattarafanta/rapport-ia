"use server";

import { getcurrentUser } from "@/app/auth/auth.db";
import {
  createClient,
  createClientWithServiceRoleKey,
} from "@/lib/supabase/server";
import { formatIdentifiant } from "@/lib/utils";
import { getcurrentOrganization } from "../equipes/equipe.db";

const erreur = (message: string) => ({
  error: {
    status: false,
    code: 500,
    message,
  },
});

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

// Informations du compte : identifiant, rôle, service, entreprise
export async function getMonCompte() {
  const admin = await createClientWithServiceRoleKey();

  const { id: user_id, email, isAdmin, error } = await getcurrentUser();

  if (error) {
    return error;
  }

  const orga: any = await getcurrentOrganization();

  const { data: profile } = await admin
    .from("profiles")
    .select("service_id, created_at")
    .eq("id", user_id)
    .maybeSingle();

  let service = "";
  if (profile?.service_id) {
    const { data } = await admin
      .from("services")
      .select("name")
      .eq("id", profile.service_id)
      .maybeSingle();
    service = data?.name || "";
  }

  // Infos de l'entreprise visibles par tous (en lecture seule)
  let adminNom = "";
  let nbMembres = 0;
  let nbServices = 0;
  let creeLe = "";

  if (orga?.id) {
    const { data: orgaInfos } = await admin
      .from("organizations")
      .select("created_at")
      .eq("id", orga.id)
      .maybeSingle();
    creeLe = orgaInfos?.created_at || "";

    const { data: adminProfile } = await admin
      .from("profiles")
      .select("full_name")
      .eq("id", orga.user_id)
      .maybeSingle();
    adminNom = adminProfile?.full_name || "";

    const { count: membres } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orga.id);
    nbMembres = membres || 0;

    const { count: services } = await admin
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orga.id);
    nbServices = services || 0;
  }

  return {
    // les membres se connectent avec "prenom@entreprise", l'admin avec Google
    identifiant: isAdmin ? email : formatIdentifiant(email || ""),
    isAdmin,
    service,
    membreDepuis: profile?.created_at,
    entreprise: {
      name: orga?.name || "",
      email: orga?.email || "",
      description: orga?.description || "",
      slug: orga?.slug || "",
      adminNom,
      nbMembres,
      nbServices,
      creeLe,
    },
  };
}

// Modifier les informations de l'entreprise (admin uniquement)
export async function updateEntreprise(datas: any) {
  const admin = await createClientWithServiceRoleKey();

  const orga: any = await getcurrentOrganization();

  if (!orga?.id || !orga?.isAdmin) {
    return erreur("Accès réservé à l'administrateur");
  }

  if (!datas?.name?.trim() || !datas?.email?.trim()) {
    return erreur("Le nom et l'email de l'entreprise sont obligatoires");
  }

  const { error } = await admin
    .from("organizations")
    .update({
      name: datas.name.trim(),
      email: datas.email.trim(),
      description: datas.description,
    })
    .eq("id", orga.id);

  if (error) {
    console.log(error);
    return erreur("Erreur de modification de l'entreprise");
  }

  return { success: true };
}

// Changer son mot de passe (membres, connectés par identifiant)
export async function changePassword(datas: any) {
  const { isAdmin, error } = await getcurrentUser();

  if (error) {
    return error;
  }

  if (isAdmin) {
    return erreur("Vous vous connectez avec Google : pas de mot de passe ici");
  }

  if (!datas?.password || datas.password.length < 8) {
    return erreur("Le mot de passe doit contenir au moins 8 caractères");
  }

  if (datas.password != datas.confirm) {
    return erreur("Les deux mots de passe ne sont pas identiques");
  }

  // client "normal" : l'utilisateur ne peut changer que SON mot de passe
  const supabase = await createClient();
  const { error: passwordError } = await supabase.auth.updateUser({
    password: datas.password,
  });

  if (passwordError) {
    console.log(passwordError.code);
    if (passwordError.code == "same_password") {
      return erreur("Le nouveau mot de passe doit être différent de l'ancien");
    }
    return erreur("Erreur lors du changement de mot de passe");
  }

  return { success: true };
}
