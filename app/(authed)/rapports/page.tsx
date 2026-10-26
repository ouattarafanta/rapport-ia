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

const Rapports = () => {
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
    
    <p>Rapports</p>
  );
};

export default Rapports;


