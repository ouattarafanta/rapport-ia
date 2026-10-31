import { OpenRouter } from "@openrouter/sdk";

export async function getAiResponse(input: string): Promise<string> {
  const apiKey = process.env.IA_API;
  const model = process.env.CURRENT_AI_MODEL;

  if (!apiKey || !model) {
    throw new Error("La clé API ou le modèle IA n'est pas configuré.");
  }

  const client = new OpenRouter({
    apiKey,
  });

  const response = await client.responses.send({
    responsesRequest: {
      model,
      instructions: `
        Tu es un assistant spécialisé dans la rédaction
        de rapports professionnels.

        Tes missions :
        - Rédiger des rapports clairs, structurés et professionnels.
        - Corriger les fautes d'orthographe et de grammaire.
        - Reformuler les textes pour améliorer leur clarté.
        - Respecter fidèlement les informations fournies.
        - Ne jamais inventer des informations manquantes.
        - Adapter le ton au contexte professionnel.

        Réponds toujours en français, sauf demande contraire.
      `,
      input,
    },
  });

  if (!("output" in response)) {
    throw new Error("La réponse de l'IA est invalide.");
  }

  if (response.status !== "completed") {
    throw new Error(
      response.error?.message ?? `La génération a échoué : ${response.status}`,
    );
  }

  const message = response.output.find((item) => item.type === "message");

  const text = message?.content.find(
    (part) => part.type === "output_text",
  )?.text;

  if (!text) {
    throw new Error("L'IA n'a retourné aucun texte.");
  }

  return text;
}
