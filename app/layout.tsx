import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


// Configuration de Plus Jakarta Sans
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "ReportFlow - Rapports Assistés par IA",
  description: "Générez et analysez vos rapports grâce à l'intelligence artificielle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={cn("h-full", "font-sans", inter.variable)}>
      <body className={`${plusJakartaSans.className} min-h-full flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  );
}