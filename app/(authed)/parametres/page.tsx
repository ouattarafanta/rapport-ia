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
  LogOut,
  SaveCheck,
  SquarePen,
  UserRound,
  UserRoundPen,
  X,
} from "lucide-react";
import { getcurrentProfile, updateProfile } from "./parametre.db";

const Parametres = () => {
  const [useData, setData]: any = useState(null);
  const [isLoarding, setIsLoarding]: any = useState(null);
  const [isreadOnly, setisreadOnly]: any = useState(true);

  const [fullname, setfullname]: any = useState("");
  const [email, setEmail]: any = useState("");
  const [phone, setPhone]: any = useState("");
  const [post, setPost]: any = useState("");

  const supabase = createClientSide();

  const init = () => {
    const GetUser = async () => {
      const data = await getcurrentProfile();
      setData(data);

      if (!data?.error) setEmail(data?.email);
      setfullname(data?.full_name);
      setPost(data?.post);
      setPhone(data?.phone);
    };

    GetUser();
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSave = () => {
    setIsLoarding(true);

    const SetProfile = async () => {
      const data = await updateProfile({
        full_name: fullname,
        phone: phone,
        post: post,
        email: email,
      });
    };

    SetProfile();
    init();
    setIsLoarding(false);
  };
  const readOnlySwither = () => {
    setisreadOnly(!isreadOnly);
  };

  useEffect(() => {
    setIsLoarding(true);

    init();
    setIsLoarding(false);
  }, []);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex gap-2">
          <UserRoundPen/> Modification des informations
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
            <Label htmlFor="email">Nom complet *</Label>
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
            <Label htmlFor="email">Téléphone</Label>
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
            <Label htmlFor="email">Poste</Label>
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
        {isreadOnly ? (
          <Button
            type="submit"
            className="w-full"
            variant={"destructive"}
            onClick={handleGoogleLogin}
          >
            <LogOut /> Deconnexion
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full"
            variant={"default"}
            disabled={isLoarding}
            onClick={handleSave}
          >
            <SaveCheck /> Enregistrer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Parametres;
