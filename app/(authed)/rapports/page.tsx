"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getcurrentUser } from "@/app/auth/auth.db";
import { useEffect, useState } from "react";
import {
  Copy,
  FileDown,
  FileText,
  History,
  Loader,
  Printer,
  Trash,
} from "lucide-react";
import { CreateRapport } from "./createRapport";
import { RapportDocument } from "./RapportDocument";
import {
  deleteReport,
  getMyReports,
  getTasksByPeriodAndAuthor,
} from "./rapports.db";

// Styles utilisés dans le fichier Word (Word ne comprend pas Tailwind)
const WORD_STYLES = `
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #0f172a; }
  h1 { font-size: 20pt; color: #1e40af; text-align: center; text-transform: uppercase; }
  h2 { font-size: 13pt; color: #1e40af; text-transform: uppercase; border-left: 4px solid #1d4ed8; padding-left: 6px; margin-top: 18pt; }
  h3 { font-size: 12pt; }
  table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
  th, td { border: 1px solid #cbd5e1; padding: 4pt 6pt; text-align: left; }
  th { background: #f1f5f9; }
  header { border-bottom: 3px solid #1d4ed8; padding-bottom: 8pt; }
  footer { border-top: 1px solid #cbd5e1; margin-top: 18pt; padding-top: 6pt; font-size: 8pt; color: #64748b; text-align: center; }
`;

