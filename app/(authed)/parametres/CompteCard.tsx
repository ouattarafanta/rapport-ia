"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRound } from "lucide-react";

// Carte en lecture seule : les infos de connexion du compte
export default function CompteCard({ compte }: any) {
  const lignes = [
    {
      label: compte?.isAdmin ? "Connexion Google" : "Identifiant de connexion",
      valeur: compte?.identifiant,
    },
    {
      label: "Rôle",
      valeur: compte?.isAdmin ? "Administrateur" : "Membre",
    },
    { label: "Entreprise", valeur: compte?.entreprise?.name },
    { label: "Service", valeur: compte?.service || "Aucun service" },
    {
      label: "Membre depuis",
      valeur: compte?.membreDepuis
        ? new Date(compte.membreDepuis).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "-",
    },
  ];

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex gap-2">
          <UserRound /> Mon compte
        </CardTitle>
        <CardDescription>Informations de connexion</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {lignes.map((ligne) => (
            <div key={ligne.label} className="grid gap-1">
              <p className="text-sm text-muted-foreground">{ligne.label}</p>
              <p className="font-medium break-all">{ligne.valeur || "-"}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
