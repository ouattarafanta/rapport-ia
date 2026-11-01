"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Affiche un rapport comme un document officiel (format A4)
export function RapportDocument({ rapport }: any) {
  const entete = rapport?.entete;
  const indicateurs = rapport?.indicateurs;

  // anciens rapports enregistrés sans en-tête : on affiche juste le texte
  if (!entete) {
    return (
      <div
        id="rapport-document"
        className="print-area prose prose-slate max-w-none rounded-xl border bg-white p-6 shadow-sm"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {rapport?.corps || ""}
        </ReactMarkdown>
      </div>
    );
  }

  const chiffres = [
    { label: "Tâches réalisées", valeur: indicateurs.terminees },
    { label: "Tâches en cours", valeur: indicateurs.enCours },
    { label: "Tâches en retard", valeur: indicateurs.enRetard },
    { label: "Taux de réalisation", valeur: indicateurs.tauxRealisation + " %" },
  ];

  return (
    <div
      id="rapport-document"
      className="print-area mx-auto w-full max-w-[210mm] bg-white text-slate-900 shadow-sm border rounded-xl"
    >
      <div className="p-10 space-y-8">
        {/* ===== En-tête : l'entreprise ===== */}
        <header className="flex items-start justify-between gap-6 border-b-4 border-blue-700 pb-6">
          <div>
            <p className="text-2xl font-bold uppercase tracking-wide">
              {entete.entreprise.nom}
            </p>
            {entete.entreprise.description && (
              <p className="mt-1 max-w-md text-sm text-slate-600">
                {entete.entreprise.description}
              </p>
            )}
            <p className="mt-1 text-sm text-slate-600">
              {entete.entreprise.email}
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p className="font-semibold uppercase">Document interne</p>
            <p>Réf. {entete.reference}</p>
            <p>Émis le {entete.dateEmission}</p>
          </div>
        </header>

        {/* ===== Titre ===== */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold uppercase tracking-wide text-blue-800">
            {entete.type}
          </h1>
          <p className="text-slate-600">
            Période : {entete.periode} — du {entete.dateDebut} au{" "}
            {entete.dateFin}
          </p>
        </div>

        {/* ===== Fiche d'identification ===== */}
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["Établi par", entete.auteur + " — " + entete.poste],
              ["Périmètre", entete.perimetre],
              ["Collaborateurs concernés", indicateurs.collaborateurs],
              ["Date d'émission", entete.dateEmission],
              ["Référence", entete.reference],
            ].map(([label, valeur]: any) => (
              <tr key={label}>
                <th className="w-1/3 border border-slate-300 bg-slate-100 px-3 py-2 text-left font-semibold">
                  {label}
                </th>
                <td className="border border-slate-300 px-3 py-2">{valeur}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ===== Indicateurs clés ===== */}
        <section className="space-y-3">
          <h2 className="border-l-4 border-blue-700 pl-3 text-lg font-bold uppercase">
            Indicateurs clés
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {chiffres.map((chiffre) => (
              <div
                key={chiffre.label}
                className="rounded-md border border-slate-300 p-3 text-center"
              >
                <p className="text-2xl font-bold text-blue-800">
                  {chiffre.valeur}
                </p>
                <p className="text-xs text-slate-600">{chiffre.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Tableau par service (direction) ===== */}
        {rapport.parService?.length > 0 && (
          <TableauChiffres
            titre="Activité par service"
            colonnes={["Service", "Collaborateurs", "Réalisées", "En cours", "En retard"]}
            lignes={rapport.parService.map((l: any) => [
              l.service,
              l.collaborateurs,
              l.terminees,
              l.enCours,
              l.enRetard,
            ])}
          />
        )}

        {/* ===== Tableau par collaborateur (service et direction) ===== */}
        {rapport.parMembre?.length > 0 && (
          <TableauChiffres
            titre="Activité par collaborateur"
            colonnes={["Collaborateur", "Poste", "Service", "Réalisées", "En cours", "En retard"]}
            lignes={rapport.parMembre.map((l: any) => [
              l.nom,
              l.poste,
              l.service,
              l.terminees,
              l.enCours,
              l.enRetard,
            ])}
          />
        )}

        {/* ===== Corps rédigé par l'IA ===== */}
        <article className="prose prose-slate max-w-none prose-h2:border-l-4 prose-h2:border-blue-700 prose-h2:pl-3 prose-h2:text-lg prose-h2:uppercase prose-table:text-sm prose-th:border prose-th:border-slate-300 prose-th:bg-slate-100 prose-th:px-3 prose-th:py-2 prose-td:border prose-td:border-slate-300 prose-td:px-3 prose-td:py-2">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {rapport.corps || ""}
          </ReactMarkdown>
        </article>

        {/* ===== Signatures ===== */}
        <section className="grid grid-cols-2 gap-6 pt-6 text-sm">
          <div>
            <p className="font-semibold">Établi par</p>
            <p className="h-10 text-slate-600">
              {entete.auteur}
              <br />
              {entete.poste}
            </p>
            <div className="h-20 border-b border-slate-400" />
            <p className="mt-1 text-xs text-slate-500">Signature</p>
          </div>
          <div>
            <p className="font-semibold">Visa de la direction</p>
            <p className="h-10 text-slate-600">Nom et fonction :</p>
            <div className="h-20 border-b border-slate-400" />
            <p className="mt-1 text-xs text-slate-500">Date et signature</p>
          </div>
        </section>

        {/* ===== Pied de page ===== */}
        <footer className="border-t border-slate-300 pt-3 text-center text-xs text-slate-500">
          {entete.entreprise.nom} — {entete.reference} — Document confidentiel,
          usage interne uniquement. Généré avec ReportFlow le{" "}
          {entete.dateEmission}.
        </footer>
      </div>
    </div>
  );
}

function TableauChiffres({ titre, colonnes, lignes }: any) {
  return (
    <section className="space-y-3">
      <h2 className="border-l-4 border-blue-700 pl-3 text-lg font-bold uppercase">
        {titre}
      </h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {colonnes.map((colonne: string) => (
              <th
                key={colonne}
                className="border border-slate-300 bg-slate-100 px-3 py-2 text-left font-semibold"
              >
                {colonne}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne: any[], index: number) => (
            <tr key={index}>
              {ligne.map((cellule, i) => (
                <td key={i} className="border border-slate-300 px-3 py-2">
                  {cellule}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
