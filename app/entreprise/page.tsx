"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEntreprise } from "./db.entreprise";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { ChevronLeft, Loader } from "lucide-react";
import { createClientSide } from "@/lib/supabase/client";

export default function EntreprisePage() {
  const router = useRouter();
  const supabase = createClientSide();


  const [nomEntreprise, setNomEntreprise] = useState("");
  const [emailEntreprise, setEmailEntreprise] = useState("");
  const [descriptionEntreprise, setDescriptionEntreprise] = useState("");
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [posteUtilisateur, setPosteUtilisateur] = useState("");
  const [phoneUtilisateur, setPhoneUtilisateur] = useState("");

  const [erreur, setErreur] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    setErreur("");
    setIsLoading(true);

    try {
      const resultat = await createEntreprise({
        nomEntreprise,
        emailEntreprise,
        descriptionEntreprise,
        nomUtilisateur,
        posteUtilisateur,
        phoneUtilisateur,
      });

      // On reste sur la page tant qu'il y a une erreur
      if (!resultat.success) {
        setErreur(resultat.message);
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (errror) {
      console.log("Une erreur", errror);
      setErreur("Une erreur est survenue");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-300 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <Image
            src="/logo.png"
            alt="Logo ReportFlow"
            width={120}
            height={45}
            className="mx-auto"
          />

          <CardTitle className="text-2xl font-bold">
            CRÉEZ VOTRE ENTREPRISE
          </CardTitle>

          <CardDescription className="text-base">
            Pour commencer, renseignez les informations de votre entreprise.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <div className="space-y-2 flex flex-col gap-3">
            <div className="space-y-2">
              <Label htmlFor="entreprise">Nom de l'entreprise</Label>

              <Input
                id="entreprise"
                type="text"
                value={nomEntreprise}
                onChange={(e) => setNomEntreprise(e.target.value)}
                placeholder="Votre entreprise"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">L'email de l'entreprise</Label>

              <Input
                id="email"
                type="email"
                value={emailEntreprise}
                onChange={(e) => setEmailEntreprise(e.target.value)}
                placeholder="Email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description de l'entreprise</Label>
              <textarea
                id="description"
                value={descriptionEntreprise}
                onChange={(e) => setDescriptionEntreprise(e.target.value)}
                placeholder="Présentez brièvement votre entreprise..."
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <br />
          <hr />
          <br />

          <div className="space-y-2 ">
            <Label htmlFor="nomUtilisateur">Nom complet </Label>

            <Input
              id="nomUtilisateur"
              type="text"
              value={nomUtilisateur}
              onChange={(e) => setNomUtilisateur(e.target.value)}
              placeholder="Votre nom complet"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="posteUtilisateur">Poste</Label>
            <Input
              id="posteUtilisateur"
              type="text"
              value={posteUtilisateur}
              onChange={(e) => setPosteUtilisateur(e.target.value)}
              placeholder="Ex : Directeur, Responsable..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneUtilisateur">Téléphone</Label>
            <Input
              id="phoneUtilisateur"
              type="tel"
              value={phoneUtilisateur}
              onChange={(e) => setPhoneUtilisateur(e.target.value)}
            />
          </div>

          <div className="flex gap-2 items-center">
            <Button
              variant="destructive"
              size="icon"
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
              className=" w-8 h-12 "
              title="Se déconnecter"
            >
              <ChevronLeft />
            </Button>

            <Button
              onClick={handleNext}
              disabled={isLoading}
              className=" h-12 text-base flex-1"
            >
              {isLoading && <Loader className="animate-spin" />}
              Suivant →
            </Button>
          </div>

          {erreur && <p className="text-red-500">{erreur}</p>}
        </CardContent>
      </Card>
    </main>
  );
}
