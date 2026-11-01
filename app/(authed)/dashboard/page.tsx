"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCheck, ClipboardList, ListTodo, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboard } from "./dashboard.db";

export default function Page() {
  const [data, setData]: any = useState(null);

  useEffect(() => {
    const GetDashboard = async () => {
      const result: any = await getDashboard();
      if (!result?.error) setData(result);
    };
    GetDashboard();
  }, []);

  const chiffres = [
    { titre: "Tâches en cours", valeur: data?.enCours, icone: <ListTodo /> },
    {
      titre: "Terminées cette semaine",
      valeur: data?.termineesSemaine,
      icone: <CheckCheck />,
    },
    { titre: "Total des tâches", valeur: data?.total, icone: <ClipboardList /> },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Bonjour {data?.nom}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Voici un résumé de votre activité.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {chiffres.map((chiffre) => (
          <Card key={chiffre.titre}>
            <CardHeader>
              <CardDescription className="flex gap-2 items-center">
                {chiffre.icone}
                {chiffre.titre}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{chiffre.valeur ?? "-"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tâches à faire</CardTitle>
          <CardDescription>Vos dernières tâches non terminées</CardDescription>
        </CardHeader>
        <CardContent>
          {data?.dernieresTaches?.length ? (
            <ul className="space-y-2">
              {data.dernieresTaches.map((task: any) => (
                <li key={task.id} className="bg-secondary p-2 rounded-md">
                  {task.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Aucune tâche en cours.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="h-11 px-5"
          render={<Link href="/taches" />}
        >
          <ClipboardList /> Voir mes tâches
        </Button>
        <Button className="h-11 px-5" render={<Link href="/rapports" />}>
          <Sparkles /> Générer un rapport
        </Button>
      </div>
    </div>
  );
}
