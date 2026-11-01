"use server";

import {
  createClient,
  createClientWithServiceRoleKey,
} from "@/lib/supabase/server";

export const createEntreprise = async ({
  nomEntreprise,
  emailEntreprise,
  descriptionEntreprise,
  nomUtilisateur,
  posteUtilisateur,
  phoneUtilisateur,
}: any) => {
  if (
    !nomEntreprise?.trim() ||
    !emailEntreprise?.trim() ||
    !descriptionEntreprise?.trim() ||
    !nomUtilisateur?.trim() ||
    !posteUtilisateur?.trim() ||
    !phoneUtilisateur?.trim()
  ) {
    return {
      code: 400,
      message: "Veuillez remplir tous les champs obligatoires.",
    };
  }

  // On récupère l'utilisateur connecté avec le client normal (cookies)
  const supabaseUser = await createClient();
  const {
    data: { user },
    error,
  } = await supabaseUser.auth.getUser();

  // Puis on écrit avec le client admin
  const supabase = await createClientWithServiceRoleKey();

  if (error || !user) {
    console.log(error, "Erreur de recupération de l'utilisateur");
    return {
      code: 401,
      message: "Erreur de récupération de ID du user",
      success: false,
    };
  }

  // Le slug sert dans les identifiants des membres (ex : fanta@trabad)
  let slug = nomEntreprise
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]/g, "");
  if (!slug) slug = "entreprise";

  const { data: slugExiste } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (slugExiste) {
    slug = slug + Math.floor(Math.random() * 1000);
  }

  const { error: organisationError, data: organisationData } = await supabase
    .from("organizations")
    .insert({
      name: nomEntreprise,
      description: descriptionEntreprise,
      email: emailEntreprise,
      user_id: user.id,
      slug: slug,
    })
    .select()
    .single();

  if (organisationError) {
    console.log(organisationError, "Erreur de création de l'organisation");

    if (organisationError.code == "23505") {
      return {
        code: 23505,
        message: "Vous avez déjà une entreprise",
        success: false,
      };
    }

    return {
      code: 402,
      message: "Erreur de creation de l'organisation",
      success: false,
    };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    full_name: nomUtilisateur,
    email: emailEntreprise,
    phone: phoneUtilisateur,
    post: posteUtilisateur,
    organization_id: organisationData.id,
  });

  if (profileError) {
    console.log(profileError, "Erreur de création du profile");
    // on annule la création de l'entreprise
    await supabase.from("organizations").delete().eq("id", organisationData.id);
    return {
      code: 403,
      message: "Erreur de creation du profile",
      success: false,
    };
  }

  return {
    code: 200,
    message: "Entreprise et profile créé avec succès",
    success: true,
  };
};
