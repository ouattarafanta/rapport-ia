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

export default function LoginPage() {
  const supabase = createClientSide();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
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

          <CardDescription className="text-center text-lg relative top-2">
            Connectez-vous pour accéder à votre espace de travail.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 text-center">
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full gap-3 h-12 text-2xl mt-6 font-bold hover:bg-gray-200 hover:text-blue-900"
          >
            <FcGoogle className="!h-8 !w-8" />
            Continuer avec Google
          </Button>

          <p className=" text-center text-lg py-6">
            Votre connexion est sécurisée.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
