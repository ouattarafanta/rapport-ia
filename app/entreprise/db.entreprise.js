"use server";

import { createClient, createClientWithSecretKey } from "@/lib/supabase/server";
import { Console } from "console";

export const createEntreprise = async ({
  nomEntreprise,
  emailEntreprise,
  descriptionEntreprise,
  nomUtilisateur,
  posteUtilisateur,
  phoneUtilisateur,
}) => {
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

  const supabase = await createClientWithSecretKey();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.log(error, "Erreur de recupération de l'utilisateur");
    return {
      code: 401,
      message: "Erreur de récupération de ID du user",
      success: false,
    };
  }

  const { error: organisationError, data: organisationData } = await supabase
    .from("organizations")
    .insert({
      name: nomEntreprise,
      description: descriptionEntreprise,
      email: emailEntreprise,
      user_id: user.id,
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
