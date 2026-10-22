"use client";

import React, { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { GalleryVerticalEndIcon } from "lucide-react";
import Image from "next/image";
import { LogOut, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClientSide, getcurrentUser2 } from "@/lib/supabase/client";
import { getcurrentUser } from "@/app/auth/auth.db";
// import { getcurrentUser } from "@/lib/supabase/server";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Tâches",
      url: "#",
      // items: [
      //   {
      //     title: "Installation",
      //     url: "#",
      //   },
      //   {
      //     title: "Project Structure",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Rapports",
      url: "#",
    },

    {
      title: "Services",
      url: "#",
    },
    {
      title: "Equipes",
      url: "#",
    },
    {
      title: "Paramètres",
      url: "/parametres",
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [useData, setUserData]: any = useState(null);

    const supabase = createClientSide();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  React.useEffect(() => {
    const GetUser = async () => {
      const data = await getcurrentUser()
      setUserData(data);
    };

    GetUser()
  }, []);


  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <Image
                src="/logo.png"
                alt="Logo ReportFlow"
                width={150}
                height={20}
                className=""
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-col justify-between max-h-screen">
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={<a href={item.url} className="font-medium" />}
                >
                  {item.title}
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          isActive={item.isActive}
                          render={<a href={item.url} />}
                        >
                          {item.title}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarFooter className="">
          <Card className="border-border/60 bg-muted/40 shadow-none">
            <CardContent className="">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="flex shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserRound className="h-4 w-4" />
                  </div>
                  <div className="truncate text-left text-xs">
                    <p className="truncate font-medium text-foreground py-3">
                      {useData?.fullName ?? "utilisateur"}
                    </p>
                    <p className="truncate text-muted-foreground">
                      {useData?.email ?? "email"}
                    </p>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={ async() => {
                    supabase.auth.signOut()
                    window.location.href = "/login";
                  }}
                  className="h-8 w-8 "
                  title="Se déconnecter"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </SidebarFooter>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
