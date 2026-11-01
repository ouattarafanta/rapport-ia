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

import { getcurrentUser } from "@/app/auth/auth.db";
import { createClientSide } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
  Loader,
  LogOut,
  SaveCheck,
  SquarePen,
  UserRound,
  UserRoundPen,
  X,
} from "lucide-react";
import { getcurrentProfile, getMonCompte, updateProfile } from "./parametre.db";
import CompteCard from "./CompteCard";
import EntrepriseCard from "./EntrepriseCard";
import MotDePasseCard from "./MotDePasseCard";

const Parametres = () => {
  const [useData, setData]: any = useState(null);
  const [isLoarding, setIsLoarding]: any = useState(null);
  const [isreadOnly, setisreadOnly]: any = useState(true);

  const [fullname, setfullname]: any = useState("");
  const [email, setEmail]: any = useState("");
  const [phone, setPhone]: any = useState("");
  const [post, setPost]: any = useState("");
  const [erreur, setErreur] = useState("");
  const [compte, setCompte]: any = useState(null);

  const supabase = createClientSide();

  const init = () => {
    const GetUser = async () => {
      const data = await getcurrentProfile();
      setData(data);

      if (data?.error) return;
      setEmail(data?.email || "");
      setfullname(data?.full_name || "");
      setPost(data?.post || "");
      setPhone(data?.phone || "");
    };

    GetUser();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleSave = async () => {
    setIsLoarding(true);
    setErreur("");

    const data: any = await updateProfile({
      full_name: fullname,
      phone: phone,
      post: post,
      email: email,
    });

    setIsLoarding(false);

    if (data?.error) {
      setErreur("Veuillez remplir tous les champs.");
      return;
    }

    // on recharge les infos et on repasse en lecture seule
    init();
    setisreadOnly(true);
  };
  const readOnlySwither = () => {
    // en annulant, on remet les valeurs enregistrées
    if (!isreadOnly) init();
    setErreur("");
    setisreadOnly(!isreadOnly);
  };

  // infos du compte (identifiant, rôle, entreprise...)
  const chargerCompte = async () => {
    const data: any = await getMonCompte();
    if (!data?.error) setCompte(data);
  };

  useEffect(() => {
    init();
    chargerCompte();
  }, []);

  return (
    <div className="flex flex-wrap items-start gap-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex gap-2">
            <UserRoundPen /> Modification des informations
          </CardTitle>
          <CardDescription>
            Vous pouvez modifier vos informations suivantes
          </CardDescription>
          <CardAction>
            <Button variant="outline" onClick={readOnlySwither}>
              {isreadOnly ? <SquarePen /> : <X color="red" />}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="fullname">Nom complet *</Label>
              <Input
                id="fullname"
                type="text"
                placeholder="Votre nom complet"
                value={fullname}
                onChange={(even) => {
                  const value = even.target.value;
                  setfullname(value);
                }}
                required
                readOnly={isreadOnly}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nom@gmail.com"
                value={email}
                onChange={(even) => {
                  const value = even.target.value;
                  setEmail(value);
                }}
                required
                readOnly={isreadOnly}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="text"
                placeholder="070000000"
                value={phone}
                onChange={(even) => {
                  const value = even.target.value;
                  setPhone(value);
                }}
                required
                readOnly={isreadOnly}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="poste">Poste</Label>
              <Input
                id="poste"
                type="text"
                placeholder="informaticienne"
                value={post}
                onChange={(even) => {
                  const value = even.target.value;
                  setPost(value);
                }}
                required
                readOnly={isreadOnly}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {erreur && <p className="text-red-500">{erreur}</p>}
          {isreadOnly ? (
            <Button
              type="submit"
              className="w-full"
              variant={"destructive"}
              onClick={handleLogout}
            >
              <LogOut /> Déconnexion
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full"
              variant={"default"}
              disabled={isLoarding}
              onClick={handleSave}
            >
              {isLoarding ? <Loader className="animate-spin" /> : <SaveCheck />}
              Enregistrer
            </Button>
          )}
        </CardFooter>
      </Card>

      <CompteCard compte={compte} />

      {/* tout le monde voit l'entreprise, seul l'admin peut la modifier */}
      {compte && (
        <EntrepriseCard
          entreprise={compte.entreprise}
          isAdmin={compte.isAdmin}
          onSaved={chargerCompte}
        />
      )}
      {compte && !compte.isAdmin && <MotDePasseCard />}
    </div>
  );
};

export default Parametres;
