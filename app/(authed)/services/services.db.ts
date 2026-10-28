"use server";

import { createClientWithServiceRoleKey } from "@/lib/supabase/server";
import { getcurrentOrganization } from "../equipes/equipe.db";

export async function getOrgaServices() {
  const supabase = await createClientWithServiceRoleKey();

  const currentOrga = await getcurrentOrganization();

  const currentOrgaId = currentOrga?.id;

  if (!currentOrgaId) return [];

  const { data: datas, error } = await supabase
    .from("services")
    .select("id, name, description")
    .eq("organization_id", currentOrgaId);

  if (error) {
    console.log(error);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recupération des services",
      },
    };
  }

  return datas;
}

export async function createService(data: any) {
  const supabase = await createClientWithServiceRoleKey();

  const { id: orga_id, error } = await getcurrentOrganization();

  if (error) {
    console.log(error);
    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de creation de service",
      },
    };
  }

  if (!orga_id || !data?.name || !data?.description) {
    console.log("parametres incomplet", orga_id, data);
    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de création de service",
      },
    };
  }

  const { data: serviceData, error: serviceError } = await supabase
    .from("services")
    .insert({
      organization_id: orga_id,
      name: data.name,
      description: data.description,
    });

  if (serviceError) {
    console.log(serviceError);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de creation  du service",
      },
    };
  }

  return serviceData;
}

export async function getServiceById(id: string) {
  if (!id) return {};

  const supabase = await createClientWithServiceRoleKey();

  const currentOrga = await getcurrentOrganization();

  //   const currentOrgaId = currentOrga?.id;

  const { data, error: serviceErrors } = await supabase
    .from("services")
    .select("id, name, description")
    .eq("id", id)
    .maybeSingle();

  if (serviceErrors) {
    console.log(serviceErrors);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recupération du service",
      },
    };
  }

  return data;
}

export async function updateService(data: any) {
  const supabase = await createClientWithServiceRoleKey();

  if (!data?.name || !data?.id) {
    console.log("parametres incomplet", data);
    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de création du service",
      },
    };
  }

  const { data: serviceData, error: serviceError } = await supabase
    .from("services")
    .update({
      name: data.name,
      description: data.description,
    })
    .eq("id", data?.id);

  if (serviceError) {
    console.log(serviceError);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recupération du service",
      },
    };
  }

  return serviceData as any;
}

export async function deleteService(id: string) {
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
  const { data, error } = await supabase.from("services").delete().eq("id", id);

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
