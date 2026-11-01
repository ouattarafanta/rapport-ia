"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
import Image from "next/image";
import { LogOut, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClientSide } from "@/lib/supabase/client";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Tableau de bord",
      url: "/dashboard",
    },
    {
      title: "Tâches",
      url: "/taches",
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
      url: "/rapports",
    },
    {
      title: "Paramètres",
      url: "/parametres",
    },
  ],
};
// Pages réservées à l'administrateur
const adminSections = [
  { title: "Services", url: "/services" },
  { title: "Equipes", url: "/equipes" },
];

// L'utilisateur est chargé par le layout (côté serveur) et passé en props :
// le menu est donc complet dès l'affichage, sans attendre de chargement.
export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: any }) {
  const pathname = usePathname();
  const supabase = createClientSide();

  const sections = user?.isAdmin
    ? [...data.navMain, ...adminSections]
    : data.navMain;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
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
            {sections.map((item: any) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.url)}
                  render={<Link href={item.url} className="font-medium" />}
                >
                  {item.title}
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item: any) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          isActive={item.isActive}
                          render={<Link href={item.url} />}
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
                      {user?.fullName ?? "utilisateur"}
                    </p>
                    <p className="truncate text-muted-foreground">
                      {user?.email ?? "email"}
                    </p>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={async () => {
                    await supabase.auth.signOut();
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
