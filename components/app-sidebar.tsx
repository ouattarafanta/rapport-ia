"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
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
import { LogOut, UserRound } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
      url: "#",
    },


    {
      title: "Deconnexion",
      url: "#",
    },

     

   
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
      <SidebarContent>
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
      </SidebarContent>
      <SidebarRail />
    </Sidebar>



  );
}







