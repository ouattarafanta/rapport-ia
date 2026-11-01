"use server";

import { getcurrentUser } from "@/app/auth/auth.db";
import { createClientWithServiceRoleKey } from "@/lib/supabase/server";
import { formatIdentifiant } from "@/lib/utils";

const erreur = (message: string) => ({
  error: {
    status: false,
    code: 500,
    message,
  },
});

// Retourne l'entreprise de l'utilisateur connecté
// (qu'il en soit l'administrateur ou un simple membre)
export async function getcurrentOrganization() {
  const supabase = await createClientWithServiceRoleKey();

  const { id: user_id, error } = await getcurrentUser();

  if (error) {
    console.log(error);
    return error;
  }

  // cas admin : c'est lui qui a créé l'entreprise
  const { data, error: orgaError } = await supabase
    .from("organizations")
    .select("id, name, email, description, user_id, slug")
    .eq("user_id", user_id)
    .maybeSingle();

  if (orgaError) {
    console.log(orgaError);
    return erreur("Erreur de recup de l'organisation");
  }

  if (data) {
    return { ...data, isAdmin: true };
  }

  // cas membre : on passe par son profil
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user_id)
    .maybeSingle();

  if (!profile?.organization_id) {
    return null;
  }

  const { data: orga } = await supabase
    .from("organizations")
    .select("id, name, email, description, user_id, slug")
    .eq("id", profile.organization_id)
    .maybeSingle();

  if (!orga) {
    return null;
  }

  return { ...orga, isAdmin: false };
}

// Retourne l'entreprise seulement si l'utilisateur connecté en est l'admin
async function getAdminOrganization() {
  const orga: any = await getcurrentOrganization();

  if (!orga?.id || !orga?.isAdmin) {
    return null;
  }

  return orga;
}

// Vérifie qu'un profil appartient bien à l'entreprise
async function isInOrganization(profile_id: string, orga_id: string) {
  const supabase = await createClientWithServiceRoleKey();

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", profile_id)
    .eq("organization_id", orga_id)
    .maybeSingle();

  return data ? true : false;
}

export async function getcurrentProfiles() {
  const supabase = await createClientWithServiceRoleKey();

  const orga: any = await getcurrentOrganization();

  if (!orga?.id) {
    return erreur("Erreur de recup du profile");
  }

  const { data: datas, error: profileErrors } = await supabase
    .from("profiles")
    .select("id, email, full_name, post, phone")
    .eq("organization_id", orga.id);

  if (profileErrors) {
    console.log(profileErrors);
    return erreur("Erreur de recup du profile");
  }

  return datas;
}

export async function getcurrentUsers() {
  const supabase = await createClientWithServiceRoleKey();

  const currentOrga = await getAdminOrganization();

  if (!currentOrga) {
    return erreur("Accès réservé à l'administrateur");
  }

  const currentOrgaSlug = currentOrga.slug + ".local.reportflow";

  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers({ perPage: 1000 });

  if (error) {
    console.log(error);
    return erreur("Erreur de recupération des utilisateurs");
  }

  const { data: datas, error: profileErrors } = await supabase
    .from("profiles")
    .select("id, email, full_name, post, phone, organization_id, service_id")
    .eq("organization_id", currentOrga.id);

  if (profileErrors) {
    console.log(profileErrors);
    return erreur("Erreur de recupération du profile");
  }

  const { data: services } = await supabase
    .from("services")
    .select("id, name")
    .eq("organization_id", currentOrga.id);

  const out = users
    .map((user) => {
      const profile = datas.find((el) => el.id == user.id);
      const service = services?.find((el) => el.id == profile?.service_id);
      return {
        ...user,
        ...profile,
        service_name: service?.name || "",
        identifiant: formatIdentifiant(user.email || ""),
        user_mail: user.email,
      };
    })
    .filter((el) => el.user_mail?.split("@")?.[1] == currentOrgaSlug);

  return out;
}

