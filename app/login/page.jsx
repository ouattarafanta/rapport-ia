"use client";

import Image from "next/image";
import { createClientSide } from "@/lib/supabase/client";
import { FcGoogle } from "react-icons/fc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader, LogIn } from "lucide-react";
import { useState } from "react";
import { signInWithIdentifiant } from "../auth/auth.db";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const routeur = useRouter()
  const supabase = createClientSide();
  const [isloadding, setIsloarding] = useState(false);
  const [identifiant, setIdentifiant] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");



  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleIdentifiantLogin = async () => {
    setIsloarding(true);
    const data = await signInWithIdentifiant({ identifiant, password });
    setIsloarding(false);
    routeur.push('/dashboard')

    if (!data?.success) {
      setErrorMessage(data?.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-300 px-4">
      <Card className="w-full max-w-md shadow-lg xhover:bg-blue-100">
        <CardHeader className="space-y-5 ">
          <CardTitle className="text-3xl font-bold flex items-end gap-1 justify-center">
            <span>Bienvenue sur</span>
            <Image
              src="/logo.png"
              alt="Logo ReportFlow"
              width={150}
              height={20}
              className=""
            />
          </CardTitle>

          {/* <CardDescription className="text-center text-lg relative top-2">
            Connectez-vous pour accéder à votre espace de travail.
          </CardDescription> */}
        </CardHeader>

        <CardContent className="space-y-5 text-center">
          <div className="grid gap-2">
            <Label htmlFor="identifiant">Identifiant</Label>
            <Input
              id="identifiant"
              type="text"
              placeholder="fanta@trabad"
              value={identifiant}
              onChange={(even) => {
                const value = even.target.value;
                setIdentifiant(value);
              }}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder=""
              value={password}
              onChange={(even) => {
                const value = even.target.value;
                setPassword(value);
              }}
              required
            />
          </div>

          {errorMessage && <p className="text-red-500"> {errorMessage} </p>}

          <Button
            type="submit"
            onClick={handleIdentifiantLogin}
            variant="default"
            className="w-full"
            disabled={isloadding}
          >
            {isloadding ? <Loader className="animate-spin" /> : <LogIn />}
            Se connecter en tant que utilisateur
          </Button>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-ls font-medium ">
              Ou se connecter avec google
            </span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <CardDescription className="text-center text-ls relative top-2"></CardDescription>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full gap-3 h-12 text-sl mt-6 font-bold hover:bg-gray-200 hover:text-blue-900"
          >
            <FcGoogle className="!h-8 !w-8" />
            Continuer en tant que administrateur
          </Button>

          <p className=" text-center text-lg py-6">
            Votre connexion est sécurisée.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
