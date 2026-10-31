export { cn } from "cn";

export function formatIdentifiant(identifiant: string) {
  return identifiant.replace(".local.reportflow", "");
}

 export const getPeriodDates = (period: string) => {
  const endDate = new Date();
  const startDate = new Date(endDate);

  switch (period) {
    case "day":
      // Les dernières 24 heures
      startDate.setTime(endDate.getTime() - 24 * 60 * 60 * 1000);
      break;

    case "week":
      // Depuis lundi à 00h
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7));
      break;

    case "month":
      // Depuis le premier jour du mois
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;

    case "year":
      // Depuis le premier janvier
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
  }

  return { startDate, endDate };
};