const Rapports = () => {
  const [useData, setUserData]: any = useState(null);
  const [rapport, setRapport]: any = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const [historique, setHistorique]: any = useState([]);
  const [avertissement, setAvertissement] = useState("");
  // id du rapport affiché (pour le mettre en évidence dans l'historique)
  const [rapportId, setRapportId]: any = useState(null);
  // filtres de l'historique
  const [filtreType, setFiltreType] = useState("tous");
  const [recherche, setRecherche] = useState("");

  const chargerHistorique = async () => {
    const data: any = await getMyReports();
    setHistorique(data || []);
  };

  const generate = async (dataGen: any) => {
    setIsLoading(true);
    setErreur("");
    setAvertissement("");
    setRapport(null);

    const result: any = await getTasksByPeriodAndAuthor({
      period: dataGen.period,
      author: dataGen.author,
      startDate: dataGen.startDate,
      endDate: dataGen.endDate,
    });

    setIsLoading(false);

    if (result?.error) {
      setErreur(result.error.message);
      return;
    }

    if (!result?.report) {
      // ex : aucune tâche sur la période
      setErreur(result?.message);
      return;
    }

    setRapport(result);
    setRapportId(result.id);

    if (!result.saved) {
      setAvertissement(
        "Le rapport a bien été généré, mais il n'a pas pu être enregistré dans l'historique. Téléchargez-le pour le conserver.",
      );
    }

    chargerHistorique();
  };

  // Ouvre un rapport de l'historique
  const ouvrirRapport = (item: any) => {
    setErreur("");
    setAvertissement("");
    setRapportId(item.id);
    setRapport(
      item.meta_data?.entete ? item.meta_data : { corps: item.content },
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const supprimerRapport = async (item: any) => {
    if (!confirm("Supprimer ce rapport de l'historique ?")) return;
    const result: any = await deleteReport(item.id);
    if (result?.error) {
      alert(result.error.message);
      return;
    }
    // si on supprime le rapport affiché, on le ferme
    if (item.id == rapportId) {
      setRapport(null);
      setRapportId(null);
    }
    chargerHistorique();
  };

  // Historique filtré (type + recherche)
  const typesHistorique = [
    { label: "Tous", value: "tous" },
    { label: "Individuels", value: "individual" },
    { label: "Service", value: "service" },
    { label: "Direction", value: "direction" },
  ];

  const historiqueAffiche = historique.filter((item: any) => {
    if (filtreType != "tous" && item.type != filtreType) return false;
    if (!recherche.trim()) return true;
    const texte = (
      item.title +
      " " +
      (item.meta_data?.entete?.reference || "")
    ).toLowerCase();
    return texte.includes(recherche.trim().toLowerCase());
  });

  // Nom du fichier : rapport-de-direction-2026-11-01
  const nomFichier = () => {
    const type = rapport?.entete?.type || "rapport";
    return (
      type
        .toLowerCase()
        .normalize("NFD")
        .replace(/[^a-z0-9]+/g, "-") +
      "-" +
      new Date().toISOString().slice(0, 10)
    );
  };

  // PDF : on passe par l'impression du navigateur ("Enregistrer en PDF")
  const telechargerPDF = () => {
    const titreAvant = document.title;
    document.title = nomFichier(); // nom proposé pour le fichier PDF
    window.print();
    document.title = titreAvant;
  };

  // Word : on enregistre le HTML du document dans un fichier .doc
  const telechargerWord = () => {
    const contenu = document.getElementById("rapport-document")?.innerHTML;
    if (!contenu) return;

    const html =
      '<html><head><meta charset="utf-8"><style>' +
      WORD_STYLES +
      "</style></head><body>" +
      contenu +
      "</body></html>";

    const fichier = new Blob(["﻿", html], { type: "application/msword" });
    const lien = document.createElement("a");
    lien.href = URL.createObjectURL(fichier);
    lien.download = nomFichier() + ".doc";
    lien.click();
    URL.revokeObjectURL(lien.href);
  };

  useEffect(() => {
    const GetUser = async () => {
      const data = await getcurrentUser();
      setUserData(data);
    };

    GetUser();
    chargerHistorique();
  }, []);

  return (
    <div className="space-y-6">
      <CreateRapport
        generate={generate}
        isLoading={isLoading}
        isAdmin={useData?.isAdmin}
      />

      {isLoading && (
        <p className="flex items-center gap-2 text-muted-foreground">
          <Loader className="animate-spin" /> Rédaction du rapport en cours...
          cela peut prendre une minute.
        </p>
      )}

      {erreur && <p className="text-red-500">{erreur}</p>}

      {avertissement && (
        <p className="rounded-md border border-orange-300 bg-orange-50 p-3 text-orange-700">
          {avertissement}
        </p>
      )}

      {rapport && (
        <>
          <div className="flex flex-wrap gap-2">
            <Button onClick={telechargerPDF}>
              <Printer /> Télécharger en PDF
            </Button>
            <Button variant="outline" onClick={telechargerWord}>
              <FileDown /> Télécharger en Word
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(rapport.corps || "");
                alert("Texte du rapport copié !");
              }}
            >
              <Copy /> Copier le texte
            </Button>
          </div>

          <RapportDocument rapport={rapport} />
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2">
            <History /> Historique des rapports
          </CardTitle>
          <CardDescription>
            Vos rapports déjà générés ({historique.length}). Cliquez sur un
            rapport pour l'ouvrir et le télécharger à nouveau.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {typesHistorique.map((item) => (
                <Button
                  key={item.value}
                  variant={filtreType == item.value ? "default" : "outline"}
                  onClick={() => setFiltreType(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <Input
              placeholder="Rechercher (titre, référence)..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="sm:w-64"
            />
          </div>

          {historiqueAffiche.length == 0 ? (
            <p className="text-muted-foreground">
              {historique.length == 0
                ? "Aucun rapport pour le moment."
                : "Aucun rapport ne correspond à votre recherche."}
            </p>
          ) : (
            <ul className="space-y-2">
              {historiqueAffiche.map((item: any) => {
                const entete = item.meta_data?.entete;
                return (
                  <li
                    key={item.id}
                    className={
                      "flex items-center justify-between gap-2 p-2 rounded-md " +
                      (item.id == rapportId
                        ? "bg-blue-50 border border-blue-300"
                        : "bg-secondary")
                    }
                  >
                    <button
                      className="flex items-start gap-2 text-left hover:underline"
                      onClick={() => ouvrirRapport(item)}
                    >
                      <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>
                        {entete?.type || item.title}
                        <span className="block text-xs text-muted-foreground">
                          {entete
                            ? "Du " +
                              entete.dateDebut +
                              " au " +
                              entete.dateFin +
                              " · Réf. " +
                              entete.reference
                            : ""}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          Généré le{" "}
                          {new Date(item.created_at).toLocaleString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {item.meta_data?.indicateurs
                            ? " · " +
                              item.meta_data.indicateurs.terminees +
                              " tâche(s) réalisée(s)"
                            : ""}
                        </span>
                      </span>
                    </button>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => ouvrirRapport(item)}
                      >
                        Ouvrir
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        title="Supprimer"
                        onClick={() => supprimerRapport(item)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Rapports;