export async function getOrgaUser(id: string) {
  if (!id) return {};

  const supabase = await createClientWithServiceRoleKey();

  const currentOrga = await getAdminOrganization();

  if (!currentOrga || !(await isInOrganization(id, currentOrga.id))) {
    return erreur("Utilisateur introuvable");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.admin.getUserById(id);

  if (error) {
    console.log(error);
    return erreur("Utilisateur introuvable");
  }

  const { data: data, error: profileErrors } = await supabase
    .from("profiles")
    .select("id, email, full_name, post, phone, organization_id, service_id")
    .eq("id", id)
    .maybeSingle();

  if (profileErrors) {
    console.log(profileErrors);
    return erreur("Erreur de recupération du profile");
  }

  const out = {
    ...data,
    service_id: data?.service_id || "",
    password: "",
    identifiant: formatIdentifiant(user?.email || ""),
    user_mail: user?.email,
  };

  return out;
}

export async function createUser(datas: { email: string; password: string }) {
  const supabase = await createClientWithServiceRoleKey();

  if (!datas?.email || !datas?.password) {
    console.log("email ou password non fourni");
    return erreur("Erreur de creation de profile");
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: datas.email,
    password: datas.password,
    email_confirm: true,
  });

  if (error?.code == "email_exists") {
    return erreur("Cet identifiant existe déjà");
  }

  if (error || !data) {
    console.log(error?.code);
    return erreur("Erreur de creation de profile");
  }

  return data as any;
}

export async function createProfile(data: any) {
  const supabase = await createClientWithServiceRoleKey();

  const orga = await getAdminOrganization();

  if (!orga?.slug) {
    return erreur("Accès réservé à l'administrateur");
  }

  if (
    !data?.full_name ||
    !data?.user_mail ||
    !data?.phone ||
    !data?.post ||
    !data?.password ||
    !data?.email
  ) {
    return erreur("Veuillez remplir tous les champs");
  }

  if (data.password.length < 8) {
    return erreur("Le mot de passe doit contenir au moins 8 caractères");
  }

  const identifiant = data.user_mail + "@" + orga.slug + ".local.reportflow";

  const new_basic_user = await createUser({
    email: identifiant,
    password: data.password,
  });

  if (!new_basic_user?.user?.id) {
    return new_basic_user?.error
      ? new_basic_user
      : erreur("Erreur de création de profile");
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: new_basic_user.user.id,
    organization_id: orga.id,
    service_id: data.service_id || null,
    full_name: data.full_name,
    phone: data.phone,
    post: data.post,
    email: data.email,
  });

  if (profileError) {
    console.log(profileError);
    // on supprime le compte créé pour ne pas laisser un compte sans profil
    await supabase.auth.admin.deleteUser(new_basic_user.user.id);
    return erreur("Erreur de création du profile");
  }

  return { success: true };
}

export async function updateProfile(data: any) {
  const supabase = await createClientWithServiceRoleKey();

  const orga = await getAdminOrganization();

  if (!orga) {
    return erreur("Accès réservé à l'administrateur");
  }

  if (!data?.full_name || !data?.id) {
    return erreur("Veuillez remplir tous les champs");
  }

  if (!(await isInOrganization(data.id, orga.id))) {
    return erreur("Utilisateur introuvable");
  }

  if (data?.password?.trim()) {
    const newPassword = data.password.trim();

    if (newPassword.length < 8) {
      return erreur("Le mot de passe doit contenir au moins 8 caractères");
    }

    const { error } = await supabase.auth.admin.updateUserById(data.id, {
      password: newPassword,
    });

    if (error) {
      console.error("Erreur lors de la modification :", error.message);
      return erreur("Erreur lors de la modification du mot de passe");
    }
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      phone: data.phone,
      post: data.post,
      email: data.email,
      service_id: data.service_id || null,
    })
    .eq("id", data.id)
    .eq("organization_id", orga.id);

  if (profileError) {
    console.log(profileError);
    return erreur("Erreur de modification du profile");
  }

  return { success: true };
}

export async function deleteUser(id: string) {
  if (!id) {
    return erreur("Erreur de suppression");
  }

  const orga = await getAdminOrganization();

  if (!orga) {
    return erreur("Accès réservé à l'administrateur");
  }

  if (id == orga.user_id) {
    return erreur("Vous ne pouvez pas supprimer l'administrateur");
  }

  if (!(await isInOrganization(id, orga.id))) {
    return erreur("Utilisateur introuvable");
  }

  const supabase = await createClientWithServiceRoleKey();

  // On supprime d'abord ses tâches et son profil, puis son compte
  await supabase.from("tasks").delete().eq("profile_id", id);
  await supabase.from("profiles").delete().eq("id", id);

  const { error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    console.log(error);
    return erreur("Erreur de suppression");
  }

  return { success: true };
}
