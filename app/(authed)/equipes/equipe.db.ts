"use server";

import { getcurrentUser } from "@/app/auth/auth.db";
import {
  createClient,
  createClientWithServiceRoleKey,
} from "@/lib/supabase/server";
import { formatIdentifiant } from "@/lib/utils";
import { profile } from "console";

export async function getcurrentProfiles() {
  const supabase = await createClient();

  const { id: user_id, error } = await getcurrentUser();

  if (error) {
    return error;
  }

  const { data: datas, error: profileErrors } = await supabase
    .from("profiles")
    .select("id, email, full_name, post, phone");

  if (profileErrors) {
    console.log(profileErrors);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recup du profile",
      },
    };
  }

  return datas;
}

export async function getcurrentUsers() {
  const supabase = await createClientWithServiceRoleKey();

  const currentOrga = await getcurrentOrganization();

  const currentOrgaId = currentOrga?.id;
  const currentOrgaSlug = currentOrga?.slug + ".local.reportflow";

  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  if (error || !currentOrgaId) {
    console.log(error);
    return error;
  }

  const { data: datas, error: profileErrors } = await supabase
    .from("profiles")
    .select("id, email, full_name, post, phone, organization_id");

  if (profileErrors) {
    console.log(profileErrors);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recupération du profile",
      },
    };
  }

  const out = users
    .map((user) => {
      const profile = datas.find((el) => el.id == user.id);
      console.log(user?.email?.split("@")?.[1], currentOrgaSlug);
      return {
        ...user,
        ...profile,
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

  const currentOrga = await getcurrentOrganization();

  const currentOrgaId = currentOrga?.id;
  const currentOrgaSlug = currentOrga?.slug + ".local.reportflow";

  // const {
  //   data: { users },
  //   error,
  // } = await supabase.auth.admin.listUsers();

  const {
    data: { user },
    error,
  } = await supabase.auth.admin.getUserById(id);

  console.log(user);

  if (error || !currentOrgaId) {
    console.log(error);
    return error;
  }

  const { data: data, error: profileErrors } = await supabase
    .from("profiles")
    .select("id, email, full_name, post, phone, organization_id")
    .eq("id", user?.id)
    .maybeSingle();

  if (profileErrors) {
    console.log(profileErrors);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recupération du profile",
      },
    };
  }

  const out = {
    ...user,
    ...data,
    identifiant: formatIdentifiant(user?.email || ""),
    user_mail: user?.email,
  };

  return out;
}

export async function getcurrentOrganization() {
  const supabase = await createClient();

  const { id: user_id, error } = await getcurrentUser();

  // console.log(user_id, 'user_id')

  if (error) {
    console.log(error);
    return error;
  }

  const { data, error: orgaError } = await supabase
    .from("organizations")
    .select("id, email, description, user_id, slug")
    .eq("user_id", user_id)
    .maybeSingle();

  if (orgaError) {
    console.log(orgaError);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recup de l'organisation",
      },
    };
  }

  return data;
}

export async function createUser(datas: { email: string; password: string }) {
  const supabase = await createClientWithServiceRoleKey();

  if (!datas?.email || !datas?.password) {
    console.log("email ou password non fourni");
    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de creation de profile",
      },
    };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: datas.email,
    password: datas.email,
  });

  if (error?.code == "email_exists") {
  }

  if (error || !data) {
    console.log(error?.code, "");
    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de creation de profile",
      },
    };
  }

  return data as any;
}

export async function createProfile(data: any) {
  const supabase = await createClient();

  const { id: orga_id, slug, error } = await getcurrentOrganization();

  // console.log(slug, 'slug')

  if (error || !slug) {
    console.log(error);
    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de creation d'organisation",
      },
    };
  }

  if (
    !orga_id ||
    !data?.full_name ||
    !data?.user_mail ||
    !data?.phone ||
    !data?.post ||
    !slug ||
    !data?.password ||
    !data?.email
  ) {
    console.log("parametres incomplet", slug, orga_id, data);
    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de création de profile",
      },
    };
  }

  const identifiant = data.user_mail + "@" + slug + ".local.reportflow";

  // console.log(identifiant, data)

  const new_basic_user = await createUser({
    email: identifiant,
    password: data.password,
  });

  if (!new_basic_user) {
    console.log("le new_user_id n'exist pas");
    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de création de profile",
      },
    };
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: new_basic_user?.user?.id,
      organization_id: orga_id,
      full_name: data.full_name,
      phone: data.phone,
      post: data.post,
      email: data.email,
    });

  if (profileError) {
    console.log(profileError);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recupération du profile",
      },
    };
  }

  const { data: datas, error: profileErrors } = await supabase
    .from("profiles")
    .select("id, email, full_name, post, phone");

  if (profileErrors) {
    console.log(profileErrors);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recupération du profile",
      },
    };
  }

  return datas as any;
}

export async function updateProfile(data: any) {
  const supabase = await createClientWithServiceRoleKey();


  if (!data?.full_name || !data?.user_mail || !data?.id) {
    console.log("parametres incomplet", data);
    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de création de profile",
      },
    };
  }

  if (data?.password?.trim()) {
    const newPassword = data?.password?.trim();
    console.log(newPassword, 'newPassword')
    const { error } = await supabase.auth.admin.updateUserById(data?.id, {
      password: newPassword,
    });

    if (error) {
      console.error("Erreur lors de la modification :", error.message);
      return;
    }
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      phone: data.phone,
      post: data.post,
      email: data.email,
    })
    .eq("id", data?.id);

  if (profileError) {
    console.log(profileError);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recupération du profile",
      },
    };
  }

  const { data: datas, error: profileErrors } = await supabase
    .from("profiles")
    .select("id, email, full_name, post, phone");

  if (profileErrors) {
    console.log(profileErrors);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recupération du profile",
      },
    };
  }

  return datas as any;
}

export async function deleteUser(id: string) {
  if (!id) {
    console.log("id non fourni");
    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de suppression",
      },
    };
  }
  const supabase = await createClientWithServiceRoleKey();
  const { data, error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    console.log(error);
    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de suppression",
      },
    };
  }
}
