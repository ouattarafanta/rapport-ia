
"use server";

import { getcurrentUser } from "@/app/auth/auth.db";
import { getAiResponse } from "@/lib/ai/ai";
import { createClientWithServiceRoleKey } from "@/lib/supabase/server";

export async function getTasksByPeriodAndAuthor(data: {
  author: string;
  period: string;
  startDate: string;
  endDate: string;
}) {
  try {
    const supabase = await createClientWithServiceRoleKey();

    const { id: user_id, error: userError } = await getcurrentUser();

    if (userError || !user_id) {
      return {
        error: {
          status: false,
          code: 401,
          message: "Utilisateur non authentifié",
        },
      };
    }

    const { startDate, endDate, period, author } = data;

    const { data: tasks, error: taskError } = await supabase
      .from("tasks")
      .select(
        "id, created_at, title, content, is_finished, programmed_at",
      )
      .eq("profile_id", user_id)
      .gte("created_at", startDate)
      .lte("created_at", endDate)
      .eq("is_finished", true)
      .order("created_at", { ascending: false });

    if (taskError) {
      console.error("Erreur Supabase :", taskError);

      return {
        error: {
          status: false,
          code: 500,
          message: "Erreur de récupération des tâches",
        },
      };
    }

    if (!tasks || tasks.length === 0) {
      return {
        data: [],
        report: null,
        message: "Aucune tâche terminée sur cette période.",
      };
    }

    const input = `
      Rédige un rapport professionnel en français à partir
      des tâches terminées suivantes.

      Auteur du rapport : ${author}
      Période : ${period}
      Date de début : ${startDate}
      Date de fin : ${endDate}

      Tâches :
      ${JSON.stringify(tasks, null, 2)}

      Structure le rapport avec :
      - Un titre
      - Une introduction
      - Les activités réalisées
      - Une conclusion

      N'invente aucune information.
      Utilise uniquement les informations fournies.
    `;

    const report = await getAiResponse(input);

    return {
      data: tasks,
      report,
      message: "Rapport généré avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de la génération du rapport :", error);

    return {
      error: {
        status: false,
        code: 500,
        message: "Une erreur est survenue lors de la génération du rapport",
      },
    };
  }
}
