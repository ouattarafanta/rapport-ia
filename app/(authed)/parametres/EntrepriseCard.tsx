"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Loader, SaveCheck, SquarePen, X } from "lucide-react";
import { useEffect, useState } from "react";
import { updateEntreprise } from "./parametre.db";

// Infos de l'entreprise (affichées dans l'en-tête des rapports)
// Tout le monde les voit, seul l'admin peut modifier le nom, l'email et la description
export default function EntrepriseCard({ entreprise, isAdmin, onSaved }: any) {
  const [isreadOnly, setisreadOnly] = useState(true);
  const [isLoarding, setIsLoarding] = useState(false);
  const [erreur, setErreur] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  // on remplit les champs quand les infos arrivent
  const remplir = () => {
    setName(entreprise?.name || "");
    setEmail(entreprise?.email || "");
    setDescription(entreprise?.description || "");
  };

  useEffect(() => {
    remplir();
  }, [entreprise]);

  const readOnlySwither = () => {
    // en annulant, on remet les valeurs enregistrées
    if (!isreadOnly) remplir();
    setErreur("");
    setisreadOnly(!isreadOnly);
  };

  const handleSave = async () => {
    setErreur("");
    setIsLoarding(true);

    const result: any = await updateEntreprise({ name, email, description });

    setIsLoarding(false);

    if (result?.error) {
      setErreur(result.error.message);
      return;
    }

    setisreadOnly(true);
    onSaved();
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex gap-2">
          <Building2 /> Entreprise
        </CardTitle>
        <CardDescription>
          {isAdmin
            ? "Ces informations apparaissent dans l'en-tête des rapports"
            : "Seul l'administrateur peut modifier ces informations"}
        </CardDescription>
        {isAdmin && (
          <CardAction>
            <Button variant="outline" onClick={readOnlySwither}>
              {isreadOnly ? <SquarePen /> : <X color="red" />}
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="entreprise-nom">Nom de l'entreprise *</Label>
            <Input
              id="entreprise-nom"
              value={name}
              onChange={(even) => setName(even.target.value)}
              readOnly={!isAdmin || isreadOnly}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="entreprise-email">Email de l'entreprise *</Label>
            <Input
              id="entreprise-email"
              type="email"
              value={email}
              onChange={(even) => setEmail(even.target.value)}
              readOnly={!isAdmin || isreadOnly}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="entreprise-description">Description</Label>
            <textarea
              id="entreprise-description"
              rows={4}
              value={description}
              onChange={(even) => setDescription(even.target.value)}
              readOnly={!isAdmin || isreadOnly}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Informations en lecture seule pour tout le monde */}
          <div className="grid gap-3 rounded-md bg-secondary p-3 text-sm">
            {[
              { label: "Code de l'entreprise", valeur: entreprise?.slug },
              { label: "Administrateur", valeur: entreprise?.adminNom },
              { label: "Membres", valeur: entreprise?.nbMembres },
              { label: "Services", valeur: entreprise?.nbServices },
              {
                label: "Créée le",
                valeur: entreprise?.creeLe
                  ? new Date(entreprise.creeLe).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "-",
              },
            ].map((ligne) => (
              <div key={ligne.label} className="flex justify-between gap-2">
                <span className="text-muted-foreground">{ligne.label}</span>
                <span className="font-medium">{ligne.valeur ?? "-"}</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Le code est utilisé dans les identifiants des membres (ex : fanta@
              {entreprise?.slug}). Il ne peut pas être modifié.
            </p>
          </div>
        </div>
      </CardContent>
      {isAdmin && !isreadOnly && (
        <CardFooter className="flex-col gap-2">
          {erreur && <p className="text-red-500">{erreur}</p>}
          <Button
            className="w-full"
            disabled={isLoarding}
            onClick={handleSave}
          >
            {isLoarding ? <Loader className="animate-spin" /> : <SaveCheck />}
            Enregistrer
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
