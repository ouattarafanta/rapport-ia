"use server";
import { createClientWithServiceRoleKey } from "@/lib/supabase/server";
import { getcurrentOrganization } from "../equipes/equipe.db";
import { getcurrentUser } from "@/app/auth/auth.db";
import { title } from "process";

export async function createTask(data: any) {
  const supabase = await createClientWithServiceRoleKey();

  const { id: orga_id, error } = await getcurrentOrganization();
  const { id: user_id, error: userError } = await getcurrentUser();

  if (error || !orga_id || userError) {
    console.log(error);
    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de creation d'organisation",
      },
    };
  }

  if (!orga_id || !data?.title) {
    console.log("parametres incomplet", orga_id, data);
    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de création de la tache",
      },
    };
  }

  const { data: tasks, error: taskError } = await supabase
    .from("tasks")
    .insert({
      title: data.title,
      content: data?.content,
      profile_id: user_id,
      organization_id: orga_id,
    });

  if (taskError) {
    console.log(taskError);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de creation de la tache",
      },
    };
  }

  return tasks;
}

export async function getTasks() {
  const supabase = await createClientWithServiceRoleKey();

  const { id: user_id, error } = await getcurrentUser();

  if (error) {
    return error;
  }

  const { data: datas, error: taskErrorE } = await supabase
    .from("tasks")
    .select("id, created_at, title, content, is_finished, programmed_at")
    .eq("profile_id", user_id)
    .order("created_at", { ascending: false });

  if (taskErrorE) {
    console.log(taskErrorE);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de recup des taches",
      },
    };
  }

  return datas;
}

export async function makeTasksDone(task_id: string) {
  const supabase = await createClientWithServiceRoleKey();

  if (!task_id) {
    return;
  }

  const { data: datas, error: taskErrorE } = await supabase
    .from("tasks")
    .update({
      is_finished: true,
    })
    .eq("id", task_id);

  if (taskErrorE) {
    console.log(taskErrorE);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de mise a joure de la tache",
      },
    };
  }

  return datas;
}

export async function updateTask(
  task_id: string,
  data: { title: string; content: string },
) {
  const supabase = await createClientWithServiceRoleKey();

  if (!task_id) {
    return;
  }

  const { data: datas, error: taskErrorE } = await supabase
    .from("tasks")
    .update({
      title: data?.title,
      content: data?.content,
    })
    .eq("id", task_id);

  if (taskErrorE) {
    console.log(taskErrorE);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de mise a joure de la tache",
      },
    };
  }

  return datas;
}

export async function updateTaskWitheUndo(
  task_id: string,
  data: { title: string; content: string },
) {
  const supabase = await createClientWithServiceRoleKey();

  if (!task_id) {
    return;
  }

  const { data: datas, error: taskErrorE } = await supabase
    .from("tasks")
    .update({
      title: data?.title,
      content: data?.content,
      is_finished: false,
    })
    .eq("id", task_id);

  if (taskErrorE) {
    console.log(taskErrorE);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de mise a joure de la tache",
      },
    };
  }

  return datas;
}

export async function deleteTask(task_id: string) {
  const supabase = await createClientWithServiceRoleKey();

  if (!task_id) {
    return;
  }

  const { data: datas, error: taskErrorE } = await supabase
    .from("tasks")
    .delete()
    .eq("id", task_id);

  if (taskErrorE) {
    console.log(taskErrorE);

    return {
      error: {
        status: false,
        code: 500,
        message: "Erreur de mise a joure de la tache",
      },
    };
  }

  return datas;
}
