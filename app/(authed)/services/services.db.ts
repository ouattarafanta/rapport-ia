"use server";

import { createClientWithServiceRoleKey } from "@/lib/supabase/server";
import { getcurrentOrganization } from "../equipes/equipe.db";

const erreur = (message: string) => ({
  error: {
    status: false,
    code: 500,
    message,
  },
});

// Retourne l'entreprise seulement si l'utilisateur connecté en est l'admin
async function getAdminOrganization() {
  const orga: any = await getcurrentOrganization();

  if (!orga?.id || !orga?.isAdmin) {
    return null;
  }

  return orga;
}

export async function getOrgaServices() {
  const supabase = await createClientWithServiceRoleKey();

  const currentOrga: any = await getcurrentOrganization();

  const currentOrgaId = currentOrga?.id;

  if (!currentOrgaId) return [];

  const { data: datas, error } = await supabase
    .from("services")
    .select("id, name, description")
    .eq("organization_id", currentOrgaId)
    .order("name");

  if (error) {
    console.log(error);
    return erreur("Erreur de recupération des services");
  }

  // nombre de collaborateurs dans chaque service
  const { data: profiles } = await supabase
    .from("profiles")
    .select("service_id")
    .eq("organization_id", currentOrgaId);

  return datas.map((service) => ({
    ...service,
    nb_collabs:
      profiles?.filter((profile) => profile.service_id == service.id).length ||
      0,
  }));
}

export async function createService(data: any) {
  const supabase = await createClientWithServiceRoleKey();

  const orga = await getAdminOrganization();

  if (!orga) {
    return erreur("Accès réservé à l'administrateur");
  }

  if (!data?.name?.trim()) {
    return erreur("Le nom du service est obligatoire");
  }

  const { error: serviceError } = await supabase.from("services").insert({
    organization_id: orga.id,
    name: data.name.trim(),
    description: data.description,
  });

  if (serviceError) {
    console.log(serviceError);
    return erreur("Erreur de creation du service");
  }

  return { success: true };
}

export async function getServiceById(id: string) {
  if (!id) return {};

  const supabase = await createClientWithServiceRoleKey();

  const orga = await getAdminOrganization();

  if (!orga) {
    return erreur("Accès réservé à l'administrateur");
  }

  const { data, error: serviceErrors } = await supabase
    .from("services")
    .select("id, name, description")
    .eq("id", id)
    .eq("organization_id", orga.id)
    .maybeSingle();

  if (serviceErrors || !data) {
    console.log(serviceErrors);
    return erreur("Service introuvable");
  }

  return data;
}

export async function updateService(data: any) {
  const supabase = await createClientWithServiceRoleKey();

  const orga = await getAdminOrganization();

  if (!orga) {
    return erreur("Accès réservé à l'administrateur");
  }

  if (!data?.name?.trim() || !data?.id) {
    return erreur("Le nom du service est obligatoire");
  }

  const { error: serviceError } = await supabase
    .from("services")
    .update({
      name: data.name.trim(),
      description: data.description,
    })
    .eq("id", data.id)
    .eq("organization_id", orga.id);

  if (serviceError) {
    console.log(serviceError);
    return erreur("Erreur de modification du service");
  }

  return { success: true };
}

export async function deleteService(id: string) {
  if (!id) {
    return erreur("Erreur de suppression");
  }

  const orga = await getAdminOrganization();

  if (!orga) {
    return erreur("Accès réservé à l'administrateur");
  }

  const supabase = await createClientWithServiceRoleKey();

  // les membres de ce service n'ont plus de service
  await supabase
    .from("profiles")
    .update({ service_id: null })
    .eq("service_id", id)
    .eq("organization_id", orga.id);

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id)
    .eq("organization_id", orga.id);

  if (error) {
    console.log(error);
    return erreur("Erreur de suppression");
  }

  return { success: true };
}
