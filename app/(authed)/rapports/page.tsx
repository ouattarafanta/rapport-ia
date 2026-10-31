"use client";


import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
import { Sparkles, SquarePen, UserRound, UserRoundPen, X } from "lucide-react";
import { CreateRapport } from "./createRapport";
import { getTasksByPeriodAndAuthor } from "./rapports.db";

const Rapports = () => {
  const [useData, setUserData]: any = useState(null);
  const [aiReponse, setAiReponse]: any = useState("");

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

  const generate = async(dataGen: any) => {
    const result = await getTasksByPeriodAndAuthor({
      period: dataGen.period,
      author: dataGen.author,
      startDate: dataGen.startDate,
      endDate: dataGen.endDate,
    });

    setAiReponse(result?.report)

    console.log(result)
  };

  useEffect(() => {
    const GetUser = async () => {
      const data = await getcurrentUser();
      setUserData(data);
    };

    GetUser();
  }, []);

  return (
     <div className="space-y-6">
      <CreateRapport generate={generate} />

      <div className="prose prose-slate dark:prose-invert max-w-none rounded-xl border bg-white p-6 shadow-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {aiReponse ?? ""}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Rapports;
