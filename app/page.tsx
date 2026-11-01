import { redirect } from "next/navigation";

export default function Home() {
  // la page d'accueil renvoie vers le tableau de bord
  redirect("/dashboard");
}
