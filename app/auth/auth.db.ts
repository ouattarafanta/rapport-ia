"use server";

import { createClient } from "@/lib/supabase/server";

export async function getcurrentUser() {
  const out = {
    id: null,
    email: null,
    avatar_url: null,
    fullName: null,
    isAdmin: false,
  } as any;
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.log(error);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recup de lùutilisateur",
      },
    };
  }

  out.id = user?.id;
  out.email = user?.email;
  out.fullName = user?.user_metadata?.name;
  out.avatar_url = user?.user_metadata?.avatar_url;
  out.isAdmin = user?.app_metadata?.provider === "email" ? false : true;

  return out;
}

export async function signInWithIdentifiant(data: {
  identifiant: string;
  password: string;
}) {
  // 1. Vérifier que les informations sont fournies
  if (!data.identifiant?.trim() || !data.password) {
    return {
      success: false,
      code: 400,
      message: "Veuillez renseigner votre identifiant et votre mot de passe.",
    };
  }

  try {
    // 2. Créer le client Supabase
    const supabase = await createClient();

    // 3. Transformer l'identifiant en adresse e-mail interne
    const email = `${data.identifiant.trim()}.local.reportflow`;

    console.log(email, data);

    // 4. Tenter la connexion
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password: data.password,
    });

    // 5. Gérer les erreurs d'authentification
    if (error) {
      console.log(error);
      if (error.message === "Invalid login credentials") {
        return {
          success: false,
          code: 401,
          message: "Identifiant ou mot de passe incorrect.",
        };
      }

      return {
        success: false,
        code: 500,
        message: "Une erreur est survenue lors de la connexion.",
      };
    }

    // 6. Vérifier que l'utilisateur est bien authentifié
    if (!authData.user || !authData.session) {
      return {
        success: false,
        code: 401,
        message: "La connexion a échoué. Veuillez réessayer.",
      };
    }

    // 7. Retourner le résultat de la connexion
    return {
      success: true,
      code: 200,
      message: "Connexion réussie.",
      user: authData.user,
    };
  } catch (error) {
    // 8. Gérer les erreurs inattendues
    console.error("Erreur de connexion :", error);

    return {
      success: false,
      code: 500,
      message: "Une erreur inattendue est survenue.",
    };
  }
}
