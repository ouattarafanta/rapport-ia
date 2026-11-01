"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader, SaveCheck } from "lucide-react";
import { useState } from "react";
import { changePassword } from "./parametre.db";

export default function MotDePasseCard() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoarding, setIsLoarding] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");

  const handleSave = async () => {
    setErreur("");
    setSucces("");
    setIsLoarding(true);

    const result: any = await changePassword({ password, confirm });

    setIsLoarding(false);

    if (result?.error) {
      setErreur(result.error.message);
      return;
    }

    setPassword("");
    setConfirm("");
    setSucces("Mot de passe modifié.");
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex gap-2">
          <KeyRound /> Mot de passe
        </CardTitle>
        <CardDescription>8 caractères minimum</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(even) => setPassword(even.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(even) => setConfirm(even.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        {erreur && <p className="text-red-500">{erreur}</p>}
        {succes && <p className="text-green-600">{succes}</p>}
        <Button
          className="w-full"
          disabled={isLoarding || !password}
          onClick={handleSave}
        >
          {isLoarding ? <Loader className="animate-spin" /> : <SaveCheck />}
          Changer le mot de passe
        </Button>
      </CardFooter>
    </Card>
  );
}
