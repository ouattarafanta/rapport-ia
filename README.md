# ReportFlow

Application de suivi des tâches et de génération de rapports avec l'IA.

- L'**administrateur** se connecte avec Google, crée son entreprise, ses services et les comptes de son équipe.
- Les **membres** se connectent avec leur identifiant (ex : `fanta@trabad`) et le mot de passe donné par l'administrateur.

## Lancer le projet

1. Copier `.env.example` en `.env` et remplir les clés
2. `npm install`
3. `npm run dev`

## Base de données

Exécuter le fichier `supabase/migrations/20261101000000_securite_rls.sql`
dans l'éditeur SQL de Supabase (une seule fois).
