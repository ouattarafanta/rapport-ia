"use server";

import { getcurrentUser } from "@/app/auth/auth.db";
import { createClientWithServiceRoleKey } from "@/lib/supabase/server";

export async function getDashboard() {
  const supabase = await createClientWithServiceRoleKey();

  const { id: user_id, fullName, error } = await getcurrentUser();

  if (error) {
    return error;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user_id)
    .maybeSingle();

  const { data: tasks, error: taskError } = await supabase
    .from("tasks")
    .select("id, title, is_finished, created_at, meta_data")
    .eq("profile_id", user_id)
    .order("created_at", { ascending: false });

  if (taskError) {
    console.log(taskError);
    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recup des taches",
      },
    };
  }

  // il y a 7 jours
  const semaine = new Date();
  semaine.setDate(semaine.getDate() - 7);

  const enCours = tasks.filter((task) => !task.is_finished);
  const terminees = tasks.filter((task) => task.is_finished);
  const termineesSemaine = terminees.filter((task: any) => {
    const finDate = task.meta_data?.finished_at || task.created_at;
    return new Date(finDate) >= semaine;
  });

  return {
    nom: profile?.full_name || fullName || "",
    total: tasks.length,
    enCours: enCours.length,
    termineesSemaine: termineesSemaine.length,
    dernieresTaches: enCours.slice(0, 5),
  };
}
