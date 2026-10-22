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
import { SquarePen, UserRound, UserRoundPen, X } from "lucide-react";

const Parametres = () => {
  const [useData, setUserData]: any = useState(null);
  const [isreadOnly, setisreadOnly]: any = useState(true);

  const [fullname, setfullname]: any = useState("");
  const [email, setEmail]: any = useState("");
  const [phone, setPhone]: any = useState("");
  const [post, setPost]: any = useState("");

  const supabase = createClientSide();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const readOnlySwither = () => {
    setisreadOnly(!isreadOnly);
  };

  useEffect(() => {
    const GetUser = async () => {
      const data = await getcurrentUser();
      setUserData(data);
    };

    GetUser();
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
                setEmail(value)
              }}
              required
              readOnly={isreadOnly}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Mot de passe</Label>
            </div>

            <Input id="text" type="password" readOnly={isreadOnly} />
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
                setPhone(value)
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
                setPost(value)
              }}
              required
              readOnly={isreadOnly}
            />
          </div>


        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          className="w-full"
          variant={"destructive"}
          onClick={handleGoogleLogin}
        >
          Deconnexion
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Parametres;
